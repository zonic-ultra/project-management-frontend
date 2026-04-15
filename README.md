# NEXUS - Project Management Frontend

This repository contains the frontend for NEXUS, a futuristic and robust project management suite designed for high-performance team collaboration. Built with React and styled with Tailwind CSS, it provides a seamless and responsive interface for managing projects, tasks, and team members. The application features a thematic UI inspired by advanced command centers, role-based access control, and secure communication with a backend API.

## Features

- **Secure Authentication:** User registration and login with JWT-based sessions. Local storage is encrypted using `crypto-js` for enhanced security.
- **Role-Based Access Control:** Differentiated views and permissions for `ADMIN` and standard `MEMBER` roles, managed by protected routes.
- **Admin Dashboard:** A high-level command center displaying key metrics like total users, projects, tasks, and a live activity feed of recent changes.
- **Project Management:** Admins can create, read, update, and delete projects (referred to as "Initiatives").
- **Task Management:** A comprehensive "Task Matrix" to create, assign, update, and track tasks. Users can update the status of their assigned tasks, and admins have full CRUD capabilities.
- **Member Registry:** Admins can view a list of all registered users and their roles.
- **Profile Management:** Users can view their profile, update their name and email, and change their password.
- **Audit Logs:** A detailed changelog for tracking all task status modifications, including who made the change, when, and any accompanying remarks.
- **Responsive Design:** A consistent experience across devices, from desktops to mobile, featuring a collapsible sidebar and mobile-friendly layouts.

## Tech Stack

- **Framework:** React
- **Styling:** Tailwind CSS with a custom theme
- **Routing:** React Router
- **API Communication:** Axios
- **Icons:** Lucide React
- **Animation:** Motion
- **Security:** crypto-js for encrypting session data in local storage

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/zonic-ultra/project-management-frontend.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd project-management-frontend
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env.local` file in the root directory of the project. This file will store the base URL for your backend API and the encryption key for local storage.

    ```env
    REACT_APP_API_BASE_URL=http://your-backend-api-url/api
    REACT_APP_ENCRYPTION_KEY=YourSuperSecretAndLongEncryptionKeyForCryptoJS
    ```

5.  **Run the application:**
    ```sh
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

-   **`npm start`**: Runs the app in development mode.
-   **`npm run build`**: Builds the app for production into the `build` folder.
-   **`npm test`**: Launches the test runner in interactive watch mode.
-   **`npm run eject`**: Ejects the app from Create React App, exposing the underlying configurations. This is a one-way operation.

## Project Structure

The codebase is organized to separate concerns and improve maintainability.

```
src/
├── api/            # Axios instance configuration
├── components/     # Reusable UI components (Layout, Sidebar, DataControls, etc.)
├── pages/          # View components for each route (e.g., Dashboard, Login, Tasks)
│   ├── auth/
│   ├── logs/
│   ├── members/
│   ├── profile/
│   ├── projects/
│   └── tasks/
├── service/        # Core application logic
│   ├── ApiService.js  # Centralized methods for all backend API interactions
│   └── Guard.js       # Protected and Admin route components for access control
├── App.js          # Main application component with route definitions
├── index.css       # Global styles and Tailwind CSS directives
└── index.js        # Entry point of the React application
