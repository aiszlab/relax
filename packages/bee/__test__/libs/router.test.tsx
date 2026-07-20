import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const { mockRouterProvider, mockCreateBrowserRouter } = vi.hoisted(() => ({
  mockRouterProvider: vi.fn().mockImplementation(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="router-provider">{children}</div>
  )),
  mockCreateBrowserRouter: vi.fn((routes: unknown, opts?: unknown) => ({ routes, opts })),
}));

vi.mock("react-router/dom", () => ({
  RouterProvider: mockRouterProvider,
}));

vi.mock("react-router", () => ({
  createBrowserRouter: mockCreateBrowserRouter,
}));

import Router from "../../src/libs/router";

describe("Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders RouterProvider", () => {
    render(<Router />);
    expect(screen.getByTestId("router-provider")).toBeDefined();
  });

  it("passes basename to createBrowserRouter", () => {
    render(<Router basename="/app" />);

    expect(mockCreateBrowserRouter).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ path: "/" }),
      ]),
      { basename: "/app" },
    );
  });

  it("passes children routes to createBrowserRouter", () => {
    const routes = [{ path: "/about" }, { path: "/contact" }];

    render(<Router>{routes as any}</Router>);

    expect(mockCreateBrowserRouter).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/",
          children: routes,
        }),
      ]),
      expect.any(Object),
    );
  });

  it("calls createBrowserRouter without basename when not provided", () => {
    render(<Router />);

    expect(mockCreateBrowserRouter).toHaveBeenCalledWith(
      expect.any(Array),
      { basename: undefined },
    );
  });
});
