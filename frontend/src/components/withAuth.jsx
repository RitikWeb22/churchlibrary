import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";

export function withAuth(Component) {
  return (props) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      // Redirect to login page if not authenticated
      return <Navigate to="/auth" replace />;
    }
    // Render the protected component if authenticated
    return <Component {...props} />;
  };
}
