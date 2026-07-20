import { hash } from "../../src/crypto";

describe("hash", () => {
  describe("default parameters", () => {
    it("returns a hex string with default parameters", async () => {
      const result = await hash();
      expect(typeof result).toBe("string");
      expect(/^[a-f0-9]+$/.test(result)).toBe(true);
    });

    it("returns a 40-character hex string with SHA-1", async () => {
      const result = await hash();
      // SHA-1 produces 20 bytes = 40 hex characters
      expect(result.length).toBe(40);
    });
  });

  describe("with custom input", () => {
    it("produces deterministic output for the same input", async () => {
      const input = "hello world";
      const result1 = await hash(input);
      const result2 = await hash(input);
      expect(result1).toBe(result2);
    });

    it("produces different output for different inputs", async () => {
      const result1 = await hash("hello");
      const result2 = await hash("world");
      expect(result1).not.toBe(result2);
    });
  });

  describe("with custom algorithm", () => {
    it("supports SHA-256", async () => {
      const result = await hash("test", "SHA-256");
      expect(typeof result).toBe("string");
      // SHA-256 produces 32 bytes = 64 hex characters
      expect(result.length).toBe(64);
    });

    it("supports SHA-384", async () => {
      const result = await hash("test", "SHA-384");
      expect(typeof result).toBe("string");
      // SHA-384 produces 48 bytes = 96 hex characters
      expect(result.length).toBe(96);
    });

    it("supports SHA-512", async () => {
      const result = await hash("test", "SHA-512");
      expect(typeof result).toBe("string");
      // SHA-512 produces 64 bytes = 128 hex characters
      expect(result.length).toBe(128);
    });
  });

  describe("output format", () => {
    it("output is lowercase hex", async () => {
      const result = await hash("test");
      expect(result).toBe(result.toLowerCase());
    });

    it("output has no dashes or special characters", async () => {
      const result = await hash("test");
      expect(result).not.toContain("-");
      expect(result).not.toContain(" ");
    });

    it("output for empty string is valid", async () => {
      const result = await hash("");
      expect(typeof result).toBe("string");
      expect(result.length).toBe(40);
    });
  });
});
