import { vi } from "vitest";

const { mockPrintUrls, mockListen, mockCreateServer } = vi.hoisted(() => ({
  mockPrintUrls: vi.fn(),
  mockListen: vi.fn(),
  mockCreateServer: vi.fn(),
}));

vi.mock("vite", () => ({
  createServer: mockCreateServer,
}));

vi.mock("../../src/configurations/vite.config.js", () => ({
  default: { server: { port: 9527 }, plugins: [] },
}));

import { development } from "../../src/libs/development";

describe("development", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListen.mockResolvedValue({
      printUrls: mockPrintUrls,
    });
    mockCreateServer.mockResolvedValue({
      listen: mockListen,
    });
  });

  it("creates a vite server with the configuration", async () => {
    await development();

    expect(mockCreateServer).toHaveBeenCalledTimes(1);
    expect(mockCreateServer).toHaveBeenCalledWith({
      server: { port: 9527 },
      plugins: [],
    });
  });

  it("calls listen on the created server", async () => {
    await development();

    expect(mockListen).toHaveBeenCalledTimes(1);
  });

  it("calls printUrls after the server starts listening", async () => {
    await development();

    expect(mockPrintUrls).toHaveBeenCalledTimes(1);
  });

  it("propagates error when createServer fails", async () => {
    const error = new Error("Server creation failed");
    mockCreateServer.mockRejectedValueOnce(error);

    await expect(development()).rejects.toThrow("Server creation failed");
  });

  it("propagates error when listen fails", async () => {
    const error = new Error("Port already in use");
    mockListen.mockRejectedValueOnce(error);

    await expect(development()).rejects.toThrow("Port already in use");
  });
});
