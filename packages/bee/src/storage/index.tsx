import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { type Store, type Action, type UnknownAction } from "redux";

type Props<A extends Action<string> = UnknownAction, S = unknown> = {
  store: Store<S, A>;
  children: ReactNode;
};

const Storage = ({ store, children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Storage;
