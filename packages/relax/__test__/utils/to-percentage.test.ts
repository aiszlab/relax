import { toPercentage } from "../../src";

describe("`toPercentage` util", () => {
  it("natural stringification without digits", () => {
    expect(toPercentage(0)).toBe("0%");
    expect(toPercentage(1)).toBe("100%");
    expect(toPercentage(0.5)).toBe("50%");
    expect(toPercentage(0.1234)).toBe("12.34%");
  });

  it("fixed decimal places with digits", () => {
    expect(toPercentage(0.12345, 2)).toBe("12.35%");
    expect(toPercentage(0.12345, 0)).toBe("12%");
    expect(toPercentage(0.6666, 1)).toBe("66.7%");
  });

  it("negative value", () => {
    expect(toPercentage(-0.5)).toBe("-50%");
    expect(toPercentage(-0.1234, 1)).toBe("-12.3%");
  });
});
