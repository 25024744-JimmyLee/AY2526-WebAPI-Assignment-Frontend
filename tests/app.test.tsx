import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "../src/App";

vi.mock("../src/api/films-api", () => {
  return {
    listFilms: vi.fn().mockResolvedValue([])
  };
});

describe("App", () => {
  it("renders the application title", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "CinemaVault" })).toBeInTheDocument();
  });
});
