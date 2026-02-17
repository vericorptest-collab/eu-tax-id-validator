import { describe, it, expect } from "vitest";
import { validateTaxId } from "../src/index";

describe("validateTaxId", () => {
  // === Portugal (Módulo 11) ===
  describe("PT — NIF", () => {
    it("validates correct NIF with prefix", () => {
      const result = validateTaxId("PT502011378");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("PT");
      expect(result.checksum_verified).toBe(true);
    });

    it("validates correct NIF without prefix", () => {
      const result = validateTaxId("502011378");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("PT");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects NIF with wrong checksum", () => {
      const result = validateTaxId("PT502011379");
      expect(result.valid).toBe(false);
      expect(result.checksum_verified).toBe(false);
    });

    it("rejects NIF starting with 4", () => {
      const result = validateTaxId("PT400000000");
      expect(result.valid).toBe(false);
    });

    it("handles spaces and dashes", () => {
      const result = validateTaxId("PT 502 011 378");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe("PT502011378");
    });

    it("validates known NIF: 509442013", () => {
      const result = validateTaxId("PT509442013");
      expect(result.valid).toBe(true);
      expect(result.checksum_verified).toBe(true);
    });
  });

  // === UK ===
  describe("GB — Company Number / VAT", () => {
    it("validates 8-digit company number", () => {
      const result = validateTaxId("GB12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("GB");
      expect(result.checksum_verified).toBe(false);
    });

    it("validates 9-digit VAT number", () => {
      const result = validateTaxId("GB123456789");
      expect(result.valid).toBe(true);
    });

    it("validates 12-digit VAT number", () => {
      const result = validateTaxId("GB123456789012");
      expect(result.valid).toBe(true);
    });

    it("validates letter prefix company number", () => {
      const result = validateTaxId("GBSC123456");
      expect(result.valid).toBe(true);
    });

    it("rejects invalid GB format", () => {
      const result = validateTaxId("GB12345");
      expect(result.valid).toBe(false);
    });
  });

  // === Denmark (Módulo 11) ===
  describe("DK — CVR", () => {
    it("validates correct CVR with prefix", () => {
      const result = validateTaxId("DK10150817");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("DK");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects invalid CVR checksum", () => {
      const result = validateTaxId("DK12345679");
      expect(result.valid).toBe(false);
    });
  });

  // === Norway ===
  describe("NO — Org.nr", () => {
    it("validates correct org number with prefix", () => {
      const result = validateTaxId("NO923609016");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("NO");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects invalid org number", () => {
      const result = validateTaxId("NO923609017");
      expect(result.valid).toBe(false);
    });
  });

  // === Finland ===
  describe("FI — Y-tunnus", () => {
    it("validates correct Y-tunnus with prefix", () => {
      const result = validateTaxId("FI01234562");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("FI");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects invalid Y-tunnus", () => {
      const result = validateTaxId("FI01234563");
      expect(result.valid).toBe(false);
    });
  });

  // === Estonia ===
  describe("EE — Registry code", () => {
    it("validates 8-digit code", () => {
      const result = validateTaxId("EE12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("EE");
      expect(result.checksum_verified).toBe(false);
    });

    it("validates 9-digit code", () => {
      const result = validateTaxId("EE123456789");
      expect(result.valid).toBe(true);
    });
  });

  // === Poland (NIP checksum) ===
  describe("PL — NIP", () => {
    it("validates correct NIP with prefix", () => {
      const result = validateTaxId("PL7740001454");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("PL");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects NIP with wrong checksum", () => {
      const result = validateTaxId("PL7740001455");
      expect(result.valid).toBe(false);
    });
  });

  // === Czech Republic (IČO checksum) ===
  describe("CZ — IČO", () => {
    it("validates correct IČO with prefix", () => {
      const result = validateTaxId("CZ25596641");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("CZ");
      expect(result.checksum_verified).toBe(true);
    });

    it("rejects invalid IČO checksum", () => {
      const result = validateTaxId("CZ25596642");
      expect(result.valid).toBe(false);
    });

    it("accepts 9-10 digit DIČ", () => {
      const result = validateTaxId("CZ123456789");
      expect(result.valid).toBe(true);
    });
  });

  // === Switzerland ===
  describe("CH — UID", () => {
    it("validates CHE prefix", () => {
      const result = validateTaxId("CHE105835786");
      expect(result.country).toBe("CH");
    });

    it("validates CH prefix with 9 digits", () => {
      const result = validateTaxId("CH105835786");
      expect(result.country).toBe("CH");
    });
  });

  // === Generic EU countries ===
  describe("Generic EU", () => {
    it("validates DE VAT", () => {
      const result = validateTaxId("DE123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("DE");
      expect(result.checksum_verified).toBe(false);
    });

    it("validates FR VAT", () => {
      const result = validateTaxId("FRXX123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("FR");
    });

    it("validates IT VAT", () => {
      const result = validateTaxId("IT12345678901");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("IT");
    });

    it("validates ES CIF", () => {
      const result = validateTaxId("ESA12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("ES");
    });

    it("validates NL BTW", () => {
      const result = validateTaxId("NL123456789B01");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("NL");
    });

    it("validates BE BTW", () => {
      const result = validateTaxId("BE0123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("BE");
    });

    it("validates AT UID", () => {
      const result = validateTaxId("ATU12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("AT");
    });

    it("validates SE Org.nr", () => {
      const result = validateTaxId("SE123456789012");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("SE");
    });

    it("validates EL AFM", () => {
      const result = validateTaxId("EL123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("EL");
    });

    it("validates HR OIB", () => {
      const result = validateTaxId("HR12345678901");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("HR");
    });

    it("validates LV PVN", () => {
      const result = validateTaxId("LV12345678901");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("LV");
    });

    it("validates LT PVM", () => {
      const result = validateTaxId("LT123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("LT");
    });

    it("validates BG EIK", () => {
      const result = validateTaxId("BG123456789");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("BG");
    });

    it("validates RO CUI", () => {
      const result = validateTaxId("RO12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("RO");
    });

    it("validates HU Adószám", () => {
      const result = validateTaxId("HU12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("HU");
    });

    it("validates SK IČ DPH", () => {
      const result = validateTaxId("SK1234567890");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("SK");
    });

    it("validates CY FPA", () => {
      const result = validateTaxId("CY12345678A");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("CY");
    });

    it("validates LU TVA", () => {
      const result = validateTaxId("LU12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("LU");
    });

    it("validates MT VAT", () => {
      const result = validateTaxId("MT12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("MT");
    });

    it("validates SI DDV", () => {
      const result = validateTaxId("SI12345678");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("SI");
    });

    it("validates IE VAT", () => {
      const result = validateTaxId("IE1234567A");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("IE");
    });
  });

  // === Edge cases ===
  describe("Edge cases", () => {
    it("rejects empty string", () => {
      const result = validateTaxId("");
      expect(result.valid).toBe(false);
    });

    it("rejects too short", () => {
      const result = validateTaxId("PT1");
      expect(result.valid).toBe(false);
    });

    it("rejects too long", () => {
      const result = validateTaxId("PT12345678901234567890");
      expect(result.valid).toBe(false);
    });

    it("handles lowercase input", () => {
      const result = validateTaxId("pt502011378");
      expect(result.valid).toBe(true);
      expect(result.country).toBe("PT");
    });

    it("handles dashes in input", () => {
      const result = validateTaxId("PT-502-011-378");
      expect(result.valid).toBe(true);
    });

    it("handles dots in input", () => {
      const result = validateTaxId("PT.502.011.378");
      expect(result.valid).toBe(true);
    });

    it("rejects unknown country prefix", () => {
      const result = validateTaxId("XX123456789");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Cannot determine country");
    });

    it("rejects special characters", () => {
      const result = validateTaxId("PT50201137!");
      expect(result.valid).toBe(false);
    });
  });
});
