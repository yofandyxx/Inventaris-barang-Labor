export function isRequired(value: string | null | undefined): boolean {
  return !!value && value.trim().length > 0;
}

export function isNonNegativeNumber(value: string): boolean {
  const n = Number(value);
  return !isNaN(n) && n >= 0;
}

export function isPositiveNumber(value: string): boolean {
  const n = Number(value);
  return !isNaN(n) && n > 0;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
