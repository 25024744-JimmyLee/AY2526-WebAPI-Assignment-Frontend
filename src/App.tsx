import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/protected-route";
import { AppLayout } from "./layouts/app-layout";
import { AddFilmPage } from "./pages/add-film-page";
import { AdminDashboardPage } from "./pages/admin-dashboard-page";
import { AccountPage } from "./pages/account-page";
import { EditFilmPage } from "./pages/edit-film-page";
import { FilmDetailsPage } from "./pages/film-details-page";
import { HomePage } from "./pages/home-page";
import { LoginPage } from "./pages/login-page";
import { NotFoundPage } from "./pages/not-found-page";
import { RegisterAdminPage } from "./pages/register-admin-page";
import { SignupPage } from "./pages/signup-page";
import { AuthProvider } from "./store/auth-store";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />} path="/">
              <Route element={<HomePage />} index />
              <Route element={<FilmDetailsPage />} path="films/:filmId" />
              <Route element={<LoginPage />} path="login" />
              <Route element={<SignupPage />} path="signup" />
              <Route element={<RegisterAdminPage />} path="register-admin" />
              <Route element={<ProtectedRoute />}>
                <Route element={<AccountPage />} path="account" />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route element={<AdminDashboardPage />} path="admin" />
                <Route element={<AddFilmPage />} path="admin/films/new" />
                <Route element={<EditFilmPage />} path="admin/films/:filmId/edit" />
              </Route>
              <Route element={<NotFoundPage />} path="*" />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
