import { describe, it, expect } from "vitest";
import { isEUMember, COUNTRIES, COUNTRY_PREFIXES } from "../src/index";

describe("isEUMember", () => {
  it("returns true for EU members", () => {
    const euCountries = ["PT", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL", "CZ"];
    for (const code of euCountries) {
      expect(isEUMember(code)).toBe(true);
    }
  });

  it("returns false for non-EU countries", () => {
    expect(isEUMember("GB")).toBe(false);
    expect(isEUMember("NO")).toBe(false);
    expect(isEUMember("CH")).toBe(false);
  });

  it("handles lowercase", () => {
    expect(isEUMember("pt")).toBe(true);
  });
});

describe("COUNTRIES", () => {
  it("has 30 countries", () => {
    expect(Object.keys(COUNTRIES).length).toBe(30);
  });

  it("all COUNTRY_PREFIXES have entries", () => {
    for (const prefix of COUNTRY_PREFIXES) {
      expect(COUNTRIES[prefix]).toBeDefined();
      expect(COUNTRIES[prefix].code).toBe(prefix);
    }
  });

  it("checksum countries are marked correctly", () => {
    const checksumCountries = ["PT", "DK", "NO", "FI", "PL", "CZ", "CH"];
    for (const code of checksumCountries) {
      expect(COUNTRIES[code].has_checksum).toBe(true);
    }
  });

  it("non-checksum countries are marked correctly", () => {
    expect(COUNTRIES["DE"].has_checksum).toBe(false);
    expect(COUNTRIES["GB"].has_checksum).toBe(false);
    expect(COUNTRIES["EE"].has_checksum).toBe(false);
  });
});
