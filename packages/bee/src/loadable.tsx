import React, {
  createElement,
  Suspense,
  type FunctionComponent,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

type Props<P = {}> = P & {
  render: LazyExoticComponent<FunctionComponent<P>>;
  fallback?: ReactNode;
};

const Loadable = <P extends {}>({ render, fallback, ...props }: Props<P>) => {
  // @ts-ignore
  return <Suspense fallback={fallback}>{createElement(render, props)}</Suspense>;
};

export default Loadable;
