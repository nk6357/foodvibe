// eslint-disable-next-line no-control-regex -- intentional control character detection
const controlCharsPattern = /[\u0000-\u001F\u007F]/;

export function containsControlCharacters(value: string): boolean {
  return controlCharsPattern.test(value);
}

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLowerCase().trim();
}
