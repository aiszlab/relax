import { hexToRgba } from "../../src/color";

describe("hexToRgba", () => {
  describe("6-char hex", () => {
    it("converts white correctly", () => {
      const result = hexToRgba("#ffffff");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(1);
    });

    it("converts black correctly", () => {
      const result = hexToRgba("#000000");
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(0);
      expect(result[3]).toBe(1);
    });

    it("converts red correctly", () => {
      const result = hexToRgba("#ff0000");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(0);
      expect(result[3]).toBe(1);
    });

    it("converts without hash prefix", () => {
      const result = hexToRgba("ffffff");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(1);
    });
  });

  describe("3-char shortcut hex", () => {
    it("expands 3-char hex to 6-char", () => {
      const result = hexToRgba("#fff");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(1);
    });

    it("expands 3-char hex without hash", () => {
      const result = hexToRgba("abc");
      expect(result[0]).toBe(170); // aa
      expect(result[1]).toBe(187); // bb
      expect(result[2]).toBe(204); // cc
      expect(result[3]).toBe(1);
    });
  });

  describe("5-char shortcut hex", () => {
    it("expands 5-char hex (first 3 duplicated, last 2 as alpha)", () => {
      const result = hexToRgba("#abcde");
      // expands to: aa, bb, cc, de
      expect(result[0]).toBe(170); // aa
      expect(result[1]).toBe(187); // bb
      expect(result[2]).toBe(204); // cc
      // alpha from "de" = 0xde / 255 = 222/255 ≈ 0.87
      expect(result[3]).toBeCloseTo(0.87, 2);
    });
  });

  describe("8-char hex with alpha", () => {
    it("reads alpha from 8-char hex", () => {
      const result = hexToRgba("#ffffffff");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(1);
    });

    it("reads semi-transparent alpha from 8-char hex", () => {
      const result = hexToRgba("#ffffff80");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      // 0x80 = 128, 128/255 ≈ 0.50
      expect(result[3]).toBeCloseTo(0.5, 2);
    });

    it("reads fully transparent alpha from 8-char hex", () => {
      const result = hexToRgba("#ffffff00");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(255);
      expect(result[2]).toBe(255);
      expect(result[3]).toBe(0);
    });
  });

  describe("alpha parameter override", () => {
    it("overrides hex alpha with explicit alpha parameter", () => {
      const result = hexToRgba("#ffffff80", 0.7);
      expect(result[3]).toBe(0.7);
    });

    it("sets alpha when hex has no alpha channel", () => {
      const result = hexToRgba("#ffffff", 0.3);
      expect(result[3]).toBe(0.3);
    });

    it("defaults alpha to 1 when not provided", () => {
      const result = hexToRgba("#ff0000");
      expect(result[3]).toBe(1);
    });
  });

  describe("toString", () => {
    it("returns rgba string representation", () => {
      const result = hexToRgba("#ff0000");
      expect(result.toString()).toBe("rgba(255,0,0,1)");
    });

    it("includes alpha in toString", () => {
      const result = hexToRgba("#ff0000", 0.5);
      expect(result.toString()).toBe("rgba(255,0,0,0.5)");
    });
  });

  describe("error handling", () => {
    it("throws on invalid hex color", () => {
      expect(() => hexToRgba("not-a-color")).toThrow("Invalid hex color");
    });

    it("throws on empty string", () => {
      expect(() => hexToRgba("")).toThrow("Invalid hex color");
    });
  });

  describe("array-like access", () => {
    it("can destructure the result", () => {
      const [r, g, b, a] = hexToRgba("#0a0b0c");
      expect(r).toBe(10);
      expect(g).toBe(11);
      expect(b).toBe(12);
      expect(a).toBe(1);
    });

    it("result has length 4", () => {
      const result = hexToRgba("#ffffff");
      expect(result).toHaveLength(4);
    });

    it("result elements are accessible by index", () => {
      const result = hexToRgba("#ff8000");
      expect(result[0]).toBe(255);
      expect(result[1]).toBe(128);
      expect(result[2]).toBe(0);
      expect(result[3]).toBe(1);
    });
  });
});
