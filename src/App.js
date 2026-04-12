import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/terms/Terms";
import DashboardPage from "./pages/DashboardPage";
// import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
// import UsersPage from "./pages/UsersPage";
import { AdminRoute, ProtectedRoute } from "./service/Guard";
import TasksPage from "./pages/tasks/TasksPage";
import MembersPage from "./pages/members/MembersPage";
import AddEditProjectPage from "./pages/projects/AddEditProjectPage";

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
          path='/create'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        />

        <Route
          path='/update/:project_id'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        />

        <Route
          path='/tasks'
          element={<ProtectedRoute element={<TasksPage />} />}
        />

        {/* Tasks */}
        {/* <Route
          path='/tasks'
          element={<ProtectedRoute element={<TaskListPage />} />}
        />
        <Route
          path='/add-task'
          element={<AdminRoute element={<AddEditTaskPage />} />}
        />
        <Route
          path='/edit-task/:taskId'
          element={<AdminRoute element={<AddEditTaskPage />} />}
        /> */}

        {/* Projects */}
        {/* <Route
          path='/projects'
          element={<AboutPage element={<ProjectListPage />} />}
        />
        <Route
          path='/add-project'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        />
        <Route
          path='/edit-project/:projectId'
          element={<AdminRoute element={<AddEditProjectPage />} />}
        /> */}

        {/* Admin Only */}
        {/* <Route
          path='/users'
          element={<AdminRoute element={<UserListPage />} />}
        /> */}

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
        {/* ADMIN ROUTES */}
        {/* <Route
          path='/category'
          element={<AdminRoute element={<CategoryPage />} />}
        /> */}
        {/* <Route
          path='/supplier'
          element={<AdminRoute element={<SupplierPage />} />}
        /> */}
        {/* <Route
          path='/add-supplier'
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        // /> */}
        {/* <Route
        path='/edit-supplier/:supplierId'
        {element={<AdminRoute element={<AddEditSupplierPage />
        * /> */}
      </Routes>
    </Router>
  );
}

export default App;
