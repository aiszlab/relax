import React, { createElement, lazy, type ReactNode, StrictMode, type FC, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { isHTMLElement } from "@aiszlab/relax";
import { type RouteObject } from "react-router";
import Application, { type Props as ApplicationProps } from "./application";

const Router = lazy(() => import("./libs/router"));

interface Props {
  selectors: string | HTMLElement;
  render?: FC<ApplicationProps>;
  routes?: RouteObject[] | false;
}

const bootstrap = async ({ selectors, render = Application, routes = false }: Props) => {
  const container = isHTMLElement(selectors) ? selectors : document.querySelector(selectors);
  if (!container) {
    throw new Error("Root container not found, by `document.querySelector(selectors)`");
  }

  let children: ReactNode = null;

  // with router
  if (routes) {
    children = <Router>{routes}</Router>;
  }

  // with application
  children = createElement(render, null, children);
  createRoot(container).render(<StrictMode>{children}</StrictMode>);
};

export { bootstrap };
export type { ApplicationProps };
