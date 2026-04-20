import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, requireProfile = true }) {
  const { user, profile, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/70 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (requireProfile && !profile) {
    return <Navigate to="/profiles" replace />;
  }
  return children;
}
