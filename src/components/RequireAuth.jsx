import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  if (!auth?.token) return <Navigate to="/login" state={{ from: location }} replace />;

  try {
    const [, payloadBase64] = auth.token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp < now) {
      localStorage.removeItem("auth");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (e) {
    localStorage.removeItem("auth");
    return <Navigate to="/login" replace />;
  }
  

  // Puedes agregar validación de expiración del token si lo necesitas
  return children;
};

export default RequireAuth;
