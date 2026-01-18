import { describe, it, expect } from "vitest";
import { maskApiKey, formatError, TropicaliaError } from "../src/utils/error-handling.js";

describe("maskApiKey", () => {
  it("masks long keys", () => {
    expect(maskApiKey("tr_abcdefghijk")).toBe("tr_abc...");
  });

  it("returns *** for short keys", () => {
    expect(maskApiKey("short")).toBe("***");
  });

  it("returns 'not set' for empty keys", () => {
    expect(maskApiKey("")).toBe("not set");
  });
});

describe("formatError", () => {
  it("formats TropicaliaError", () => {
    const error = new TropicaliaError("Test error", "TEST_CODE");
    expect(formatError(error)).toBe("Error: Test error");
  });

  it("formats standard Error", () => {
    const error = new Error("Standard error");
    expect(formatError(error)).toBe("Error: Standard error");
  });

  it("formats unknown error", () => {
    expect(formatError("string error")).toBe("Error: string error");
  });
});
