import { Link } from "react-router-dom";

import { useAuth } from "../store/auth-store";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="navbar">
      <div className="navbar__brand-block">
        <Link className="navbar__brand" to="/">
          CinemaVault
        </Link>
        <p className="navbar__tagline">Curated archive for modern cinema management</p>
      </div>

      <nav className="navbar__links">
        <Link className="navbar__link" to="/">
          Browse
        </Link>
        {isAuthenticated ? (
          <Link className="navbar__link" to="/account">
            Account
          </Link>
        ) : (
          <Link className="navbar__link" to="/signup">
            Sign up
          </Link>
        )}
        {isAdmin ? (
          <Link className="navbar__link" to="/admin">
            Admin
          </Link>
        ) : null}
        {!isAuthenticated ? (
          <Link className="navbar__link" to="/register-admin">
            Admin register
          </Link>
        ) : null}
        {user ? <span className="navbar__user">{user.displayName}</span> : null}
        {isAuthenticated ? (
          <button className="button-link" onClick={logout} type="button">
            Logout
          </button>
        ) : (
          <Link className="button-link" to="/login">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
