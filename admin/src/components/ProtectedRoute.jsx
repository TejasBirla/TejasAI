import React from "react";
import { Navigate } from "react-router-dom";
import useAdmin  from "../context/useAdmin";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
