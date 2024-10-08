/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
import { render, renderHook } from "@testing-library/react";
import React, { Component, createRef, useRef } from "react";
import { mountRef } from "../../src/react/mount-ref";

describe("`mountRef`", () => {
  it("callback ref", () => {
    const fn = jest.fn();

    const { unmount } = render(<div ref={(_ref) => mountRef(fn, _ref)} />);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(expect.any(HTMLDivElement));

    unmount();
    expect(fn).toBeCalledTimes(2);
    expect(fn).toBeCalledWith(null);
  });

  it("hooks ref", () => {
    const { result: ref } = renderHook(() => useRef<HTMLDivElement | null>());
    const { unmount } = render(<div ref={(_ref) => mountRef(ref.current, _ref)} />);

    expect(ref.current.current).toBeInstanceOf(HTMLDivElement);
    unmount();
    expect(ref.current.current).toBeNull();
  });

  it("string ref", () => {
    const stringRef = jest.fn<(ref: null) => void>();
    const callbackRef = jest.fn();

    class Sample extends Component {
      current: null = null;
      _ref = createRef<HTMLDivElement>();

      render() {
        return (
          <div
            ref={(_ref) => {
              mountRef("current", _ref);
              mountRef(this._ref, _ref);

              stringRef(this.current);
              callbackRef(this._ref.current);
            }}
          />
        );
      }
    }

    const { unmount } = render(<Sample key="mix-ref-unit-test" />);

    expect(stringRef).toBeCalledTimes(1);
    expect(stringRef).toBeCalledWith(null);
    expect(callbackRef).toBeCalledTimes(1);
    expect(callbackRef).toBeCalledWith(expect.any(HTMLDivElement));

    unmount();

    expect(stringRef).toBeCalledTimes(2);
    expect(stringRef).toBeCalledWith(null);
    expect(callbackRef).toBeCalledTimes(2);
    expect(callbackRef).toBeCalledWith(null);
  });
});
