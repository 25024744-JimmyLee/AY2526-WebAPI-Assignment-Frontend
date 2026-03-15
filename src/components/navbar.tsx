import { Link } from "react-router-dom";

import { useAuth } from "../store/auth-store";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

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
        <Link className="navbar__link" to="/admin">
          Admin
        </Link>
        {isAuthenticated ? (
          <button className="button-link" onClick={logout} type="button">
            Logout
          </button>
        ) : (
          <Link className="button-link" to="/login">
            Admin login
          </Link>
        )}
      </nav>
    </header>
  );
}
