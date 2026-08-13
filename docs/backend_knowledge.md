# Backend Knowledge Base - Fitma.ai

## Backend Architecture
The Fitma.ai backend is a Node.js/Express application that serves the frontend in production, exposes API endpoints, and orchestrates the integration with Google Generative AI (Gemini). It's structured in a modular fashion separating routing, business logic (services), request handling (controllers), and background tasks.

## Directory Structure
- `backend/routes/`: Express route definitions (`chatRoutes.js`, `visionRoutes.js`, `logRoutes.js`, `notificationRoutes.js`).
- `backend/controllers/`: Route handlers managing request parsing, validation, and invoking services (`chatController.js`, `visionController.js`).
- `backend/services/`: Core business logic (e.g., `chatService.js` handling Liva AI integration, prompt building, and mock engines).
- `backend/config/`: Configuration files and environment variable loading.
- `server.js`: The root entry point of the Express application, combining routing, static file serving (for production), and initializing the cron scheduler.
- `backend/scheduler.js`: The background engine for evaluating push notifications.

## Request Lifecycle
1. Request hits `/api/*` endpoint via Express Router.
2. Route is mapped to a specific Controller method.
3. Controller validates request payload (e.g., user profile, message text, Base64 image).
4. Controller delegates heavy processing to a Service (e.g., calling Gemini AI or Gemini Vision).
5. Service processes the data and returns the parsed result.
6. Controller formats the final JSON response and sends it back to the client.

## Authentication & Authorization
- The backend currently trusts the client (which uses Firebase Client Auth) for user profile and `deviceId` information passed via request bodies.
- *Future Improvement*: Implement JWT validation middleware to ensure requests to `/api/*` are made by authenticated Firebase users, checking `Authorization: Bearer <token>`.

## Database Schema (Firebase Realtime Database)
The backend writes directly to Firebase Realtime Database using the `firebase-admin` SDK.

**Key Paths:**
- `userLogs/{deviceId}/{YYYY-MM-DD}/meals`: Stores list of logged meals (breakfast, lunch, snack, dinner). Each meal has `calories`, `protein`, `carbs`, `fat`, `type`, and `timestamp`.
- `userLogs/{deviceId}/{YYYY-MM-DD}/waterObj`: Stores running total of water intake. Has `total` (in ml) and `lastUpdate` timestamp.
- `pushSubscriptions/{deviceId}/web`: Stores Web Push subscription objects containing `endpoint` and `keys` (`p256dh`, `auth`).
- `pushSubscriptions/{deviceId}/fcmToken`: Stores mobile FCM tokens for cross-platform delivery.

## AI Integrations
- **Google Generative AI (Gemini Flash Lite)**: Accessed via `@google/generative-ai` in `chatController.js`. It provides natural language processing, intent detection, memory context processing, and outputs strict JSON.
- **Gemini Vision**: Accessed in `visionController.js` to parse Base64 food images and return estimated nutritional macros.
- **Mock Mode Fallback**: If the Gemini API key is missing or invalid, the backend gracefully falls back to a deterministic Mock Engine to ensure the app remains functional.
- **CRITICAL NOTE**: Prompts are extremely strict about outputting JSON. Never alter the structural requirements in the system prompt without testing heavily.

## Push Notification System & Background Cron
- `backend/scheduler.js` runs a continuous background evaluation loop via `setInterval` (every 15 minutes in production).
- It reads logs directly from `userLogs/{deviceId}/{today}` using Firebase Admin.

**Notification Logic:**
1. **Meal Reminders**:
   - Base Times: Breakfast (09:00), Lunch (13:00), Dinner (19:30).
   - Escalation logic for missed meals:
     - **+20 mins** (Gentle nudge)
     - **+60 mins** (Quick protein suggestion)
     - **+120 mins** (Streak warning)
2. **Water Reminders**:
   - Active Hours: 9:00 AM to 9:00 PM.
   - Triggers every **3 hours** since the last water log if the daily goal (2500ml) is not met.
3. **Calorie Check**:
   - Time: Exactly **8:30 PM**.
   - Triggers if the user has more than 200 calories remaining from their daily goal, suggesting an evening snack.

## Error Handling & Logging
- Controllers use try/catch blocks for async operations.
- Specific HTTP status codes (400 for bad request, 500 for server errors) are returned.
- System logs to standard out (`console.log`, `console.error`).
- *Future Improvement*: Add a rate limiter to `/api/chat` to prevent abuse of the Gemini API.

## Coding Standards
- Use ES Modules (`import/export`).
- Use async/await for asynchronous operations.
- Do not keep long-running states in memory; use Firebase for persistence.
- Ensure all endpoints return consistent JSON structures (e.g., `{ success: true, ... }` or `{ success: false, error: ... }`).
