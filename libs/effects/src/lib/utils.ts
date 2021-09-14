export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
