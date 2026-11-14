
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App.jsx";

describe("MeetMind-AI authentication page", () => {
  it("renders the welcome heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });

  it("renders the sign-in form fields", () => {
    render(<App />);

    expect(
      screen.getByRole("textbox", { name: /email address/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password", { exact: true }),
    ).toBeInTheDocument();
  });

  it("renders the sign-in button and registration link", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: /^sign in$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /create account/i }),
    ).toBeInTheDocument();
  });
});
