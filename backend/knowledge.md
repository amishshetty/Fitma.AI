# Backend Knowledge Base - Fitma.ai

## Backend Architecture
The Fitma.ai backend is a Node.js/Express application that serves the frontend, exposes API endpoints, and orchestrates the integration with Google Generative AI (Gemini). It's structured in a modular fashion separating routing, business logic (services), and request handling (controllers).

## Directory Structure
- `backend/routes/`: Express route definitions.
- `backend/controllers/`: Route handlers handling request/response logic and validation.
- `backend/services/`: Core business logic (e.g., Liva AI integration, prompt building).
- `backend/config/`: Configuration files and environment variable loading.

## Request Lifecycle
1. Request hits `/api/*` endpoint via Express Router.
2. Route is mapped to a specific Controller method.
3. Controller validates request payload (e.g., user profile, message text).
4. Controller delegates heavy lifting to a Service (e.g., calling Gemini AI).
5. Service processes the data and returns the result.
6. Controller formats the final JSON response and sends it back to the client.

## Authentication & Authorization
- The backend currently trusts the client for user profile information passed via the request body.
- *Future Improvement*: Implement JWT validation middleware to ensure requests to `/api/chat` are made by authenticated Firebase users, checking `Authorization: Bearer <token>`.

## Integrations
- **Google Generative AI (Gemini)**: Handled via `@google/generative-ai`. Provides natural language processing, intent detection, and meal logging parsing.
- **Mock Mode Fallback**: If the Gemini API key is missing or invalid, the backend intelligently falls back to a deterministic Mock Engine to ensure the app remains functional.

## Error Handling
- Controllers use try/catch blocks for async operations.
- Specific HTTP status codes (400 for bad request, 500 for server errors) are returned.
- On AI failure, the system falls back to the Mock Mode instead of crashing.
- `console.error` is used for basic logging.

## Performance & Scalability
- Express is lightweight and fast.
- *Future Improvement*: Add a rate limiter to `/api/chat` to prevent abuse of the Gemini API.

## Coding Standards
- Use ES Modules (`import/export`).
- Use async/await for asynchronous operations.
- Ensure all endpoints return consistent JSON structures (e.g., `{ success: true, data: ... }` or `{ success: false, error: ... }`).
