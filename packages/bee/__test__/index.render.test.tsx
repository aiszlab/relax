/**
 * Integration-style test that covers React.lazy factory execution.
 * Unlike index.test.tsx, this does NOT mock react-dom, allowing
 * React to actually render and trigger the lazy() callback.
 */
import React from "react";
import { vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";

const { mockIsHTMLElement } = vi.hoisted(() => ({
  mockIsHTMLElement: vi.fn(),
}));

vi.mock("@aiszlab/relax", () => ({
  isHTMLElement: mockIsHTMLElement,
}));

// Mock Application to render a simple wrapper
vi.mock("../src/application", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="bee-application">{children}</div>
  ),
}));

// Mock the router module to render a simple marker
// Note: children here are RouteObject[], not React nodes — render count instead
vi.mock("../src/libs/router", () => ({
  default: ({ children }: { children?: unknown[] }) => (
    <div data-testid="bee-router">
      {Array.isArray(children) ? `${children.length} routes configured` : null}
    </div>
  ),
}));

// Re-import bootstrap to get the actual implementation (react-dom is NOT mocked)
import { bootstrap } from "../src/index";

describe("bootstrap (real React rendering)", () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("renders Application with real React rendering", async () => {
    mockIsHTMLElement.mockReturnValue(true);

    await bootstrap({ selectors: container });

    // Wait for any async rendering (StrictMode double-render)
    await waitFor(() => {
      expect(screen.getByTestId("bee-application")).toBeDefined();
    });
  });

  it("renders Router when routes are provided (covers lazy factory)", async () => {
    mockIsHTMLElement.mockReturnValue(true);
    const routes = [{ path: "/" }, { path: "/about" }];

    await bootstrap({ selectors: container, routes });

    // The lazy Router should resolve and render
    await waitFor(() => {
      expect(screen.getByTestId("bee-router")).toBeDefined();
    });
  });

  it("does not render Router when routes is false", async () => {
    mockIsHTMLElement.mockReturnValue(true);

    await bootstrap({ selectors: container, routes: false });

    await waitFor(() => {
      expect(screen.getByTestId("bee-application")).toBeDefined();
      expect(screen.queryByTestId("bee-router")).toBeNull();
    });
  });
});
