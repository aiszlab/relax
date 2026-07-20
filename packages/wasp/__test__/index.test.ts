import { vi } from "vitest";

const { mockDevAction, mockBuildAction } = vi.hoisted(() => ({
  mockDevAction: vi.fn(),
  mockBuildAction: vi.fn(),
}));

// Mock build and development modules
vi.mock("../src/libs/build.js", () => ({
  build: mockBuildAction,
}));

vi.mock("../src/libs/development.js", () => ({
  development: mockDevAction,
}));

// Capture command registrations
const commands: Map<string, () => void> = new Map();

vi.mock("commander", () => {
  return {
    Command: class MockCommand {
      command(name: string) {
        const cmd = {
          action: (fn: () => void) => {
            commands.set(name, fn);
            return cmd;
          },
        };
        return cmd;
      }

      parse() {
        // no-op, prevent reading process.argv
      }
    },
  };
});

describe("index (CLI)", () => {
  beforeAll(async () => {
    await import("../src/index");
  });

  it("registers the dev command", () => {
    expect(commands.has("dev")).toBe(true);
  });

  it("registers the build command", () => {
    expect(commands.has("build")).toBe(true);
  });

  it("dev command action calls development", () => {
    const devAction = commands.get("dev");
    expect(devAction).toBeDefined();
    devAction!();

    expect(mockDevAction).toHaveBeenCalledTimes(1);
    expect(mockBuildAction).not.toHaveBeenCalled();
  });

  it("build command action calls build", () => {
    const buildAction = commands.get("build");
    expect(buildAction).toBeDefined();
    buildAction!();

    expect(mockBuildAction).toHaveBeenCalledTimes(1);
    expect(mockDevAction).toHaveBeenCalledTimes(1); // from previous test
  });
});
