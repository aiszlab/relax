import { scrollTo } from "../../src/dom/scroll-to";

describe("`scrollTo` dom", () => {
  it("jumps immediately when duration is 0", () => {
    vi.useFakeTimers();
    const target = document.createElement("div");
    target.scrollTop = 0;

    scrollTo(target, 100, { duration: 0 });

    vi.runAllTimers();
    expect(target.scrollTop).toBe(100);
  });

  it("animates when duration > 0", () => {
    vi.useFakeTimers();
    const target = document.createElement("div");
    target.scrollTop = 0;

    scrollTo(target, 100, { duration: 1000 });

    // After first frame, should have moved
    vi.advanceTimersByTime(16);
    expect(target.scrollTop).toBeGreaterThan(0);

    // Run all animation frames
    vi.runAllTimers();
    expect(target.scrollTop).toBe(100);
  });

  it("handles horizontal orientation", () => {
    vi.useFakeTimers();
    const target = document.createElement("div");
    target.scrollLeft = 0;

    scrollTo(target, 200, { duration: 0, orientation: "horizontal" });

    vi.runAllTimers();
    expect(target.scrollLeft).toBe(200);
  });
});
