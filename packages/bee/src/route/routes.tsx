import { useRoutes, type RouteObject } from "react-router-dom";

interface Props {
  routes: RouteObject[];
}

const Routes = ({ routes }: Props) => {
  return useRoutes(routes);
};

export default Routes;
