# 🔌 Fitma.ai API Documentation

This document provides a comprehensive overview of the backend REST APIs powering Fitma.ai's web dashboard and the Liva AI Companion.

## Base URL
In local development, the base URL is typically `http://localhost:5000`. In production, use your deployed backend URL.

All routes are prefixed with `/api`.

---

## 1. System Health

### `GET /api/health`
Returns the status of the server and the AI connection state. Used for monitoring uptime and readiness.

**Request Body:** None
**Headers:** None

**Success Response (200 OK):**
```json
{
  "status": "online",
  "assistant": "Liva",
  "ai": "Gemini Connected",
  "timestamp": "2026-07-25T10:00:00.000Z",
  "version": "1.0 MVP"
}
```

---

### `GET /api/debug-key`
Checks whether the Google Gemini API key has been securely loaded into the environment without exposing the full key.

**Request Body:** None
**Headers:** None

**Success Response (200 OK):**
```json
{
  "hasKey": true,
  "length": 39,
  "start": "AIzaS",
  "end": "xyz12"
}
```

---

## 2. Conversational AI (Liva)

### `POST /api/chat`
The core endpoint for the Liva AI companion. It processes user chat messages, detects intent, extracts nutritional data (if logging a meal), and returns contextual conversational responses and personalized food recommendations.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "message": "I just ate 2 rotis and some dal.",
  "localDateStr": "Sat Jul 25 2026",
  "currentTime": "14:30",
  "profile": {
    "name": "User",
    "goal": "Health",
    "diet": "Standard",
    "dailyCalories": 2000,
    "motivationStyle": "Friendly",
    "language": "English"
  },
  "previousMessages": [
    { "sender": "user", "text": "Hi Liva!" },
    { "sender": "liva", "text": "Hello! How can I help you today?" }
  ],
  "loggedMeals": [
    {
      "id": "1690000000000",
      "name": "Apple",
      "calories": 95,
      "protein": 0,
      "carbs": 25,
      "fat": 0,
      "mealType": "snack",
      "dateString": "Sat Jul 25 2026"
    }
  ],
  "memories": [
    "User prefers vegan food",
    "User is allergic to peanuts"
  ],
  "customVocabulary": {
    "dal": "Lentil soup"
  }
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "source": "gemini",
  "intent": "log_meal",
  "response": "Got it! I've logged your 2 rotis and dal. Great choice for lunch!",
  "greeting": null,
  "motivation": "Keep up the good work on your health journey!",
  "mealData": {
    "items": ["2 rotis", "dal"],
    "calories": 300,
    "protein": 12,
    "carbs": 45,
    "fat": 5,
    "mealType": "lunch"
  },
  "summaryData": null,
  "waterData": null,
  "deleteData": null,
  "updateVocabularyData": null,
  "recommendationData": [
    {
      "meal": "Paneer Tikka",
      "message_suffix": "is a great protein addition.",
      "calories": 300,
      "protein": 15,
      "carbs": 10,
      "fat": 20,
      "why": ["High protein"],
      "alternatives": [{ "name": "Tofu", "description": "Vegan option" }],
      "tip": "Eat with a side salad."
    }
  ]
}
```

---

## 3. Vision AI (Food Recognition)

### `POST /api/vision/analyze`
Accepts a Base64 encoded image of a meal, uses Gemini Vision AI to identify the food items, and estimates the calories and macronutrients. It also maintains consistency if the user recently logged similar items.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "mealType": "lunch",
  "recentMeals": [
    {
      "name": "Sandwich",
      "calories": 250,
      "protein": 10
    }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "mealData": {
    "items": ["1 Sandwich", "1 Apple"],
    "calories": 345,
    "protein": 10,
    "mealType": "lunch"
  }
}
```

---

## 4. Push Notifications

### `POST /api/notifications/subscribe`
Subscribe a user device to push notifications via the Web Push API.

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": { "p256dh": "...", "auth": "..." }
  },
  "deviceId": "fitma_user_123"
}
```
**Success Response:** `201 Created`

### `POST /api/notifications/fcm-token`
Save an FCM (Firebase Cloud Messaging) token for cross-device mobile delivery.

**Request Body:**
```json
{
  "fcmToken": "cfs2k3...",
  "deviceId": "fitma_user_123"
}
```
**Success Response:** `200 OK`

### `POST /api/notifications/send`
Manually trigger a push notification (used for testing).

**Request Body:**
```json
{
  "deviceId": "fitma_user_123",
  "title": "Drink Water!",
  "body": "It's been a while since you logged water.",
  "url": "/dashboard"
}
```

### `GET /api/notifications/cron/evaluate`
Trigger the AI reminder background cron engine to evaluate which users need push notifications based on their logging behavior.

### `GET /api/notifications/cron/force`
Force send a test push notification to all subscribed users to verify VAPID/FCM configuration.

---

## 5. Direct Logging

### `POST /api/logs/meal`
Directly log a meal to Firebase Realtime Database.

**Request Body:**
```json
{
  "deviceId": "fitma_user_123",
  "mealType": "lunch",
  "notes": "Healthy salad",
  "calories": 350,
  "protein": 20,
  "carbs": 15,
  "fat": 10
}
```

### `POST /api/logs/water`
Directly log water consumption to Firebase Realtime Database (running total for the day).

**Request Body:**
```json
{
  "deviceId": "fitma_user_123",
  "amountMl": 250
}
```

---

## Error Handling
Standard error responses return an appropriate HTTP status code (e.g., `400 Bad Request`, `500 Internal Server Error`) along with an error JSON object.

```json
{
  "success": false,
  "error": "Failed to generate AI response",
  "response": "I'm having a little trouble connecting to my brain right now. Can you try again in a moment?"
}
```
