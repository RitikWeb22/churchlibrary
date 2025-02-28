import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);

  // If not logged in, redirect to the auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if the user's role is among the allowed roles
  // (Assumes user's role is stored in lowercase)
  if (allowedRoles.length && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
