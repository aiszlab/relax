import { renderHook } from "@testing-library/react";
import { useScale } from "../../src/hooks/use-scale";

describe("useScale", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scale with string values", () => {
    const { result } = renderHook(() => useScale("100px", "200px"));
    expect(result.current).toBe(0);
  });

  it("scale with number values", () => {
    const { result } = renderHook(() => useScale(100, 200));
    expect(result.current).toBe(0);
  });

  it("enters _originalSizedWidth > 0 branch via offsetWidth mock (line 31)", () => {
    // Mock offsetWidth on HTMLDivElement prototype so the two measured
    // elements both report positive widths.
    const origDescriptor = Object.getOwnPropertyDescriptor(
      HTMLDivElement.prototype,
      "offsetWidth",
    );
    let callCount = 0;
    Object.defineProperty(HTMLDivElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        callCount++;
        // _resizedElement is created first, _originalSizedElement second
        return callCount % 2 === 1 ? 200 : 100;
      },
    });

    const { result } = renderHook(() => useScale(200, 100));
    // scale = _resizedWidth / _originalSizedWidth = 200 / 100 = 2
    expect(result.current).toBe(2);

    // Restore
    if (origDescriptor) {
      Object.defineProperty(HTMLDivElement.prototype, "offsetWidth", origDescriptor);
    } else {
      delete (HTMLDivElement.prototype as any).offsetWidth;
    }
  });
});
