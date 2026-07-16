import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { using } from "../../src/react";
import { fireEvent, render, renderHook } from "@testing-library/react";

const useCount = using<{
  count: number;
  increment: () => void;
}>((setState) => ({
  count: 0,
  increment: () => setState((state) => ({ ...state, count: state.count + 1 })),
}));

const Counter = ({ id = "counter", state = false }: { id?: string; state?: boolean } = {}) => {
  const { count, increment } = useCount();
  const [_count, _setCount] = useState(0);

  const _increment = () => {
    if (state) {
      _setCount((_) => _ + 1);
      return;
    }
    increment();
  };

  return (
    <div id={id} onClick={_increment}>
      {state ? _count : count}
    </div>
  );
};

describe("using global store", () => {
  it("run as `useState`", () => {
    const { container } = render(<Counter />);
    const counter = container.querySelector("#counter")!;

    expect(counter.innerHTML).toBe("0");
    fireEvent.click(counter);
    expect(counter.innerHTML).toBe("1");
  });

  it("share store between multiple components", () => {
    const { container } = render(
      <>
        <Counter id="counter-1" state />
        <Counter id="counter-2" state />
        <Counter id="counter-3" />
        <Counter id="counter-4" />
      </>,
    );
    const counter1 = container.querySelector("#counter-1")!;
    const counter2 = container.querySelector("#counter-2")!;
    const counter3 = container.querySelector("#counter-3")!;
    const counter4 = container.querySelector("#counter-4")!;

    expect(counter1.innerHTML).toBe("0");
    expect(counter2.innerHTML).toBe("0");
    expect(counter3.innerHTML).toBe("1");
    expect(counter4.innerHTML).toBe("1");

    fireEvent.click(counter1);

    expect(counter1.innerHTML).toBe("1");
    expect(counter2.innerHTML).toBe("0");
    expect(counter3.innerHTML).toBe("1");
    expect(counter4.innerHTML).toBe("1");

    fireEvent.click(counter3);

    expect(counter1.innerHTML).toBe("1");
    expect(counter2.innerHTML).toBe("0");
    expect(counter3.innerHTML).toBe("2");
    expect(counter4.innerHTML).toBe("2");
  });

  it("state property returns current value", () => {
    const count = useCount.state.count;
    expect(typeof count).toBe("number");
  });

  it("state setter warns readonly", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (useCount as any).state = 5;
    expect(warnSpy).toHaveBeenCalledWith("`useStore`.`state` is readonly property!");

    warnSpy.mockRestore();
  });

  it("initializer receives and can call getState", () => {
    // Covers line 43: getState is called, exercising the non-null ?? path
    // because store.state is set to the initial value before getState is
    // called here (inside an action, not during init).
    const useStore = using<{ value: number; read: () => number | null }>(
      (setState, getState) => ({
        value: 0,
        read: () => {
          // getState() returns store.state (non-null after init)
          // This covers the non-nullish branch of ?? on line 43
          return getState()?.value ?? null;
        },
      }),
    );

    const { result } = renderHook(() => useStore());
    const state = result.current;

    expect(state.read()).toBe(0);
  });

  it("handles nullish ?? fallback when store state is null", () => {
    // When initializer returns null, store.state remains null.
    // This covers the nullish ?? paths on lines 40, 43, and 50.
    // We also capture setState and getState to exercise line 40 & 43 null paths.
    let externalSetState: ((
      state: (previous: null) => null,
    ) => void) | null = null;
    let externalGetState: (() => null) | null = null;

    const useNullStore = using<null>((setState, getState) => {
      externalSetState = setState;
      externalGetState = getState;
      return null;
    });

    // store.state is null at this point — covers line 50 null ??
    const { result } = renderHook(() => useNullStore());
    expect(result.current).toBe(null);

    // Call setState when store.state is null — covers line 40 null ??
    externalSetState!(() => null);

    // Call getState when store.state is null — covers line 43 null ??
    expect(externalGetState!()).toBe(null);
  });

  it("renders initial state via SSR (getServerSnapshot)", () => {
    // This test exercises the `initialState: () => initialState` function at line 51,
    // which is passed as the getServerSnapshot argument to useSyncExternalStore.
    // ReactDOMServer.renderToString calls useSyncExternalStore on the server,
    // which invokes getServerSnapshot to obtain the initial snapshot for SSR.
    const html = ReactDOMServer.renderToString(<Counter id="ssr-counter" />);
    expect(html).toContain("0");
  });
});
