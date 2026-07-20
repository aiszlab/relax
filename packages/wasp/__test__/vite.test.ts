import * as waspVite from "../src/vite";

describe("vite", () => {
  it("re-exports defineConfig from vite", () => {
    expect(waspVite.defineConfig).toBeDefined();
    expect(typeof waspVite.defineConfig).toBe("function");
  });

  it("re-exports build from vite", () => {
    expect(waspVite.build).toBeDefined();
    expect(typeof waspVite.build).toBe("function");
  });

  it("re-exports createServer from vite", () => {
    expect(waspVite.createServer).toBeDefined();
    expect(typeof waspVite.createServer).toBe("function");
  });

  it("re-exports createLogger from vite", () => {
    expect(waspVite.createLogger).toBeDefined();
    expect(typeof waspVite.createLogger).toBe("function");
  });

  it("re-exports mergeConfig from vite", () => {
    expect(waspVite.mergeConfig).toBeDefined();
    expect(typeof waspVite.mergeConfig).toBe("function");
  });
});
