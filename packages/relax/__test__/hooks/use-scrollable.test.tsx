import { renderHook, act } from "@testing-library/react";
import { useScrollable } from "../../src/hooks/use-scrollable";

describe("useScrollable", () => {
  it("returns refs and control functions", () => {
    const { result } = renderHook(() => useScrollable());

    expect(result.current.targetRef).toBeDefined();
    expect(result.current.triggerRefs).toBeDefined();
    expect(typeof result.current.scrollTo).toBe("function");
    expect(typeof result.current.to).toBe("function");
    expect(typeof result.current.setTrigger).toBe("function");
  });

  it("scrollTo does not throw when ref is null", () => {
    const { result } = renderHook(() => useScrollable());

    expect(() => {
      act(() => {
        result.current.scrollTo(100);
      });
    }).not.toThrow();
  });

  it("to returns 0 when trigger not found", () => {
    const { result } = renderHook(() => useScrollable());

    expect(result.current.to("unknown-key")).toBe(0);
  });

  it("setTrigger registers a trigger and to returns correct offset", () => {
    const { result } = renderHook(() => useScrollable());

    const mockElement = {
      offsetTop: 500,
      offsetLeft: 100,
    };

    act(() => {
      result.current.setTrigger("section1", mockElement as unknown as HTMLElement);
    });

    expect(result.current.to("section1")).toBe(500);
  });

  it("scrollTo with orientation horizontal uses offsetLeft", () => {
    const { result } = renderHook(() =>
      useScrollable({ orientation: "horizontal" }),
    );

    const mockElement = {
      offsetTop: 500,
      offsetLeft: 100,
    };

    act(() => {
      result.current.setTrigger("section1", mockElement as unknown as HTMLElement);
    });

    expect(result.current.to("section1")).toBe(100);
  });

  it("scrollTo calls dom scrollTo when target is set", () => {
    const { result } = renderHook(() => useScrollable());

    const mockTarget = document.createElement("div");

    act(() => {
      (result.current.targetRef as React.MutableRefObject<HTMLElement | null>).current = mockTarget;
    });

    expect(() => {
      act(() => {
        result.current.scrollTo(100, 200);
      });
    }).not.toThrow();
  });
});
