/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
import { isEmpty, useHover } from "../../src";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { First } from "../../src/types";

enum HoveredToken {
  Hovered = "hovered",
  Unhovered = "unhovered",
}

const Hoverable = (props: First<Parameters<typeof useHover<HTMLDivElement>>>) => {
  const [isHovered, hoverProps] = useHover<HTMLDivElement>(isEmpty(props) ? void 0 : props);

  return (
    <div id="hoverable" {...hoverProps}>
      {isHovered ? HoveredToken.Hovered : HoveredToken.Unhovered}
    </div>
  );
};

describe("`useHover`", () => {
  it("hover event trigger", () => {
    const { container } = render(<Hoverable />);
    const hoverable = container.querySelector("#hoverable")!;

    expect(hoverable.innerHTML).toBe(HoveredToken.Unhovered);
    fireEvent.pointerEnter(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Hovered);
    fireEvent.pointerLeave(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Unhovered);
  });

  it("callbacks", () => {
    const enter = jest.fn();
    const leave = jest.fn();

    const { container } = render(<Hoverable onEnter={enter} onLeave={leave} />);
    const hoverable = container.querySelector("#hoverable")!;

    fireEvent.pointerEnter(hoverable);
    expect(enter).toBeCalledTimes(1);
    expect(leave).toBeCalledTimes(0);

    fireEvent.pointerLeave(hoverable);
    expect(enter).toBeCalledTimes(1);
    expect(leave).toBeCalledTimes(1);
  });
});
