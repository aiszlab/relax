import { BrowserRouter, type RouteObject } from "react-router-dom";
import Routes from "./routes";
import React from "react";

interface Props {
  routes: RouteObject[];
  basename?: string;
}

const Router = ({ routes, basename }: Props) => {
  return (
    <BrowserRouter basename={basename}>
      <Routes routes={routes} />
    </BrowserRouter>
  );
};

export default Router;
