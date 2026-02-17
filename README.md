# eu-tax-id-validator

Validate European tax IDs (VAT numbers, NIF, CIF) with format checks and checksum verification. **Zero dependencies, < 5KB minified.**

Supports **30 countries**: 27 EU member states + United Kingdom, Norway, and Switzerland.

## Install

```bash
npm install eu-tax-id-validator
```

## Quick Start

```typescript
import { validateTaxId, detectCountry, formatVatNumber } from 'eu-tax-id-validator';

// Validate with checksum
validateTaxId('PT502011378');
// { valid: true, country: 'PT', normalized: 'PT502011378', checksum_verified: true }

// Auto-detect country
detectCountry('502011378');
// 'PT'

// Format for display
formatVatNumber('PT502011378');
// 'PT 502 011 378'
```

## API

### `validateTaxId(raw: string): ValidationResult`

Validates a tax ID / VAT number. Cleans input (removes spaces, dashes, dots), auto-detects country, and runs format + checksum validation.

```typescript
interface ValidationResult {
  valid: boolean;
  country: string | null;
  normalized: string;        // Cleaned, uppercase, with country prefix
  checksum_verified: boolean; // true if checksum algorithm verified
  error?: string;
}
```

### `detectCountry(taxId: string): string | null`

Detects country from a tax ID. Tries 2-letter prefix first, then format-based detection.

### `formatVatNumber(taxId: string, country?: string): string`

Formats a tax ID with country-specific grouping for display.

| Country | Input | Output |
|---------|-------|--------|
| PT | `PT502011378` | `PT 502 011 378` |
| DK | `DK10150817` | `DK 10 15 08 17` |
| GB | `GB123456789` | `GB 123 4567 89` |
| DE | `DE123456789` | `DE 123 456 789` |
| PL | `PL7740001454` | `PL 774-000-14-54` |
| FI | `FI01234562` | `FI 0123456-2` |
| CH | `CH105835786` | `CH 105.835.786` |

### `isEUMember(countryCode: string): boolean`

Returns `true` if the country is an EU member state.

### `COUNTRIES`

Object with metadata for all 30 supported countries:

```typescript
COUNTRIES['PT']
// { code: 'PT', name: 'Portugal', local_name: 'Portugal',
//   tax_id_name: 'NIF', eu_member: true, has_checksum: true,
//   format_description: '9 digits with Modulo 11' }
```

## Supported Countries

### Full checksum validation (7 countries)

| Country | Tax ID | Algorithm |
|---------|--------|-----------|
| PT Portugal | NIF | Modulo 11 |
| DK Denmark | CVR | Modulo 11 |
| NO Norway | Org.nr | Modulo 11 |
| FI Finland | Y-tunnus | Modulo 11 |
| PL Poland | NIP | Weighted checksum |
| CZ Czech Republic | IČO | Modulo 11 |
| CH Switzerland | UID | Modulo 11 |

### Format validation (23 countries)

AT, BE, BG, CY, DE, EE, EL (Greece), ES, FR, GB, HR, HU, IE, IT, LT, LU, LV, MT, NL, RO, SE, SI, SK

## Features

- **Zero dependencies** — pure TypeScript, no runtime deps
- **Dual format** — ESM and CommonJS
- **Tree-shakeable** — import only what you need
- **Tiny** — < 5KB minified
- **Type-safe** — full TypeScript types exported
- **30 countries** — 27 EU + UK, Norway, Switzerland
- **Checksum verification** — Modulo 11 and weighted checksums for 7 countries
- **Input cleaning** — handles spaces, dashes, dots, lowercase

## Going Beyond Validation

Need **live company data** — name, address, legal form, directors, VAT status?

**[VeriCorp API](https://rapidapi.com/vericorp/api/vericorp-api)** enriches tax IDs with real-time data from official registries across Europe. 8 countries with full enrichment, 27 with VAT validation.

```typescript
// Local validation (this package)
validateTaxId('PT502011378');
// { valid: true, country: 'PT', checksum_verified: true }

// Live enrichment (VeriCorp API)
// → name: "Nexperience Lda", status: "active", address: "...", legal_form: "Lda", ...
```

**[Get your free API key →](https://rapidapi.com/vericorp/api/vericorp-api)**

## License

MIT
