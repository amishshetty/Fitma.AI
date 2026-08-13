## Comprehensive Codebase Analysis, Standardization & Knowledge Documentation

## Objective

Perform a complete, end-to-end analysis of the entire project to transform this project into a well-documented, standardized, and AI-friendly codebase. This will serve as the foundation for future agentic development sessions.

**CRITICAL AI EXECUTION RULE:** Do not attempt to complete all phases in a single response or session. This is a massive undertaking. Break this down into iterative steps. Create an implementation plan and seek user approval before moving between phases.

---

# Phase 1 — Iterative Codebase Analysis

Analyze the project structure, routing, UI architecture, API layer, database models, and AI integrations. 

* **Frontend:** Focus on React component hierarchy, state management, Tailwind styling, and service workers.
* **Backend:** Focus on Express routes, controllers, Firebase integration, and Gemini AI prompts.

*Note for AI Agent: Use tools to list directories and read key files (like `package.json`, `server.js`, `App.tsx`, etc.). You do not need to read every single file if the architecture is standardized; read a representative sample of components and controllers.*

---

# Phase 2 — Generate Knowledge Documents

Create documentation that will act as the **Source of Truth** for all future AI-assisted development. 
*Note: Save these files in the `/docs` folder to keep the root directory clean.*

## 1. Root Knowledge (`docs/system_architecture.md`)
* Project overview & Product vision
* High-level architecture & Tech stack
* API architecture & Database overview
* Environment setup & Build process
* AI development guidelines & Important implementation decisions

## 2. Frontend Knowledge (`docs/frontend_knowledge.md`)
* Screen hierarchy & Component architecture
* Routing structure & Navigation
* State management & API integration layer
* UI design patterns & Styling conventions (Tailwind/shadcn)

## 3. Backend Knowledge (`docs/backend_knowledge.md`)
* Route organization & Controllers
* Firebase Realtime Database schema
* AI integrations (Gemini, prompts, memory context)
* Push Notification background engine (cron jobs)
* Error handling & Logging

---

# Phase 3 — Codebase Standardization (High Risk)

**CRITICAL RULE:** Refactoring must be done incrementally. Do not attempt a massive, multi-file rewrite. Standardize one module at a time and ensure the application still builds and runs correctly.

Focus on:
* **Folder Structure:** Ensure `/src`, `/backend`, and `/docs` are strictly maintained.
* **Naming:** Enforce PascalCase for React components and camelCase for functions/hooks.
* **Code Style:** Remove unused imports, simplify complex functions, and ensure consistent error handling.
* **Architecture:** Improve modularity and abstract reusable utilities.

---

# Phase 4 — AI-Friendly Repository Configuration

Prepare the repository so future AI coding agents can become productive instantly.

* Ensure `README.md` clearly explains how to start the frontend and backend.
* Create a `.cursorrules` or `AI_INSTRUCTIONS.md` file in the root containing strict coding rules (e.g., "Always use Tailwind v4", "Always use Firebase Admin SDK for backend").
* Document the Data Flow (how a user message travels from React -> Express -> Gemini -> Firebase -> React).

---

# Constraints

* Do **not** change business logic.
* Do **not** introduce breaking changes.
* Preserve all existing functionality.
* Keep commits/refactors incremental and traceable.
* Prefer readability and maintainability over clever implementations.

---

# Deliverables

* Updated `docs/system_architecture.md`
* New `docs/frontend_knowledge.md` and `docs/backend_knowledge.md`
* Iterative refactoring PRs/commits to standardize naming and structure
* A concise summary of all significant changes and recommendations for future development.
