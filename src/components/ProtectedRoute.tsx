import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  roles?: UserRole[];
  children: ReactNode;
}

const roleRedirect = (role: UserRole) => {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "business") {
    return "/dashboard";
  }

  return "/my-requests";
};

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to={roleRedirect(currentUser.role)} replace />;
  }

  return <>{children}</>;
};
