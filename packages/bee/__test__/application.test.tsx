/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import Application from "../src/application";

describe("Application", () => {
  it("renders children when provided", () => {
    render(
      <Application>
        <div data-testid="child">Hello</div>
      </Application>,
    );

    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("renders nothing when children is null", () => {
    const { container } = render(<Application>{null}</Application>);
    expect(container.innerHTML).toBe("");
  });

  it("renders multiple children", () => {
    render(
      <Application>
        <span data-testid="first">First</span>
        <span data-testid="second">Second</span>
      </Application>,
    );

    expect(screen.getByTestId("first")).toBeDefined();
    expect(screen.getByTestId("second")).toBeDefined();
  });

  it("renders nested React elements", () => {
    render(
      <Application>
        <div>
          <p>Nested content</p>
        </div>
      </Application>,
    );

    expect(screen.getByText("Nested content")).toBeDefined();
  });
});
