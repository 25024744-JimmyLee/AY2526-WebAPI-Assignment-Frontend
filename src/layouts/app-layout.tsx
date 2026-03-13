import { Outlet } from "react-router-dom";

import { Navbar } from "../components/navbar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <div aria-hidden="true" className="app-shell__glow app-shell__glow--left" />
      <div aria-hidden="true" className="app-shell__glow app-shell__glow--right" />
      <Navbar />
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
