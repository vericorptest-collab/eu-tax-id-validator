import { describe, it, expect } from "vitest";
import { formatVatNumber } from "../src/index";

describe("formatVatNumber", () => {
  it("formats PT NIF", () => {
    expect(formatVatNumber("PT502011378")).toBe("PT 502 011 378");
  });

  it("formats DK CVR", () => {
    expect(formatVatNumber("DK10150817")).toBe("DK 10 15 08 17");
  });

  it("formats GB VAT (9-digit)", () => {
    expect(formatVatNumber("GB123456789")).toBe("GB 123 4567 89");
  });

  it("formats GB company number (8-digit)", () => {
    expect(formatVatNumber("GB12345678")).toBe("GB 12345678");
  });

  it("formats NO org.nr", () => {
    expect(formatVatNumber("NO923609016")).toBe("NO 923 609 016");
  });

  it("formats FI Y-tunnus", () => {
    expect(formatVatNumber("FI01234562")).toBe("FI 0123456-2");
  });

  it("formats PL NIP", () => {
    expect(formatVatNumber("PL7740001454")).toBe("PL 774-000-14-54");
  });

  it("formats DE VAT", () => {
    expect(formatVatNumber("DE123456789")).toBe("DE 123 456 789");
  });

  it("formats with explicit country", () => {
    expect(formatVatNumber("502011378", "PT")).toBe("PT 502 011 378");
  });

  it("formats CH UID", () => {
    expect(formatVatNumber("CH105835786")).toBe("CH 105.835.786");
  });

  it("formats CHE prefix", () => {
    expect(formatVatNumber("CHE105835786")).toBe("CH 105.835.786");
  });

  it("formats ES CIF", () => {
    expect(formatVatNumber("ESA12345678")).toBe("ES A-1234567-8");
  });

  it("formats BE BTW", () => {
    expect(formatVatNumber("BE0123456789")).toBe("BE 0123.456.789");
  });

  it("formats FR SIREN", () => {
    expect(formatVatNumber("FRXX123456789")).toBe("FR XX 123 456 789");
  });

  it("returns raw if country unknown", () => {
    expect(formatVatNumber("XXXXX")).toBe("XXXXX");
  });
});
