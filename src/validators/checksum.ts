// Checksum validators extracted from VeriCorp API
// Countries: PT, DK, NO, FI, PL, CZ, CH

type ValidatorResult = { valid: boolean; normalized: string; error?: string };

// === Portugal — Módulo 11 checksum ===

export function validatePT(digits: string): ValidatorResult {
  if (!/^\d{9}$/.test(digits)) {
    return { valid: false, normalized: digits, error: "PT NIF must be 9 digits" };
  }

  const firstDigit = parseInt(digits[0], 10);
  if (![1, 2, 3, 5, 6, 7, 8, 9].includes(firstDigit)) {
    return { valid: false, normalized: digits, error: "PT NIF invalid first digit" };
  }

  const weights = [9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(digits[8], 10) !== checkDigit) {
    return { valid: false, normalized: digits, error: "PT NIF checksum failed" };
  }

  return { valid: true, normalized: digits };
}

// === Denmark — Módulo 11 checksum ===

export function validateDK(digits: string): ValidatorResult {
  if (!/^\d{8}$/.test(digits)) {
    return { valid: false, normalized: digits, error: "DK CVR must be 8 digits" };
  }

  const weights = [2, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }

  if (sum % 11 !== 0) {
    return { valid: false, normalized: digits, error: "DK CVR checksum failed" };
  }

  return { valid: true, normalized: digits };
}

// === Norway — Módulo 11 checksum ===

export function validateNO(digits: string): ValidatorResult {
  if (!/^\d{9}$/.test(digits)) {
    return { valid: false, normalized: digits, error: "NO org.nr must be 9 digits" };
  }

  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  if (remainder === 1) {
    return { valid: false, normalized: digits, error: "NO org.nr checksum invalid" };
  }
  const checkDigit = remainder === 0 ? 0 : 11 - remainder;

  if (parseInt(digits[8], 10) !== checkDigit) {
    return { valid: false, normalized: digits, error: "NO org.nr checksum failed" };
  }

  return { valid: true, normalized: digits };
}

// === Finland — Módulo 11 checksum ===

export function validateFI(value: string): ValidatorResult {
  const cleaned = value.replace(/-/g, "");
  if (!/^\d{8}$/.test(cleaned)) {
    return { valid: false, normalized: cleaned, error: "FI Y-tunnus must be 7 digits + check digit" };
  }

  const weights = [7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(cleaned[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  if (remainder === 1) {
    return { valid: false, normalized: cleaned, error: "FI Y-tunnus checksum invalid" };
  }
  const checkDigit = remainder === 0 ? 0 : 11 - remainder;

  if (parseInt(cleaned[7], 10) !== checkDigit) {
    return { valid: false, normalized: cleaned, error: "FI Y-tunnus checksum failed" };
  }

  return { valid: true, normalized: cleaned };
}

// === Poland — NIP with checksum ===

export function validatePL(digits: string): ValidatorResult {
  if (!/^\d{10}$/.test(digits)) {
    return { valid: false, normalized: digits, error: "PL NIP must be 10 digits" };
  }

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const checkDigit = sum % 11;

  if (checkDigit === 10 || parseInt(digits[9], 10) !== checkDigit) {
    return { valid: false, normalized: digits, error: "PL NIP checksum failed" };
  }

  return { valid: true, normalized: digits };
}

// === Czech Republic — IČO 8 digits with checksum ===

export function validateCZ(digits: string): ValidatorResult {
  if (!/^\d{8}$/.test(digits)) {
    if (/^\d{8,10}$/.test(digits)) {
      return { valid: true, normalized: digits };
    }
    return { valid: false, normalized: digits, error: "CZ IČO must be 8 digits" };
  }

  const weights = [8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  let checkDigit: number;
  if (remainder === 0) checkDigit = 1;
  else if (remainder === 1) checkDigit = 0;
  else checkDigit = 11 - remainder;

  if (parseInt(digits[7], 10) !== checkDigit) {
    return { valid: false, normalized: digits, error: "CZ IČO checksum failed" };
  }

  return { valid: true, normalized: digits };
}

// === Switzerland — UID (Modulo 11) ===

export function validateCH(digits: string): ValidatorResult {
  // Swiss UID: 9 digits, last is check digit
  // Format: CHE-XXX.XXX.XXX or just 9 digits
  const cleaned = digits.replace(/[^0-9]/g, "");
  if (!/^\d{9}$/.test(cleaned)) {
    return { valid: false, normalized: cleaned, error: "CH UID must be 9 digits" };
  }

  const weights = [5, 4, 3, 2, 7, 6, 5, 4];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  if (remainder === 10) {
    return { valid: false, normalized: cleaned, error: "CH UID checksum invalid" };
  }
  const checkDigit = remainder === 0 ? 0 : 11 - remainder;

  if (parseInt(cleaned[8], 10) !== checkDigit) {
    return { valid: false, normalized: cleaned, error: "CH UID checksum failed" };
  }

  return { valid: true, normalized: cleaned };
}
