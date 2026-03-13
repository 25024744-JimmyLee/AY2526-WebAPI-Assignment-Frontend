import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "../src/store/auth-store";

const getCurrentUser = vi.fn();

vi.mock("../src/api/auth-api", () => {
  return {
    getCurrentUser: (...args: unknown[]) => getCurrentUser(...args)
  };
});

function AuthProbe() {
  const { isAuthenticated, isRestoringSession, user } = useAuth();

  return (
    <div>
      <span>{isRestoringSession ? "restoring" : "ready"}</span>
      <span>{isAuthenticated ? "authenticated" : "anonymous"}</span>
      <span>{user?.displayName ?? "no-user"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    getCurrentUser.mockReset();
  });

  it("restores a valid administrator session from token storage", async () => {
    localStorage.setItem("cinemavault-token", "valid-token");
    getCurrentUser.mockResolvedValue({
      id: "admin-1",
      email: "admin@cinemavault.local",
      displayName: "CinemaVault Admin",
      role: "ADMIN"
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("ready")).toBeInTheDocument();
      expect(screen.getByText("authenticated")).toBeInTheDocument();
      expect(screen.getByText("CinemaVault Admin")).toBeInTheDocument();
    });
  });

  it("clears an invalid stored token", async () => {
    localStorage.setItem("cinemavault-token", "expired-token");
    localStorage.setItem(
      "cinemavault-user",
      JSON.stringify({
        id: "admin-1",
        email: "admin@cinemavault.local",
        displayName: "CinemaVault Admin",
        role: "ADMIN"
      })
    );
    getCurrentUser.mockRejectedValue(new Error("expired"));

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("ready")).toBeInTheDocument();
      expect(screen.getByText("anonymous")).toBeInTheDocument();
      expect(screen.getByText("no-user")).toBeInTheDocument();
    });

    expect(localStorage.getItem("cinemavault-token")).toBeNull();
    expect(localStorage.getItem("cinemavault-user")).toBeNull();
  });
});
