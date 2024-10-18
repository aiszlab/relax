/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from "@testing-library/react";
import { isEmpty, useFocus } from "../../src";
import React from "react";
import { describe, it, expect, jest } from "@jest/globals";
import { First } from "../../src/types";

enum FocusedToken {
  Focused = "focused",
  Blurred = "blurred",
}

const Focusable = (props: First<Parameters<typeof useFocus>>) => {
  const [isFocused, focusProps] = useFocus(isEmpty(props) ? void 0 : props);

  return (
    <div id="focusable" {...focusProps}>
      {isFocused ? FocusedToken.Focused : FocusedToken.Blurred}
    </div>
  );
};

describe("useFocus", () => {
  it("focus event trigger", async () => {
    const { container } = render(<Focusable />);
    const focusable = container.querySelector("#focusable")!;

    expect(focusable.innerHTML).toBe(FocusedToken.Blurred);
    fireEvent.focus(focusable);
    expect(focusable.innerHTML).toBe(FocusedToken.Focused);
    fireEvent.blur(focusable);
    expect(focusable.innerHTML).toBe(FocusedToken.Blurred);
  });

  it("focus callbacks", () => {
    const blur = jest.fn();
    const focus = jest.fn();
    const focusChange = jest.fn();

    const { container } = render(
      <Focusable onBlur={blur} onFocus={focus} onFocusChange={focusChange} />,
    );
    const focusable = container.querySelector("#focusable")!;

    // first render, not focused
    expect(focus).toHaveBeenCalledTimes(0);
    expect(blur).toHaveBeenCalledTimes(0);
    expect(focusChange).toHaveBeenCalledTimes(0);

    // test focus
    fireEvent.focus(focusable);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(0);
    expect(focusChange).toHaveBeenCalledTimes(1);

    // test blur
    fireEvent.blur(focusable);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(focusChange).toHaveBeenCalledTimes(2);
  });
});
