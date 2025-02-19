import { RouterProvider } from "react-router/dom";
import { type RouteObject, createBrowserRouter } from "react-router";
import React, { useMemo } from "react";

interface Props {
  routes: RouteObject[];
  basename?: string;
  children?: React.ReactNode;
}

const Router = ({ routes, basename, children }: Props) => {
  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: "/",
            children: routes,
            hydrateFallbackElement: children,
          },
        ],
        { basename },
      ),
    [routes, basename, children],
  );

  return <RouterProvider router={router} />;
};

export default Router;
