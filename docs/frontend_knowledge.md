# Frontend Knowledge Base - Fitma.ai

## Frontend Architecture
The Fitma.ai frontend is a modern, responsive Single Page Application (SPA) built using React. It serves as the primary user interface for interacting with the Liva AI companion, logging meals and water, viewing daily progress, and managing notifications.

## Directory Structure
- `src/app/`: Core app configurations (e.g., App.tsx) and high-level routing.
- `src/screens/`: Page-level components corresponding to distinct routes (`DashboardScreen.tsx`, `ChatScreen.tsx`, `LoginScreen.tsx`).
- `src/components/`: Reusable UI components. Often organized further into `ui/` for primitive components (buttons, dialogs, inputs) based on shadcn/ui patterns.
- `src/providers/`: React Context providers for global state management (e.g., AuthProvider).
- `src/utils/` and `src/utils.ts`: Helper functions (date formatting, API fetch wrappers).
- `src/types/` and `src/types.ts`: TypeScript interfaces and type definitions defining the data contracts for Users, Meals, and AI responses.
- `src/styles/`: Global stylesheets, Tailwind configuration imports (`index.css`).
- `public/`: Static assets, including the vital `service-worker.js` for intercepting and displaying Web Push Notifications in the background.

## State Management
- **Local State**: Managed via `useState` and `useReducer` for component-specific interactions (like form inputs in the Chat screen).
- **Global State**: Managed via React Context (`createContext`) for application-wide data such as:
  - User Authentication Status
  - Current User Profile (Goals, Name, Macros)
- **Persisted State**: Uses `localStorage` (or `sessionStorage`) for caching tokens and device IDs (`fitma_token`).
- **Server State**: Currently handled via direct `fetch` calls. *Future Improvement*: Integrate React Query (TanStack Query) for robust data fetching, caching, and mutation states.

## Routing & Navigation
- Utilizes `react-router-dom` for client-side routing.
- Screens are lazy-loaded where applicable to improve initial bundle size.

## UI Design & Styling
- **CSS Framework**: Tailwind CSS (v4) for utility-first styling.
- **Component Library**: `shadcn/ui` based on Radix UI primitives. This allows for fully accessible, unstyled components that are styled via Tailwind.
- **Animations**: Framer Motion is used for micro-interactions (e.g., the Liva voice wave animation, page transitions).
- **Dynamic Classes**: The `cn()` utility (combining `clsx` and `tailwind-merge`) is heavily utilized in UI components to merge conditional Tailwind classes safely.

## API Integration Layer
- All backend communication flows through the `/api` endpoints defined in `docs/API_DOCUMENTATION.md`.
- Components typically make `fetch` requests directly. 
- Payload construction for the Liva Chat (`/api/chat`) requires merging the user's `message`, `profile`, `loggedMeals`, and `memories` context from the global state.

## Web Push Notifications & Service Worker
- The frontend registers `public/service-worker.js` via the `navigator.serviceWorker` API.
- The `pushManager.subscribe` method uses the VAPID public key to generate a subscription object.
- This subscription is sent to the backend (`/api/notifications/subscribe`) to enable the server to push silent reminders and notifications even when the web app is closed.

## Error Handling & Loading States
- Loading states (spinners, skeleton loaders) are managed locally within screens during API requests.
- Error handling primarily relies on standard Javascript `try/catch` wrapping `fetch` requests, surfacing errors via generic Toast notifications.

## Authentication Flow
- **Firebase Auth SDK**: Runs entirely on the client side (`LoginScreen.tsx`).
- It handles Email/Password, Google OAuth, and OTP mechanisms.
- Once authenticated, the user profile is either fetched or created in the Firebase Realtime Database.
- The backend relies on the frontend passing the `deviceId` to identify the user for logging meals and sending notifications.

## Future Improvements
- **Data Fetching Strategy**: Refactor native `fetch` calls to use `TanStack Query` for automatic retries, background refetching, and cache invalidation.
- **Backend Authentication**: Pass Firebase ID Tokens to the Node.js backend in the `Authorization` header and verify them via Firebase Admin SDK to secure the `/api` routes.
- **PWA Capabilities**: Expand the Service Worker to cache static assets for offline support (Progressive Web App).
