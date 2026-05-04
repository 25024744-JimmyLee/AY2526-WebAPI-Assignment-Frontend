import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HomePage } from "../src/pages/home-page";

const listFilms = vi.fn();

vi.mock("../src/api/films-api", () => ({
  listFilms: (...args: unknown[]) => listFilms(...args)
}));

function renderHomePage() {
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
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("HomePage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends title, genre, year, and rating filters to the API client", async () => {
    listFilms.mockResolvedValue([]);

    renderHomePage();

    await waitFor(() => {
      expect(listFilms).toHaveBeenCalledWith({
        title: undefined,
        genre: "All",
        year: undefined,
        rating: undefined
      });
    });

    fireEvent.change(screen.getByLabelText("Search films"), {
      target: {
        value: "arrival"
      }
    });
    fireEvent.change(screen.getByLabelText("Release year"), {
      target: {
        value: "2016"
      }
    });
    fireEvent.change(screen.getByLabelText("Rating"), {
      target: {
        value: "8.2"
      }
    });
    fireEvent.click(screen.getByRole("button", { name: "Sci-Fi" }));

    await waitFor(() => {
      expect(listFilms).toHaveBeenLastCalledWith({
        title: "arrival",
        genre: "Sci-Fi",
        year: 2016,
        rating: 8.2
      });
    });
  });
});
