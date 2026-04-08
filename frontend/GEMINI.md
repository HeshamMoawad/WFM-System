# GEMINI.md: Project Overview and-Context

This document provides a comprehensive overview of the WFM-System frontend project, intended to be used as a foundational context for AI-assisted development.

## 1. Project Overview

This is the frontend for a Workforce Management (WFM) System. It is a complex single-page application (SPA) built to manage various aspects of a workforce, including user management, attendance, salary, financials, leads, and reporting.

### Key Technologies

*   **Framework:** React (`v18.2.0`)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Redux Toolkit and React Context
*   **Routing:** React Router (`v6.22.3`)
*   **Data Visualization:** Chart.js
*   **Form Handling:** React Hook Form
*   **Real-time Communication:** Socket.IO Client

### Architecture

The application is bootstrapped with Create React App. The architecture follows a standard component-based model with a clear separation of concerns:

*   `src/components`: Reusable UI components.
*   `src/pages`: Top-level components for each route/page.
*   `src/layouts`: Wrapper components that define the structure for different parts of the app (e.g., `AuthLayout`).
*   `src/store`: Redux Toolkit setup (store, slices).
*   `src/contexts`: React Context providers for managing cross-cutting concerns like authentication, theme (dark/light mode), and language.
*   `src/hooks`: Custom React hooks.
*   `src/services` & `src/calls`: Logic for making API calls to the backend.
*   `src/types`: Custom TypeScript type definitions.

## 2. Building and Running

### Prerequisites

- Node.js and npm

### Key Commands

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run in Development Mode:**
    Starts the development server on `http://localhost:3000`.
    ```bash
    npm start
    ```
    *Note: A `npm run start-local` script also exists, which may be used for specific network configurations.*

3.  **Create a Production Build:**
    Bundles the app for production into the `build` folder.
    ```bash
    npm run build
    ```

4.  **Run Tests:**
    Launches the test runner in interactive watch mode.
    ```bash
    npm test
    ```

## 3. Development Conventions

### State Management

The project utilizes a hybrid approach to state management:
*   **Redux Toolkit:** Used for managing global application state. The store is configured in `src/store/store.ts`.
*   **React Context:** Used for more localized, cross-cutting concerns. The main entrypoint (`src/index.tsx`) shows contexts for `Auth`, `Version`, `Mode` (theme), and `Language`.

### Routing

*   Routing is centralized in `src/pages/Pages.tsx`.
*   The application uses `react-router-dom` for all routing logic.
*   Most routes are nested within an `AuthLayout`, which likely handles authentication checks and protects routes from unauthorized access. The `/login` route is public.

### Styling

*   **Tailwind CSS** is the primary CSS framework. The configuration is in `tailwind.config.js`.
*   Global styles and Tailwind layer definitions are in `src/index.css`.
*   The application supports a **dark mode**, likely controlled by the `ModeContextProvider`.

### Typing

*   The project is written in **TypeScript** and enforces `"strict": true` for better type safety.
*   Custom type definitions for the project are located in the `src/types` directory, as specified in `tsconfig.json`.
