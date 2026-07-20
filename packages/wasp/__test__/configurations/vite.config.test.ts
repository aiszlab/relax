import configuration from "../../src/configurations/vite.config";

describe("vite.config", () => {
  it("has the correct server port", () => {
    expect(configuration.server?.port).toBe(9527);
  });

  it("has plugins array configured", () => {
    expect(Array.isArray(configuration.plugins)).toBe(true);
    expect(configuration.plugins).toHaveLength(2);
  });

  it("has react plugin group (first plugin array)", () => {
    const reactPlugins = configuration.plugins?.[0];
    expect(Array.isArray(reactPlugins)).toBe(true);
    expect(reactPlugins).toHaveLength(2);
    expect((reactPlugins as any)[0].name).toBe("vite:react-babel");
    expect((reactPlugins as any)[1].name).toBe("vite:react-refresh");
  });

  it("has tailwindcss plugin group (second plugin array)", () => {
    const tailwindPlugins = configuration.plugins?.[1];
    expect(Array.isArray(tailwindPlugins)).toBe(true);
    expect(tailwindPlugins).toHaveLength(3);
    expect((tailwindPlugins as any)[0].name).toBe("@tailwindcss/vite:scan");
    expect((tailwindPlugins as any)[1].name).toBe("@tailwindcss/vite:generate:serve");
    expect((tailwindPlugins as any)[2].name).toBe("@tailwindcss/vite:generate:build");
  });

  it("is a valid Vite UserConfig (has expected shape)", () => {
    expect(configuration).toHaveProperty("server");
    expect(configuration).toHaveProperty("plugins");
    expect(configuration.server).toHaveProperty("port", 9527);
  });
});
