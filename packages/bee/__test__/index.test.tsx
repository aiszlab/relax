import React from "react";
import { vi } from "vitest";

const {
  mockRender,
  mockCreateRoot,
  mockUnmount,
  mockIsHTMLElement,
  renderedElementRef,
} = vi.hoisted(() => {
  const mockRender = vi.fn();
  const mockUnmount = vi.fn();
  const mockIsHTMLElement = vi.fn();
  const renderedElementRef: { current: React.ReactNode | null } = { current: null };

  const mockCreateRoot = vi.fn().mockImplementation(() => ({
    render: (element: React.ReactNode) => {
      renderedElementRef.current = element;
      mockRender(element);
    },
    unmount: mockUnmount,
  }));

  return { mockRender, mockCreateRoot, mockUnmount, mockIsHTMLElement, renderedElementRef };
});

vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

vi.mock("@aiszlab/relax", () => ({
  isHTMLElement: mockIsHTMLElement,
}));

vi.mock("../src/application", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="application">{children}</div>
  ),
}));

vi.mock("../src/libs/router", () => ({
  default: ({ basename, children }: { basename?: string; children?: React.ReactNode }) => (
    <div data-testid="router" data-basename={basename}>{children}</div>
  ),
}));

import { bootstrap, ApplicationProps } from "../src/index";

describe("bootstrap", () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    renderedElementRef.current = null;
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("container resolution", () => {
    it("uses string selector to find container", async () => {
      mockIsHTMLElement.mockReturnValue(false);

      await bootstrap({ selectors: "#root" });

      expect(mockCreateRoot).toHaveBeenCalledWith(container);
      expect(mockRender).toHaveBeenCalled();
    });

    it("uses HTMLElement directly when provided", async () => {
      mockIsHTMLElement.mockReturnValue(true);

      await bootstrap({ selectors: container });

      expect(mockCreateRoot).toHaveBeenCalledWith(container);
      expect(mockRender).toHaveBeenCalled();
    });

    it("throws when container is not found", async () => {
      mockIsHTMLElement.mockReturnValue(false);

      await expect(
        bootstrap({ selectors: "#nonexistent" }),
      ).rejects.toThrow("Root container not found");
    });

    it("throws when document.querySelector returns null", async () => {
      mockIsHTMLElement.mockReturnValue(false);
      const querySelectorSpy = vi.spyOn(document, "querySelector").mockReturnValue(null);

      await expect(
        bootstrap({ selectors: ".missing" }),
      ).rejects.toThrow("Root container not found");

      querySelectorSpy.mockRestore();
    });
  });

  describe("rendering", () => {
    it("renders with default Application when no custom render provided", async () => {
      mockIsHTMLElement.mockReturnValue(true);

      await bootstrap({ selectors: container });

      expect(mockRender).toHaveBeenCalled();
      expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    });

    it("renders with custom render component", async () => {
      mockIsHTMLElement.mockReturnValue(true);
      const CustomApp = ({ children }: { children?: React.ReactNode }) => (
        <section data-testid="custom-app">{children}</section>
      );

      await bootstrap({ selectors: container, render: CustomApp });

      expect(mockRender).toHaveBeenCalled();
    });
  });

  describe("routing", () => {
    it("renders without router when routes is false (default)", async () => {
      mockIsHTMLElement.mockReturnValue(true);

      await bootstrap({ selectors: container, routes: false });

      expect(mockRender).toHaveBeenCalled();
    });

    it("renders with router when routes are provided", async () => {
      mockIsHTMLElement.mockReturnValue(true);
      const routes = [{ path: "/" }, { path: "/about" }];

      await bootstrap({ selectors: container, routes });

      expect(mockRender).toHaveBeenCalled();
    });
  });

  describe("ApplicationProps type", () => {
    it("ApplicationProps is exported", () => {
      const props: ApplicationProps = { children: null };
      expect(props).toBeDefined();
    });
  });
});
