import React, { createElement, lazy, StrictMode, Suspense, type FC } from "react";
import { createRoot } from "react-dom/client";
import { isHTMLElement } from "@aiszlab/relax";
import { type RouteObject } from "react-router-dom";
import { type Store, type UnknownAction } from "redux";

const Router = lazy(() => import("./libs/router"));
const Storage = lazy(() => import("./libs/storage"));

interface Props {
  selectors: string | HTMLElement;
  render: FC;
  routes?: RouteObject[] | false;
  store?: Store<unknown, UnknownAction, unknown> | false;
}

const bootstrap = async ({ selectors, render, routes = false, store = false }: Props) => {
  const container = isHTMLElement(selectors) ? selectors : document.querySelector(selectors);
  if (!container) {
    throw new Error("Root container not found, by `document.querySelector(selectors)`");
  }

  let children = createElement(render);

  // with router
  if (routes) {
    children = (
      <Suspense fallback={null}>
        <Router routes={routes}>{children}</Router>
      </Suspense>
    );
  }

  // with storage
  if (store) {
    children = (
      <Suspense fallback={null}>
        <Storage store={store}>{children}</Storage>
      </Suspense>
    );
  }

  createRoot(container).render(<StrictMode>{children}</StrictMode>);
};

export { bootstrap };
