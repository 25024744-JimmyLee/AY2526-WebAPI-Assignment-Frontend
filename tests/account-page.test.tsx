import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AccountPage } from "../src/pages/account-page";

const listMessages = vi.fn();
const deleteMessage = vi.fn();
const listFavourites = vi.fn();
const removeFavourite = vi.fn();
const uploadProfilePhoto = vi.fn();
const setUser = vi.fn();

vi.mock("../src/api/messages-api", () => ({
  deleteMessage: (...args: unknown[]) => deleteMessage(...args),
  listMessages: (...args: unknown[]) => listMessages(...args)
}));

vi.mock("../src/api/favourites-api", () => ({
  listFavourites: (...args: unknown[]) => listFavourites(...args),
  removeFavourite: (...args: unknown[]) => removeFavourite(...args)
}));

vi.mock("../src/api/profile-api", () => ({
  uploadProfilePhoto: (...args: unknown[]) => uploadProfilePhoto(...args)
}));

vi.mock("../src/store/auth-store", () => ({
  useAuth: () => ({
    setUser,
    token: "user-token",
    user: {
      id: "user-1",
      email: "user@cinemavault.local",
      displayName: "Cinema Member",
      role: "USER"
    }
  })
}));

function renderAccountPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AccountPage />
    </QueryClientProvider>
  );
}

describe("AccountPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows favourites and uploads a profile photo", async () => {
    listMessages.mockResolvedValue([]);
    listFavourites.mockResolvedValue([
      {
        id: "favourite-1",
        createdAt: "2026-03-13T00:00:00.000Z",
        film: {
          id: "film-1",
          title: "Skyline Archive",
          slug: "skyline-archive",
          synopsis: "Archive mystery",
          genre: "Sci-Fi",
          releaseYear: 2023,
          rating: 8.4,
          runtimeMinutes: 132,
          curatorNote: "World-building standout",
          createdAt: "2026-03-13T00:00:00.000Z",
          updatedAt: "2026-03-13T00:00:00.000Z"
        }
      }
    ]);
    uploadProfilePhoto.mockResolvedValue({
      id: "user-1",
      email: "user@cinemavault.local",
      displayName: "Cinema Member",
      profilePhotoUrl: "/uploads/profiles/user-1.png",
      role: "USER"
    });

    renderAccountPage();

    expect(await screen.findByText("Skyline Archive")).toBeInTheDocument();

    const fileInput = screen.getByLabelText("Profile photo");
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(fileInput, {
      target: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(uploadProfilePhoto).toHaveBeenCalledWith("user-token", file);
      expect(setUser).toHaveBeenCalledWith(expect.objectContaining({ profilePhotoUrl: "/uploads/profiles/user-1.png" }));
    });
  });
});
