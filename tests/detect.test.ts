import { describe, it, expect } from "vitest";
import { detectCountry } from "../src/index";

describe("detectCountry", () => {
  it("detects PT from prefix", () => {
    expect(detectCountry("PT502011378")).toBe("PT");
  });

  it("detects GB from prefix", () => {
    expect(detectCountry("GB12345678")).toBe("GB");
  });

  it("detects DK from prefix", () => {
    expect(detectCountry("DK10150817")).toBe("DK");
  });

  it("detects CH from CHE prefix", () => {
    expect(detectCountry("CHE105835786")).toBe("CH");
  });

  it("detects CH from CH prefix", () => {
    expect(detectCountry("CH105835786")).toBe("CH");
  });

  it("detects PT from 9-digit format (no prefix)", () => {
    expect(detectCountry("502011378")).toBe("PT");
  });

  it("detects DK from 8-digit format (no prefix)", () => {
    expect(detectCountry("10150817")).toBe("DK");
  });

  it("returns null for ambiguous formats", () => {
    expect(detectCountry("12345")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(detectCountry("")).toBeNull();
  });

  it("handles lowercase", () => {
    expect(detectCountry("pt502011378")).toBe("PT");
  });

  it("handles all EU prefixes", () => {
    const prefixes = [
      "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES",
      "FI", "FR", "GB", "HR", "HU", "IE", "IT", "LT", "LU", "LV",
      "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
    ];
    for (const prefix of prefixes) {
      expect(detectCountry(`${prefix}123456789`)).toBe(prefix);
    }
  });
});
