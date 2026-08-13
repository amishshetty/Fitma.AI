# Fitma.ai - Project Knowledge Base (Root)

## Project Overview
Fitma.ai is an AI-first health and nutrition tracking application featuring "Liva", a personal AI Health Companion. The app allows users to log meals via voice and images, track water intake, monitor calories and macros, and interact with an AI companion for proactive motivation and recommendations.

## Product Vision
To provide a seamless, intuitive, and AI-driven health tracking experience that feels less like a chore and more like chatting with a supportive friend (Liva) who understands the user's goals, diet, remembers past preferences, and actively reaches out.

## High-Level Architecture
- **Frontend**: A React single-page application (SPA) built with Vite, TypeScript, and Tailwind CSS (v4). It uses Service Workers for Web Push Notifications.
- **Backend**: A Node.js/Express server handling AI chat logic, vision processing, push notification cron jobs, and acting as a secure proxy for Gemini models.
- **Database / Auth**: Firebase (Authentication on the client side, Realtime Database for logging and push subscriptions).

## Folder Structure
- `/src`: Contains the frontend application (React, Tailwind, Service Workers).
- `/backend`: Contains the backend application logic (Controllers, Routes, Services, background scheduler).
- `/docs`: Central repository for all project documentation (PRD, APIs, Architecture).
- `/scripts`: Utility scripts for database or system management.
- `/tests/manual`: Checklists for manual and exploratory testing.

## Tech Stack
- **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS (v4), `shadcn/ui` (Radix UI), Framer Motion, Firebase SDK, Web-Push API.
- **Backend**: Node.js, Express, Google Generative AI (`@google/generative-ai`), `web-push`, Firebase Admin SDK.
- **Package Manager**: pnpm (or npm).

## Coding Conventions
- **Component Naming**: PascalCase for React components and their filenames (e.g., `LivaChatScreen.tsx`).
- **Hooks & Utilities**: camelCase (e.g., `useAuth.ts`, `formatDate.ts`).
- **Styling**: Utility-first CSS using Tailwind CSS and `clsx` + `tailwind-merge` (`cn` utility) for dynamic classes.
- **State Management**: React Hooks (useState, useMemo) and Context API for global state. Firebase for persistence.
- **Background Tasks**: Express background loops using `setInterval` for push notification evaluation.

## API Architecture
- `/api/chat`: Main endpoint for interacting with the Liva AI. Accepts user profile, message, and memory context.
- `/api/vision/analyze`: Processes food images (Base64) to extract nutritional data via Gemini Vision models.
- `/api/notifications/*`: Manages Web Push subscriptions, FCM tokens, and triggers the cron reminder engine.
- `/api/logs/*`: Direct database insertion endpoints for meals and water.
- `/api/health`: System and AI connectivity status.

## Future Considerations
- Migrate to a fully typed backend API using tRPC or OpenAPI.
- Implement robust unit and integration testing.
- Implement cross-platform mobile apps using React Native/Expo leveraging the existing API.

## AI Development Guidelines
- Always prioritize modularity. When adding a new feature, create a separate component rather than bloat existing ones.
- Refer to `API_DOCUMENTATION.md` for integrating backend features.
- Keep dependencies updated and follow the `shadcn/ui` patterns for new UI components.
- Do not hardcode specific AI model names in public documentation as per the "secret ingredient" rule.
