# Fitma.ai - Project Knowledge Base (Root)

## Project Overview
Fitma.ai is a health and nutrition tracking application featuring "Liva", a personal AI Health Companion. The app allows users to log meals, track water intake, monitor calories and macros, and interact with an AI companion for motivation and recommendations. 

## Product Vision
To provide a seamless, intuitive, and AI-driven health tracking experience that feels less like a chore and more like chatting with a supportive friend (Liva) who understands the user's goals, diet, and motivation style.

## High-Level Architecture
- **Frontend**: A React single-page application (SPA) built with Vite, TypeScript, and Tailwind CSS.
- **Backend**: A Node.js/Express server that serves the frontend, handles AI chat logic, and acts as a proxy for the Gemini AI model.
- **Database / Auth**: Firebase (Authentication and Realtime Database/Firestore).

## Folder Structure
- `/src`: Contains the frontend application (React).
- `/backend`: Contains the backend application logic (Express, Controllers, Routes).
- `/dist`: The production build of the frontend application.
- `/public`: Static assets served directly.

## Tech Stack
- **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS (v4), `shadcn/ui` (Radix UI), Framer Motion, Firebase SDK.
- **Backend**: Node.js, Express, Google Generative AI (`@google/generative-ai`), `dotenv`.
- **Package Manager**: pnpm (or npm).

## Coding Conventions
- **Component Naming**: PascalCase for React components and their filenames (e.g., `LivaChatScreen.tsx`).
- **Hooks & Utilities**: camelCase (e.g., `useAuth.ts`, `formatDate.ts`).
- **Styling**: Utility-first CSS using Tailwind CSS and `clsx` + `tailwind-merge` (`cn` utility) for dynamic classes.
- **State Management**: React Hooks (useState, useMemo) and Context API for global state. Firebase for persistence.

## API Architecture
- `/api/chat`: Main endpoint for interacting with the Liva AI. Accepts user profile and message, returns parsed intents (meal logs, water logs, etc.) and AI response.
- `/api/health`: Health check endpoint.

## Future Considerations
- Migrate to a fully typed backend API using tRPC or OpenAPI.
- Implement robust unit and integration testing.
- Add support for image-based meal logging via the backend using Gemini Vision models.

## AI Development Guidelines
- Always prioritize modularity. When adding a new feature, create a separate component rather than bloat existing ones.
- Refer to `frontend/knowledge.md` for UI patterns and `backend/knowledge.md` for server-side architecture.
- Keep dependencies updated and follow the `shadcn/ui` patterns for new UI components.
