import { stopPropagation } from "../../src/dom/stop-propagation";

describe("`stopPropagation`", () => {
  it("calls stopPropagation on the event", () => {
    const mockEvent = {
      stopPropagation: vi.fn(),
    };

    stopPropagation(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });
});
