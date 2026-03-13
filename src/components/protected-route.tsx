import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../store/auth-store";

type ProtectedRouteProps = {
  allowedRoles?: Array<"ADMIN" | "USER">;
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isRestoringSession, user } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <section className="status-card">Restoring session...</section>;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/account" />;
  }

  return <Outlet />;
}
