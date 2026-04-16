import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import TermsPage from "./pages/terms/Terms";
import ProjectsPage from "./pages/projects/ProjectsPage";
import { AdminRoute, ProtectedRoute } from "./service/Guard";
import MembersPage from "./pages/members/MembersPage";
import AddEditProjectPage from "./pages/projects/AddEditProjectPage";
import AddEditTaskPage from "./pages/tasks/AddEditTaskPage";
import ProfilePage from "./pages/profile/ProfilePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TasksPage from "./pages/tasks/TasksPage";
import ChangelogPage from "./pages/logs/ChangeLogPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/terms' element={<TermsPage />} />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<ProfilePage />} />}
        />

        <Route
          path='/dashboard'
          element={<AdminRoute element={<DashboardPage />} />}
        />
        <Route
          path='/members'
          element={<AdminRoute element={<MembersPage />} />}
        />
        <Route
          path='/projects'
          element={<AdminRoute element={<ProjectsPage />} />}
        />

        <Route
          path='/projects/create'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        />

        <Route
          path='/projects/update/:project_id'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        />

        <Route
          path='/tasks'
          element={<ProtectedRoute element={<TasksPage />} />}
        />
        <Route
          path='/tasks/create'
          element={<AdminRoute element={<AddEditTaskPage />} />}
        />
        <Route
          path='/tasks/update/:id'
          element={<AdminRoute element={<AddEditTaskPage />} />}
        />
        <Route
          path='/logs'
          element={<AdminRoute element={<ChangelogPage />} />}
        />
        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
