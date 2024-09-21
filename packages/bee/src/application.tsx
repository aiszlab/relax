import { type ReactNode } from "react";

export interface Props {
  children: ReactNode;
}

const Application = ({ children }: Props) => {
  return children;
};

export default Application;
