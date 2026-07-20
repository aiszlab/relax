import { vi } from "vitest";

const { mockBuild } = vi.hoisted(() => ({
  mockBuild: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("vite", () => ({
  build: mockBuild,
}));

vi.mock("../../src/configurations/vite.config.js", () => ({
  default: { server: { port: 9527 }, plugins: [] },
}));

import { build } from "../../src/libs/build";

describe("build", () => {
  it("calls vite.build with the configuration", async () => {
    mockBuild.mockClear();
    await build();

    expect(mockBuild).toHaveBeenCalledTimes(1);
    expect(mockBuild).toHaveBeenCalledWith({
      server: { port: 9527 },
      plugins: [],
    });
  });

  it("resolves successfully when vite.build succeeds", async () => {
    mockBuild.mockResolvedValueOnce(undefined);

    await expect(build()).resolves.toBeUndefined();
  });

  it("propagates error when vite.build fails", async () => {
    const error = new Error("Build failed");
    mockBuild.mockRejectedValueOnce(error);

    await expect(build()).rejects.toThrow("Build failed");
  });
});
