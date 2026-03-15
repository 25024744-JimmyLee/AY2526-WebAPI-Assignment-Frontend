import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "../src/App";

describe("App", () => {
  it("renders the application title", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "CinemaVault" })).toBeInTheDocument();
  });
});
