import React, { createElement, lazy, StrictMode, type FC, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { isHTMLElement } from "@aiszlab/relax";
import { type RouteObject } from "react-router-dom";
import Loadable from "./loadable";
import { type Store, type UnknownAction } from "redux";

const Router = lazy(() => import("./route/router"));
const Storage = lazy(() => import("./storage"));

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

  let children: ReactNode = null;

  // with router
  if (routes) {
    children = <Loadable render={Router} fallback={null} routes={routes} />;
  } else {
    children = createElement(render);
  }

  // with storage
  if (store) {
    children = (
      <Loadable render={Storage} fallback={null} store={store}>
        {children}
      </Loadable>
    );
  }

  createRoot(container).render(<StrictMode>{children}</StrictMode>);
};

export { bootstrap };
