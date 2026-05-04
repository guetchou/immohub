export function generateNimt(cityCode: string, year: number, sequence: number): string {
  return `CG-${cityCode.toUpperCase().slice(0, 3)}-MT-${year}-${String(sequence).padStart(6, '0')}`;
}

export function parseNimt(nimt: string): { country: string; city: string; year: number; sequence: number } | null {
  const match = nimt.match(/^([A-Z]{2})-([A-Z]{3})-MT-(\d{4})-(\d{6})$/);
  if (!match) return null;
  return {
    country: match[1],
    city: match[2],
    year: parseInt(match[3]),
    sequence: parseInt(match[4]),
  };
}

export function isValidNimt(nimt: string): boolean {
  return parseNimt(nimt) !== null;
}
