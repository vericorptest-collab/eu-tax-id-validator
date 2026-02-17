export type { ValidationResult, CountryInfo } from "./types";
export type { CountryCode } from "./countries";
export { isEUMember, COUNTRIES, COUNTRY_PREFIXES } from "./countries";

import type { ValidationResult } from "./types";
import { COUNTRY_PREFIXES } from "./countries";
import { validatePT, validateDK, validateNO, validateFI, validatePL, validateCZ, validateCH } from "./validators/checksum";
import { validateGB, validateEE, genericValidators } from "./validators/format";

// Countries with checksum verification
const CHECKSUM_COUNTRIES = new Set(["PT", "DK", "NO", "FI", "PL", "CZ", "CH"]);

type Validator = (numericPart: string) => { valid: boolean; normalized: string; error?: string };

const VALIDATORS: Record<string, Validator> = {
  PT: validatePT,
  GB: validateGB,
  DK: validateDK,
  NO: validateNO,
  FI: validateFI,
  EE: validateEE,
  PL: validatePL,
  CZ: validateCZ,
  CH: validateCH,
  ...genericValidators,
};

/**
 * Validate a European tax ID / VAT number.
 * Supports 30 countries (27 EU + UK, NO, CH).
 * Returns format validity, detected country, and checksum verification status.
 */
export function validateTaxId(raw: string): ValidationResult {
  const cleaned = raw.replace(/[\s\-\.]/g, "").toUpperCase();

  if (cleaned.length < 4 || cleaned.length > 20) {
    return { valid: false, country: null, normalized: cleaned, checksum_verified: false, error: "Invalid length" };
  }

  const country = detectCountry(cleaned);
  if (!country) {
    return { valid: false, country: null, normalized: cleaned, checksum_verified: false, error: "Cannot determine country" };
  }

  const numericPart = stripCountryPrefix(cleaned, country);
  const validator = VALIDATORS[country];
  if (!validator) {
    return {
      valid: /^[A-Z0-9]+$/.test(numericPart),
      country,
      normalized: country + numericPart,
      checksum_verified: false,
    };
  }

  const result = validator(numericPart);
  return {
    ...result,
    country,
    normalized: country + result.normalized,
    checksum_verified: result.valid && CHECKSUM_COUNTRIES.has(country),
  };
}

function stripCountryPrefix(cleaned: string, country: string): string {
  // CH can have "CHE" prefix (3 letters)
  if (country === "CH" && cleaned.startsWith("CHE")) {
    return cleaned.substring(3);
  }
  // Standard 2-letter prefix
  if (cleaned.startsWith(country)) {
    return cleaned.substring(country.length);
  }
  // No prefix (detected by format)
  return cleaned;
}

/**
 * Detect country from a tax ID string.
 * Tries prefix matching first, then format-based detection.
 */
export function detectCountry(taxId: string): string | null {
  const cleaned = taxId.replace(/[\s\-\.]/g, "").toUpperCase();
  const prefix = cleaned.substring(0, 2);
  const rest = cleaned.substring(2);

  // Check 2-letter country prefix
  if ((COUNTRY_PREFIXES as readonly string[]).includes(prefix) && rest.length > 0) {
    return prefix;
  }

  // CH can have 3-letter prefix "CHE"
  if (cleaned.startsWith("CHE") && cleaned.length > 3) {
    return "CH";
  }

  // Try format-based detection (no prefix)
  if (/^\d{9}$/.test(cleaned)) {
    if (validatePT(cleaned).valid) return "PT";
  }
  if (/^\d{8}$/.test(cleaned)) {
    if (validateDK(cleaned).valid) return "DK";
    if (validateCZ(cleaned).valid) return "CZ";
  }

  return null;
}

/**
 * Format a tax ID with country-specific grouping for display.
 * Example: "PT502011378" → "PT 502 011 378"
 */
export function formatVatNumber(taxId: string, country?: string): string {
  const cleaned = taxId.replace(/[\s\-\.]/g, "").toUpperCase();

  let cc = country?.toUpperCase();
  let digits: string;

  if (!cc) {
    cc = detectCountry(cleaned) ?? undefined;
    digits = cc ? stripCountryPrefix(cleaned, cc) : cleaned;
  } else {
    digits = cleaned.startsWith(cc) ? cleaned.substring(cc.length) : cleaned;
    if (cc === "CH" && cleaned.startsWith("CHE")) {
      digits = cleaned.substring(3);
    }
  }

  if (!cc) return cleaned;

  const formatted = FORMAT_RULES[cc]?.(digits) ?? digits;
  return `${cc} ${formatted}`;
}

const FORMAT_RULES: Record<string, (digits: string) => string> = {
  // PT: 502 011 378
  PT: (d) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
  // DK: 10 15 08 17
  DK: (d) => d.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4"),
  // GB: 123 4567 89 (VAT 9-digit) or 12345678 (company)
  GB: (d) => {
    if (d.length === 9) return d.replace(/(\d{3})(\d{4})(\d{2})/, "$1 $2 $3");
    return d;
  },
  // NO: 923 609 016
  NO: (d) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
  // FI: 0123456-2
  FI: (d) => d.length === 8 ? `${d.slice(0, 7)}-${d.slice(7)}` : d,
  // PL: 774-000-14-54
  PL: (d) => d.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1-$2-$3-$4"),
  // CZ: 255 96 641
  CZ: (d) => d.replace(/(\d{3})(\d{2})(\d{3})/, "$1 $2 $3"),
  // CH: CHE-123.456.789
  CH: (d) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3"),
  // DE: 123 456 789
  DE: (d) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
  // FR: XX 123 456 789
  FR: (d) => {
    if (d.length === 11) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
    return d;
  },
  // IT: 123 4567 8901
  IT: (d) => d.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3"),
  // ES: X-1234567-X
  ES: (d) => d.length === 9 ? `${d[0]}-${d.slice(1, 8)}-${d[8]}` : d,
  // NL: 123456789B01
  NL: (d) => d,
  // BE: 0123.456.789
  BE: (d) => d.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3"),
  // SE: 123456-7890-01
  SE: (d) => d.length === 12 ? `${d.slice(0, 6)}-${d.slice(6, 10)}-${d.slice(10)}` : d,
};
