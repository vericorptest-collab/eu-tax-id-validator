import type { CountryInfo } from "./types";

export const COUNTRY_PREFIXES = [
  "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "EL", "ES",
  "FI", "FR", "GB", "HR", "HU", "IE", "IT", "LT", "LU", "LV",
  "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;

export type CountryCode = (typeof COUNTRY_PREFIXES)[number];

const EU_MEMBERS: ReadonlySet<string> = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES",
  "FI", "FR", "HR", "HU", "IE", "IT", "LT", "LU", "LV",
  "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
]);

export function isEUMember(countryCode: string): boolean {
  return EU_MEMBERS.has(countryCode.toUpperCase());
}

export const COUNTRIES: Record<string, CountryInfo> = {
  AT: { code: "AT", name: "Austria", local_name: "Österreich", tax_id_name: "UID", eu_member: true, has_checksum: false, format_description: "U + 8 digits" },
  BE: { code: "BE", name: "Belgium", local_name: "België", tax_id_name: "BTW", eu_member: true, has_checksum: false, format_description: "10 digits starting with 0 or 1" },
  BG: { code: "BG", name: "Bulgaria", local_name: "България", tax_id_name: "ЕИК", eu_member: true, has_checksum: false, format_description: "9 or 10 digits" },
  CH: { code: "CH", name: "Switzerland", local_name: "Schweiz", tax_id_name: "UID", eu_member: false, has_checksum: true, format_description: "9 digits (CHE + 6 + check)" },
  CY: { code: "CY", name: "Cyprus", local_name: "Κύπρος", tax_id_name: "ΦΠΑ", eu_member: true, has_checksum: false, format_description: "8 digits + letter" },
  CZ: { code: "CZ", name: "Czech Republic", local_name: "Česko", tax_id_name: "IČO", eu_member: true, has_checksum: true, format_description: "8 digits with checksum" },
  DE: { code: "DE", name: "Germany", local_name: "Deutschland", tax_id_name: "USt-IdNr", eu_member: true, has_checksum: false, format_description: "9 digits" },
  DK: { code: "DK", name: "Denmark", local_name: "Danmark", tax_id_name: "CVR", eu_member: true, has_checksum: true, format_description: "8 digits with Modulo 11" },
  EE: { code: "EE", name: "Estonia", local_name: "Eesti", tax_id_name: "Registrikood", eu_member: true, has_checksum: false, format_description: "8-9 digits" },
  EL: { code: "EL", name: "Greece", local_name: "Ελλάδα", tax_id_name: "ΑΦΜ", eu_member: true, has_checksum: false, format_description: "9 digits" },
  ES: { code: "ES", name: "Spain", local_name: "España", tax_id_name: "NIF/CIF", eu_member: true, has_checksum: false, format_description: "letter/digit + 7 digits + letter/digit" },
  FI: { code: "FI", name: "Finland", local_name: "Suomi", tax_id_name: "Y-tunnus", eu_member: true, has_checksum: true, format_description: "8 digits with Modulo 11" },
  FR: { code: "FR", name: "France", local_name: "France", tax_id_name: "SIREN", eu_member: true, has_checksum: false, format_description: "2 chars + 9 digits" },
  GB: { code: "GB", name: "United Kingdom", local_name: "United Kingdom", tax_id_name: "VAT/Company No.", eu_member: false, has_checksum: false, format_description: "8-digit company or 9/12-digit VAT" },
  HR: { code: "HR", name: "Croatia", local_name: "Hrvatska", tax_id_name: "OIB", eu_member: true, has_checksum: false, format_description: "11 digits" },
  HU: { code: "HU", name: "Hungary", local_name: "Magyarország", tax_id_name: "Adószám", eu_member: true, has_checksum: false, format_description: "8 digits" },
  IE: { code: "IE", name: "Ireland", local_name: "Éire", tax_id_name: "VAT", eu_member: true, has_checksum: false, format_description: "7-8 alphanumeric" },
  IT: { code: "IT", name: "Italy", local_name: "Italia", tax_id_name: "P.IVA", eu_member: true, has_checksum: false, format_description: "11 digits" },
  LT: { code: "LT", name: "Lithuania", local_name: "Lietuva", tax_id_name: "PVM kodas", eu_member: true, has_checksum: false, format_description: "9 or 12 digits" },
  LU: { code: "LU", name: "Luxembourg", local_name: "Luxembourg", tax_id_name: "TVA", eu_member: true, has_checksum: false, format_description: "8 digits" },
  LV: { code: "LV", name: "Latvia", local_name: "Latvija", tax_id_name: "PVN", eu_member: true, has_checksum: false, format_description: "11 digits" },
  MT: { code: "MT", name: "Malta", local_name: "Malta", tax_id_name: "VAT", eu_member: true, has_checksum: false, format_description: "8 digits" },
  NL: { code: "NL", name: "Netherlands", local_name: "Nederland", tax_id_name: "BTW", eu_member: true, has_checksum: false, format_description: "9 digits + B + 2 digits" },
  NO: { code: "NO", name: "Norway", local_name: "Norge", tax_id_name: "Org.nr", eu_member: false, has_checksum: true, format_description: "9 digits with Modulo 11" },
  PL: { code: "PL", name: "Poland", local_name: "Polska", tax_id_name: "NIP", eu_member: true, has_checksum: true, format_description: "10 digits with checksum" },
  PT: { code: "PT", name: "Portugal", local_name: "Portugal", tax_id_name: "NIF", eu_member: true, has_checksum: true, format_description: "9 digits with Modulo 11" },
  RO: { code: "RO", name: "Romania", local_name: "România", tax_id_name: "CUI", eu_member: true, has_checksum: false, format_description: "2-10 digits" },
  SE: { code: "SE", name: "Sweden", local_name: "Sverige", tax_id_name: "Org.nr", eu_member: true, has_checksum: false, format_description: "12 digits" },
  SI: { code: "SI", name: "Slovenia", local_name: "Slovenija", tax_id_name: "DDV", eu_member: true, has_checksum: false, format_description: "8 digits" },
  SK: { code: "SK", name: "Slovakia", local_name: "Slovensko", tax_id_name: "IČ DPH", eu_member: true, has_checksum: false, format_description: "10 digits" },
};
