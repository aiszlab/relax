import * as waspTailwindcss from "../src/tailwindcss";

describe("tailwindcss", () => {
  it("re-exports compile from tailwindcss", () => {
    expect(waspTailwindcss.compile).toBeDefined();
    expect(typeof waspTailwindcss.compile).toBe("function");
  });

  it("re-exports compileAst from tailwindcss", () => {
    expect(waspTailwindcss.compileAst).toBeDefined();
    expect(typeof waspTailwindcss.compileAst).toBe("function");
  });

  it("re-exports __unstable__loadDesignSystem from tailwindcss", () => {
    expect(waspTailwindcss.__unstable__loadDesignSystem).toBeDefined();
    expect(typeof waspTailwindcss.__unstable__loadDesignSystem).toBe("function");
  });
});
