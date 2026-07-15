import { isEmpty, useHover } from "../../src";
import React, { useRef } from "react";
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

const HoverableWithRef = (props: First<Parameters<typeof useHover<HTMLDivElement>>>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, hoverProps] = useHover<HTMLDivElement>(
    isEmpty(props) ? { ref } : { ...props, ref },
  );

  return (
    <div>
      <div ref={ref} id="hoverable" {...hoverProps}>
        {isHovered ? HoveredToken.Hovered : HoveredToken.Unhovered}
      </div>
      <div id="outside">outside</div>
    </div>
  );
};

// Component that provides a ref but never attaches it to an element
const HoverableWithUnattachedRef = (
  props: First<Parameters<typeof useHover<HTMLDivElement>>>,
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, hoverProps] = useHover<HTMLDivElement>(
    isEmpty(props) ? { ref } : { ...props, ref },
  );

  return (
    <div id="hoverable" {...hoverProps}>
      {isHovered ? HoveredToken.Hovered : HoveredToken.Unhovered}
      {/* ref is not attached to any element, so ref.current is always null */}
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
    const enter = vi.fn();
    const leave = vi.fn();

    const { container } = render(<Hoverable onEnter={enter} onLeave={leave} />);
    const hoverable = container.querySelector("#hoverable")!;

    fireEvent.pointerEnter(hoverable);
    expect(enter).toBeCalledTimes(1);
    expect(leave).toBeCalledTimes(0);

    fireEvent.pointerLeave(hoverable);
    expect(enter).toBeCalledTimes(1);
    expect(leave).toBeCalledTimes(1);
  });

  it("with ref triggers mouseOut when leaving to outside element", () => {
    const { container } = render(<HoverableWithRef />);
    const hoverable = container.querySelector("#hoverable")!;
    const outside = container.querySelector("#outside")!;

    fireEvent.pointerEnter(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Hovered);

    fireEvent.mouseOut(hoverable, { relatedTarget: outside });
    expect(hoverable.innerHTML).toBe(HoveredToken.Unhovered);
  });

  it("with ref does not trigger leave when moving to child element", () => {
    const { container } = render(<HoverableWithRef />);
    const hoverable = container.querySelector("#hoverable")!;

    fireEvent.pointerEnter(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Hovered);

    // relatedTarget is the same element (contains returns true)
    fireEvent.mouseOut(hoverable, { relatedTarget: hoverable });
    expect(hoverable.innerHTML).toBe(HoveredToken.Hovered);
  });

  it("with unattached ref, mouseOut returns early", () => {
    const { container } = render(<HoverableWithUnattachedRef />);
    const hoverable = container.querySelector("#hoverable")!;

    fireEvent.pointerEnter(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Hovered);

    // mouseOut triggers moveOut which returns early (ref.current is null)
    // mouseLeave also fires, leaving hover state
    fireEvent.mouseOut(hoverable);
    expect(hoverable.innerHTML).toBe(HoveredToken.Unhovered);
  });
});
