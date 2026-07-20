import { hexToHsla } from "../../src/color";

describe("hexToHsla", () => {
  describe("basic color conversions", () => {
    it("converts red (#ff0000) to hsla", () => {
      const result = hexToHsla("#ff0000");
      expect(result[0]).toBe(0); // hue
      expect(result[1]).toBe(100); // saturation
      expect(result[2]).toBe(50); // lightness
      expect(result[3]).toBe(1); // alpha
    });

    it("converts green (#00ff00) to hsla", () => {
      const result = hexToHsla("#00ff00");
      expect(result[0]).toBe(120); // hue
      expect(result[1]).toBe(100); // saturation
      expect(result[2]).toBe(50); // lightness
      expect(result[3]).toBe(1); // alpha
    });

    it("converts blue (#0000ff) to hsla", () => {
      const result = hexToHsla("#0000ff");
      expect(result[0]).toBe(240); // hue
      expect(result[1]).toBe(100); // saturation
      expect(result[2]).toBe(50); // lightness
      expect(result[3]).toBe(1); // alpha
    });

    it("converts white (#ffffff) to hsla", () => {
      const result = hexToHsla("#ffffff");
      expect(result[0]).toBe(0); // hue (undefined for white, defaults to 0)
      expect(result[1]).toBe(0); // saturation
      expect(result[2]).toBe(100); // lightness
      expect(result[3]).toBe(1); // alpha
    });

    it("converts black (#000000) to hsla", () => {
      const result = hexToHsla("#000000");
      expect(result[0]).toBe(0); // hue (undefined for black, defaults to 0)
      expect(result[1]).toBe(0); // saturation
      expect(result[2]).toBe(0); // lightness
      expect(result[3]).toBe(1); // alpha
    });
  });

  describe("gray colors (r=g=b)", () => {
    it("converts gray with saturation 0", () => {
      const result = hexToHsla("#808080");
      // #808080 = rgb(128,128,128), all equal → saturation 0
      expect(result[1]).toBe(0); // saturation
    });

    it("converts light gray correctly", () => {
      const result = hexToHsla("#cccccc");
      expect(result[1]).toBe(0); // saturation
      expect(result[2]).toBe(80); // lightness (204/255 ≈ 0.8 → 80%)
    });

    it("converts dark gray correctly", () => {
      const result = hexToHsla("#404040");
      expect(result[1]).toBe(0); // saturation
      // 64/255 ≈ 0.251 → 25.1%
      expect(result[2]).toBeCloseTo(25.1, 0);
    });
  });

  describe("alpha handling", () => {
    it("defaults alpha to 1", () => {
      const result = hexToHsla("#ff0000");
      expect(result[3]).toBe(1);
    });

    it("accepts custom alpha", () => {
      const result = hexToHsla("#ff0000", 0.5);
      expect(result[3]).toBe(0.5);
    });

    it("reads alpha from 8-char hex", () => {
      const result = hexToHsla("#ff000080");
      // alpha from 0x80 = 128, 128/255 ≈ 0.50
      expect(result[3]).toBeCloseTo(0.5, 2);
    });

    it("overrides hex alpha with explicit alpha parameter", () => {
      const result = hexToHsla("#ff000080", 0.3);
      expect(result[3]).toBe(0.3);
    });
  });

  describe("toString", () => {
    it("returns hsla string representation", () => {
      const result = hexToHsla("#ff0000");
      expect(result.toString()).toBe("hsla(0,100,50,1)");
    });

    it("includes alpha in toString", () => {
      const result = hexToHsla("#ff0000", 0.5);
      expect(result.toString()).toBe("hsla(0,100,50,0.5)");
    });
  });

  describe("without hash prefix", () => {
    it("converts hex without hash", () => {
      const result = hexToHsla("ff0000");
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(100);
      expect(result[2]).toBe(50);
    });
  });

  describe("3-char shortcut hex", () => {
    it("converts 3-char hex to hsla", () => {
      const result = hexToHsla("#f00");
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(100);
      expect(result[2]).toBe(50);
    });
  });

  describe("hue wrapping (negative hue)", () => {
    it("wraps negative hue to positive", () => {
      // #00ffff (cyan): r=0, g=255, b=255
      // r=0, g=1, b=1, max=1(g), delta=1
      // g===max → h = 2 + (b-r)/delta = 2 + (1-0)/1 = 3
      // → but wait, that's positive. Let me think of a case where h is negative.
      // r===max case: h = (g-b)/delta, if g < b → h negative
      // #ff00ff (magenta): r=255, g=0, b=255
      // r=1, g=0, b=1, max=1(r), delta=1
      // r===max → h = (0-1)/1 = -1
      // h = -1*60 = -60, h < 0 → h += 360 = 300
      const result = hexToHsla("#ff00ff");
      expect(result[0]).toBe(300);
    });
  });

  describe("saturation calculation", () => {
    it("computes saturation for light colors (l > 0.5)", () => {
      // #ff8080: r=255, g=128, b=128
      // r=1, g≈0.502, b≈0.502
      // max=1, min≈0.502, delta≈0.498
      // l = (1+0.502)/2 ≈ 0.751 > 0.5
      // s = delta/(2-max-min) = 0.498/(2-1-0.502) = 0.498/0.498 = 1
      const result = hexToHsla("#ff8080");
      expect(result[1]).toBe(100);
    });

    it("computes saturation for dark colors (l <= 0.5)", () => {
      // #800000: r=128, g=0, b=0
      // r≈0.502, g=0, b=0
      // max≈0.502, min=0, delta≈0.502
      // l = (0.502+0)/2 ≈ 0.251 <= 0.5
      // s = delta/(max+min) = 0.502/(0.502+0) = 1
      const result = hexToHsla("#800000");
      expect(result[1]).toBe(100);
    });
  });

  describe("array-like access", () => {
    it("can destructure the result", () => {
      const [h, s, l, a] = hexToHsla("#ff0000");
      expect(h).toBe(0);
      expect(s).toBe(100);
      expect(l).toBe(50);
      expect(a).toBe(1);
    });

    it("result has length 4", () => {
      const result = hexToHsla("#ffffff");
      expect(result).toHaveLength(4);
    });

    it("result elements are accessible by index", () => {
      const result = hexToHsla("#00ff00");
      expect(result[0]).toBe(120);
      expect(result[1]).toBe(100);
      expect(result[2]).toBe(50);
      expect(result[3]).toBe(1);
    });
  });
});
