import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !token) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
