import { type RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useMemo } from "react";

interface Props {
  routes: RouteObject[];
  basename?: string;
  children?: React.ReactNode;
}

const Router = ({ routes, basename, children }: Props) => {
  const router = useMemo(() => createBrowserRouter(routes, { basename }), [routes, basename]);

  return <RouterProvider router={router} fallbackElement={children} />;
};

export default Router;
