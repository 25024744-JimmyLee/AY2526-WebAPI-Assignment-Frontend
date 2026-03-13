import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../store/auth-store";

export function ProtectedRoute() {
  const { isAuthenticated, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <section className="status-card">Restoring session...</section>;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
}
