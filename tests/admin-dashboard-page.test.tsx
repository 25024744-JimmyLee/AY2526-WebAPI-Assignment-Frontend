import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AdminDashboardPage } from "../src/pages/admin-dashboard-page";
import type { MessageRecord } from "../src/types/message";

const listFilms = vi.fn();
const deleteFilm = vi.fn();
const listMessages = vi.fn();
const replyToMessage = vi.fn();
const deleteMessage = vi.fn();

vi.mock("../src/api/films-api", () => ({
  deleteFilm: (...args: unknown[]) => deleteFilm(...args),
  listFilms: (...args: unknown[]) => listFilms(...args)
}));

vi.mock("../src/api/messages-api", () => ({
  deleteMessage: (...args: unknown[]) => deleteMessage(...args),
  listMessages: (...args: unknown[]) => listMessages(...args),
  replyToMessage: (...args: unknown[]) => replyToMessage(...args)
}));

vi.mock("../src/store/auth-store", () => ({
  useAuth: () => ({
    token: "admin-token"
  })
}));

const openMessage: MessageRecord = {
  id: "message-1",
  subject: "Please add screening notes",
  body: "I would like more information about this film.",
  status: "OPEN",
  adminResponse: null,
  createdAt: "2026-03-13T00:00:00.000Z",
  respondedAt: null,
  updatedAt: "2026-03-13T00:00:00.000Z",
  film: {
    id: "film-1",
    title: "Skyline Archive",
    slug: "skyline-archive"
  },
  sender: {
    id: "user-1",
    email: "user@cinemavault.local",
    displayName: "Cinema Member"
  },
  responder: null
};

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("AdminDashboardPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends the administrator's custom reply text", async () => {
    listFilms.mockResolvedValue([]);
    listMessages.mockResolvedValue([openMessage]);
    replyToMessage.mockResolvedValue({
      ...openMessage,
      status: "RESPONDED",
      adminResponse: "Custom administrator response"
    });

    renderDashboard();

    const replyInput = await screen.findByLabelText("Admin response");
    const sendButton = screen.getByRole("button", { name: "Send response" });

    expect(sendButton).toBeDisabled();

    fireEvent.change(replyInput, {
      target: {
        value: "Custom administrator response"
      }
    });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(replyToMessage).toHaveBeenCalledWith("admin-token", "message-1", {
        body: "Custom administrator response"
      });
    });
  });
});
