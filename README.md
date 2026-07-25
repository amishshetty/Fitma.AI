# Fitma.ai 🍏🤖

Fitma.ai is a comprehensive health and nutrition tracking application featuring **Liva**, a personal AI Health Companion. The app is designed to help users log meals, track water intake, monitor calories, and achieve their fitness goals through a seamless, intuitive, and conversational AI-driven experience.

## ✨ Features
- **AI Health Companion (Liva)**: Interact with an AI that understands your goals, diet, and motivation style.
- **Meal & Nutrition Tracking**: Log meals and monitor calories, macros, and dietary habits via natural language or manual entry.
- **Water Intake Tracking**: Keep track of daily hydration effortlessly.
- **Goal Setting**: Set and monitor personal health and fitness goals.
- **Modern UI**: A beautiful, responsive interface built with React, Tailwind CSS, Framer Motion, and shadcn/ui.

## 🛠️ Tech Stack
- **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS (v4), shadcn/ui (Radix UI), Framer Motion.
- **Backend**: Node.js, Express.
- **AI Integration**: Google Generative AI (Gemini API).
- **Database & Auth**: Firebase (Authentication, Realtime Database/Firestore) and MongoDB (via Mongoose).
- **Package Manager**: pnpm / npm.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Firebase Configuration
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary keys for Firebase, MongoDB, and Gemini AI:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Add other required environment variables here
   ```

4. Start the development server (Frontend):
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Start the backend server:
   ```bash
   npm run server
   # or
   pnpm server
   ```

## 📁 Project Structure
- `/src`: Frontend React application.
- `/backend`: Node.js server, controllers, and AI chat logic.
- `/api`: API endpoint definitions and handlers.
- `/public`: Static assets.
- `/dist`: Production build output.

## 💡 Future Considerations
- Migration to a fully typed backend API using tRPC or OpenAPI.
- Implementation of robust unit and integration testing.
- Support for image-based meal logging via the backend using Gemini Vision models.

## 🎨 Design Original
The original design for the onboarding flow is available at [Figma](https://www.figma.com/design/Zb1jYStwfTY90LkH79xDjG/Fitma.ai-Onboarding-Flow).