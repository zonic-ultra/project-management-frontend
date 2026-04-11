// !jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation();
  return ApiService.isAuthenticated() ? (
    Component
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};

export const AdminRoute = ({ element: Component }) => {
  const location = useLocation();
  return ApiService.isAdmin() ? (
    Component
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import ApiService from "./ApiService";

// export const ProtectedRoute = ({ element: Component }) => {
//   const location = useLocation();

//   // Double check with try-catch for safety
//   let isAuthenticated = false;
//   try {
//     isAuthenticated = ApiService.isAuthenticated();
//   } catch (e) {
//     isAuthenticated = false;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to='/login' replace state={{ from: location }} />;
//   }

//   return Component;
// };

// export const AdminRoute = ({ element: Component }) => {
//   const location = useLocation();

//   let isAuthenticated = false;
//   let isAdmin = false;

//   try {
//     isAuthenticated = ApiService.isAuthenticated();
//     if (isAuthenticated) {
//       isAdmin = ApiService.isAdmin();
//     }
//   } catch (e) {
//     isAuthenticated = false;
//     isAdmin = false;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to='/login' replace state={{ from: location }} />;
//   }

//   if (!isAdmin) {
//     return <Navigate to='/tasks' replace state={{ from: location }} />;
//   }

//   return Component;
// };
