// Format-only validators (regex, no checksum)

type ValidatorResult = { valid: boolean; normalized: string; error?: string };
type Validator = (numericPart: string) => ValidatorResult;

function genericValidator(pattern: RegExp, errorMsg: string): Validator {
  return (numericPart: string) => ({
    valid: pattern.test(numericPart),
    normalized: numericPart,
    error: pattern.test(numericPart) ? undefined : errorMsg,
  });
}

// === UK — Company number or VAT ===

export function validateGB(value: string): ValidatorResult {
  if (/^\d{9}$/.test(value) || /^\d{12}$/.test(value)) {
    return { valid: true, normalized: value };
  }
  if (/^\d{8}$/.test(value) || /^[A-Z]{2}\d{6}$/.test(value)) {
    return { valid: true, normalized: value };
  }
  return { valid: false, normalized: value, error: "GB: 8-digit company number or 9/12-digit VAT" };
}

// === Estonia — 8-9 digits (format only) ===

export function validateEE(digits: string): ValidatorResult {
  if (!/^\d{8,9}$/.test(digits)) {
    return { valid: false, normalized: digits, error: "EE registry code must be 8-9 digits" };
  }
  return { valid: true, normalized: digits };
}

// === Generic EU validators ===

export const genericValidators: Record<string, Validator> = {
  AT: genericValidator(/^U?\d{8,9}$/, "AT VAT: U + 8 digits"),
  BE: genericValidator(/^[01]\d{9}$/, "BE VAT: 10 digits starting with 0 or 1"),
  BG: genericValidator(/^\d{9,10}$/, "BG VAT: 9 or 10 digits"),
  CY: genericValidator(/^\d{8}[A-Z]$/, "CY VAT: 8 digits + letter"),
  DE: genericValidator(/^\d{9}$/, "DE VAT: 9 digits"),
  EL: genericValidator(/^\d{9}$/, "EL VAT: 9 digits"),
  ES: genericValidator(/^[A-Z0-9]\d{7}[A-Z0-9]$/, "ES VAT: letter/digit + 7 digits + letter/digit"),
  FR: genericValidator(/^[A-Z0-9]{2}\d{9}$/, "FR VAT: 2 chars + 9 digits"),
  HR: genericValidator(/^\d{11}$/, "HR VAT: 11 digits"),
  HU: genericValidator(/^\d{8}$/, "HU VAT: 8 digits"),
  IE: genericValidator(/^[0-9A-Z]\d{5,6}[A-Z]{1,2}$/, "IE VAT: 7-8 chars"),
  IT: genericValidator(/^\d{11}$/, "IT VAT: 11 digits"),
  LT: genericValidator(/^\d{9,12}$/, "LT VAT: 9 or 12 digits"),
  LU: genericValidator(/^\d{8}$/, "LU VAT: 8 digits"),
  LV: genericValidator(/^\d{11}$/, "LV VAT: 11 digits"),
  MT: genericValidator(/^\d{8}$/, "MT VAT: 8 digits"),
  NL: genericValidator(/^\d{9}B\d{2}$/, "NL VAT: 9 digits + B + 2 digits"),
  RO: genericValidator(/^\d{2,10}$/, "RO VAT: 2-10 digits"),
  SE: genericValidator(/^\d{12}$/, "SE VAT: 12 digits"),
  SI: genericValidator(/^\d{8}$/, "SI VAT: 8 digits"),
  SK: genericValidator(/^\d{10}$/, "SK VAT: 10 digits"),
};
