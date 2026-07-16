## Comprehensive Codebase Analysis, Standardization & Knowledge Documentation

## Objective

Perform a complete, end-to-end analysis of the entire project. Before making any modifications, thoroughly understand the architecture, business logic, folder structure, data flow, dependencies, and coding patterns across both the frontend and backend.

The goal is to transform this project into a well-documented, standardized, and AI-friendly codebase that can serve as the foundation for future agentic development sessions.

---

# Phase 1 — Complete Codebase Analysis

Analyze every part of the project, including but not limited to:

### Frontend

* Project structure
* Routing
* UI architecture
* Components
* Screens
* Shared components
* Hooks
* Context/API layers
* State management
* Utility functions
* Assets
* Styling architecture
* Theme management
* API integrations
* Environment configuration
* Error handling
* Performance optimizations
* Dependencies
* Build configuration

### Backend

* Folder architecture
* API routes
* Controllers
* Services
* Business logic
* Database models
* Database relationships
* Middleware
* Authentication
* Authorization
* Validation
* Error handling
* File uploads
* AI integrations
* Third-party APIs
* Configuration
* Logging
* Background jobs
* Environment variables
* Security practices

Also understand:

* Complete application flow
* Authentication flow
* Data flow
* Request lifecycle
* User journey
* Feature relationships
* Module dependencies
* Naming conventions
* Current architecture decisions

Do not skip any file unless it is generated or irrelevant (node_modules, build folders, etc.).

---

# Phase 2 — Generate Knowledge Documents

After fully understanding the project, create documentation that will act as the **Source of Truth** for all future AI-assisted development.

## 1. Root Knowledge

Create

```
knowledge.md
```

This document should include:

* Project overview
* Product vision
* High-level architecture
* Folder structure
* Tech stack
* Coding conventions
* Naming conventions
* API architecture
* Database overview
* Environment setup
* Build process
* Deployment notes
* Common patterns
* Reusable utilities
* Current limitations
* Future considerations
* Best practices for contributors
* AI development guidelines
* Important implementation decisions
* Things that should never be changed without understanding their impact

This file should provide enough context for any AI agent to understand the entire project before writing code.

---

## 2. Frontend Knowledge

Create

```
frontend/knowledge.md
```

Include:

* Frontend architecture
* Screen hierarchy
* Component architecture
* Routing structure
* Navigation
* State management
* API layer
* Shared components
* UI design patterns
* Styling conventions
* Folder responsibilities
* Performance considerations
* Reusable hooks
* Common utilities
* Component communication
* Data flow
* Error handling
* Loading states
* Form patterns
* Validation patterns
* Future improvements

---

## 3. Backend Knowledge

Create

```
backend/knowledge.md
```

Include:

* Backend architecture
* API design
* Route organization
* Controllers
* Services
* Models
* Middleware
* Authentication flow
* Authorization
* Database schema
* Business logic
* AI integrations
* Third-party integrations
* Validation strategy
* Error handling
* Logging
* Security practices
* Folder responsibilities
* Dependency graph
* Request lifecycle
* Coding standards
* Performance considerations
* Scalability considerations
* Future improvements

---

# Phase 3 — Codebase Standardization

Once the project has been fully analyzed, standardize the codebase without changing existing functionality.

Focus on:

## Folder Structure

* Organize folders consistently.
* Remove unnecessary nesting.
* Place files in logical locations.
* Group related functionality.

---

## Naming

Standardize:

* File names
* Folder names
* Variables
* Functions
* Components
* Interfaces
* Types
* Constants
* Enums

Use a single naming convention throughout the project.

---

## Code Style

Make the codebase consistent by:

* Removing duplicate logic
* Eliminating dead code
* Removing commented-out code
* Simplifying complex functions
* Improving readability
* Standardizing imports
* Organizing exports
* Improving formatting
* Improving comments where helpful
* Following consistent patterns

---

## Architecture

Refactor where appropriate to achieve:

* Better separation of concerns
* Improved modularity
* Reusable utilities
* Shared abstractions
* Cleaner dependency boundaries
* Reduced code duplication

---

## Error Handling

Standardize:

* API responses
* Error handling
* Logging
* Exception management
* Validation messages

---

## Configuration

Standardize:

* Environment variables
* Constants
* Config files
* Secrets handling
* Feature flags (if applicable)

---

## Documentation

Ensure every major module has concise documentation explaining:

* Purpose
* Responsibilities
* Dependencies
* Public interfaces
* Extension points

---

# Phase 4 — AI-Friendly Repository

Prepare the repository so future AI coding agents can become productive with minimal context.

Where appropriate, add or improve:

* README.md
* knowledge.md files
* Architecture documentation
* Module documentation
* Setup instructions
* Development workflow
* Coding standards
* Contribution guidelines

The objective is that a future AI agent should understand the project within minutes simply by reading these documents.

---

# Constraints

* Do **not** change business logic unless a clear bug is identified.
* Do **not** introduce breaking changes.
* Preserve all existing functionality.
* Keep commits/refactors incremental and traceable.
* Prefer readability and maintainability over clever implementations.
* Document every architectural decision that affects future development.

---

# Deliverables

By the end of this task, provide:

* Root `knowledge.md`
* `frontend/knowledge.md`
* `backend/knowledge.md`
* Standardized folder structure
* Consistent naming conventions
* Refactored, clean, maintainable code
* Reduced duplication
* Improved architecture where appropriate
* Updated documentation
* A concise summary of all significant changes, refactors, and recommendations for future development.

These knowledge documents should become the permanent **Source of Truth** for all future agentic coding sessions and repository onboarding.
