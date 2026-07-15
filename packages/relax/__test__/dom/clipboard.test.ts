import { clipboard } from "../../src/dom/clipboard";

describe("`clipboard`", () => {
  it("calls navigator.clipboard.writeText", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    await clipboard("hello");

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith("hello");
  });
});
