import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App.jsx";

describe("App", () => {
  it("renders the MeetMind-AI application name", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /meetmind-ai/i }),
    ).toBeInTheDocument();
  });

  it("renders the application introduction", () => {
    render(<App />);
    expect(
      screen.getByText(/your meetings, notes and next steps/i),
    ).toBeInTheDocument();
  });

  it("renders the Get Started button", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /get started/i }),
    ).toBeInTheDocument();
  });
});