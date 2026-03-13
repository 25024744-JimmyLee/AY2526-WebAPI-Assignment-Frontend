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

function AuthUpdater() {
  const { updateUser, user } = useAuth();

  return (
    <div>
      <button
        onClick={() =>
          updateUser({
            profilePhotoDataUrl: "data:image/png;base64,updated"
          })
        }
        type="button"
      >
        update-user
      </button>
      <span>{user?.profilePhotoDataUrl ?? "no-photo"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    getCurrentUser.mockReset();
  });

  it("restores a valid user session from token storage", async () => {
    localStorage.setItem("cinemavault-token", "valid-token");
    getCurrentUser.mockResolvedValue({
      id: "admin-1",
      email: "admin@cinemavault.local",
      displayName: "CinemaVault Admin",
      role: "ADMIN",
      profilePhotoDataUrl: null
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
        role: "ADMIN",
        profilePhotoDataUrl: null
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

  it("updates the cached user payload without replacing the whole session", async () => {
    localStorage.setItem("cinemavault-token", "valid-token");
    localStorage.setItem(
      "cinemavault-user",
      JSON.stringify({
        id: "member-1",
        email: "member@cinemavault.local",
        displayName: "Cinema Member",
        role: "USER",
        profilePhotoDataUrl: null
      })
    );
    getCurrentUser.mockResolvedValue({
      id: "member-1",
      email: "member@cinemavault.local",
      displayName: "Cinema Member",
      role: "USER",
      profilePhotoDataUrl: null
    });

    render(
      <AuthProvider>
        <AuthUpdater />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "update-user" })).toBeInTheDocument();
    });

    screen.getByRole("button", { name: "update-user" }).click();

    await waitFor(() => {
      expect(screen.getByText("data:image/png;base64,updated")).toBeInTheDocument();
    });

    expect(localStorage.getItem("cinemavault-user")).toContain("data:image/png;base64,updated");
  });
});
