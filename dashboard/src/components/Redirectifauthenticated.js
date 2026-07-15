import React from "react";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ user, children }) => {
  if (user === undefined) {
    return <p>Loading...</p>;
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectIfAuthenticated;
