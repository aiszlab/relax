import { RouterProvider } from "react-router/dom";
import { type RouteObject, createBrowserRouter } from "react-router";
import React from "react";

interface Props {
  basename?: string;
  children?: RouteObject[];
}

const Router = ({ basename, children }: Props) => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        [
          {
            path: "/",
            children,
          },
        ],
        { basename },
      )}
    />
  );
};

export default Router;
