/**
 * @jest-environment jsdom
 */

import React, { useRef } from "react";
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
import { useComposedRef } from "../../src";

describe("`useComposedRef`", () => {
  test("forward single ref", () => {
    const { container } = render(
      createElement(() => {
        const _elementRef = useRef<HTMLDivElement>(null);
        const composedRef = useComposedRef(_elementRef);

        const onClick = () => {
          if (!_elementRef.current) return;
          _elementRef.current.innerHTML = "changed";
        };

        return (
          <div id="composed" ref={composedRef} onClick={onClick}>
            unchanged
          </div>
        );
      }),
    );

    const element = container.querySelector("#composed")!;

    expect(element.innerHTML).toBe("unchanged");
    fireEvent.click(element);
    expect(element.innerHTML).toBe("changed");
  });

  test("compose multiple refs, by `original ref` and `callback` and `invalid refs`", () => {
    const { container } = render(
      createElement(() => {
        const _element1Ref = useRef<HTMLDivElement>(null);
        const _element2Ref = useRef<HTMLDivElement | null>(null);

        const mountRef = (_element: HTMLDivElement) => {
          _element2Ref.current = _element;
        };

        const composedRef = useComposedRef(_element1Ref, mountRef, "invalidRef", null, void 0);

        const onClick = () => {
          if (!_element1Ref.current) return;
          if (!_element2Ref.current) return;

          _element1Ref.current.innerHTML = "changed1";
          _element2Ref.current.innerHTML = "changed2";
        };

        return (
          <div id="composed" ref={composedRef} onClick={onClick}>
            unchanged
          </div>
        );
      }),
    );

    const element = container.querySelector("#composed")!;

    expect(element.innerHTML).toBe("unchanged");
    fireEvent.click(element);
    expect(element.innerHTML).toBe("changed2");
  });
});
