/**
 * @jest-environment jsdom
 */

import React, { useState } from "react";
import { using } from "../../src/react";
import { describe, expect, it } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";

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
});
