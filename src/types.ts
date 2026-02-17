export interface ValidationResult {
  valid: boolean;
  country: string | null;
  normalized: string;
  checksum_verified: boolean;
  error?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  local_name: string;
  tax_id_name: string;
  eu_member: boolean;
  has_checksum: boolean;
  format_description: string;
}
