import { random } from "../../src/avatar";

// Mock the hash module so avatar generation is deterministic
vi.mock("../../src/crypto/hash", () => ({
  hash: vi.fn(),
}));

import { hash } from "../../src/crypto/hash";

const mockedHash = vi.mocked(hash);

describe("random (avatar)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: all 15 hex chars are odd (b, d, f, etc.) so every position renders
    // "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" = 40 chars of 'b'
    mockedHash.mockResolvedValue("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
  });

  describe("default options", () => {
    it("returns a data URI string", async () => {
      const result = await random();
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it("returns SVG with default size 32", async () => {
      const result = await random();
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toContain("width='32'");
      expect(decoded).toContain("height='32'");
    });

    it("uses rgb fill when no color specified", async () => {
      const result = await random();
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toMatch(/fill='rgb\(\d+,\d+,\d+\)'/);
    });
  });

  describe("custom options", () => {
    it("uses custom color", async () => {
      const result = await random({ color: "#ff0000" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toContain("fill='#ff0000'");
    });

    it("uses custom size", async () => {
      const result = await random({ size: 64 });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toContain("width='64'");
      expect(decoded).toContain("height='64'");
    });

    it("uses custom margin", async () => {
      // With margin=0.5 and size=32:
      // _size = floor((32 - 32*0.5*2) / 5) = floor(0/5) = 0
      const result = await random({ margin: 0.5 });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      // Rectangles have size 0, so the SVG still renders but with zero-size rects
      expect(decoded).toContain("width='0'");
      expect(decoded).toContain("height='0'");
    });
  });

  describe("SVG structure", () => {
    it("contains valid SVG markup", async () => {
      const result = await random({ color: "#000" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toContain("<svg xmlns='http://www.w3.org/2000/svg'");
      expect(decoded).toContain("</svg>");
    });

    it("contains viewBox attribute", async () => {
      const result = await random();
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      expect(decoded).toContain("viewBox='0 0 32 32'");
    });
  });

  describe("hash-based rendering", () => {
    it("renders rectangles when hash chars are odd", async () => {
      // All 'b' (hex 11) → odd → all 15 positions render
      // Positions 0-4: column 2 (5 rects)
      // Positions 5-9: columns 1,3 (10 rects)
      // Positions 10-14: columns 0,4 (10 rects)
      // Total: 25 rects
      const result = await random({ color: "#fff" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      const rectCount = (decoded.match(/<rect/g) || []).length;
      expect(rectCount).toBe(25);
    });

    it("renders no rectangles when all hash chars are even", async () => {
      // 'c' (hex 12) is even → no positions render
      mockedHash.mockResolvedValue("cccccccccccccccccccccccccccccccccccccccc");
      const result = await random({ color: "#fff" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      const rectCount = (decoded.match(/<rect/g) || []).length;
      expect(rectCount).toBe(0);
    });

    it("renders partial rectangles for mixed hash", async () => {
      // 'b' (odd), 'f' (odd), 'd' (odd) — first 5 are odd, rest even
      mockedHash.mockResolvedValue("bbbbbccccccccccccccccccccccccccccccccc");
      const result = await random({ color: "#fff" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      const rectCount = (decoded.match(/<rect/g) || []).length;
      // Only first 5 positions render (positions 0-4), each in column 2 → 5 rects
      expect(rectCount).toBe(5);
    });

    it("renders middle row rectangles for positions 5-9", async () => {
      // positions 0-4 even, 5-9 odd, 10-14 even
      mockedHash.mockResolvedValue("ccccccccccbbbbbcccccccccccccccccccccccc");
      const result = await random({ color: "#fff" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      const rectCount = (decoded.match(/<rect/g) || []).length;
      // Positions 5-9, columns [1,3] → 10 rects
      expect(rectCount).toBe(10);
    });

    it("renders last row rectangles for positions 10-14", async () => {
      // positions 0-9 even, 10-14 odd (10 c's, 5 b's, 25 c's)
      mockedHash.mockResolvedValue("ccccccccccbbbbbcccccccccccccccccccccccc");
      const result = await random({ color: "#fff" });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      const rectCount = (decoded.match(/<rect/g) || []).length;
      // Positions 10-14, columns [0,4] → 10 rects
      expect(rectCount).toBe(10);
    });
  });

  describe("margin handling", () => {
    it("default margin is 0.1", async () => {
      const result = await random({ color: "#fff", size: 32 });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      // _size = floor((32 - 32*0.1*2)/5) = floor((32-6.4)/5) = floor(25.6/5) = 5
      // _margin = floor((32 - 5*5)/2) = floor(7/2) = 3
      expect(decoded).toContain("width='5'");
      expect(decoded).toContain("height='5'");
      // First rect should be at x=3 (margin)
      expect(decoded).toMatch(/x='3'/);
    });

    it("zero margin puts rects at edge", async () => {
      const result = await random({ color: "#fff", margin: 0, size: 32 });
      const decoded = atob(result.replace("data:image/svg+xml;base64,", ""));
      // _size = floor(32/5) = 6
      // _margin = floor((32 - 5*6)/2) = floor(2/2) = 1
      expect(decoded).toContain("width='6'");
      expect(decoded).toMatch(/x='1'/);
    });
  });
});
