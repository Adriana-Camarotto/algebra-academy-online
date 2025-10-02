import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAuthStore } from "@/lib/auth";

interface AuthProtectedRouteProps {
  children: ReactNode;
}

export const AuthProtectedRoute: React.FC<AuthProtectedRouteProps> = ({
  children,
}) => {
  const { loading } = useSupabaseAuth();
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  console.log("AuthProtectedRoute check:", {
    loading,
    isAuthenticated,
    user: user?.email,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
