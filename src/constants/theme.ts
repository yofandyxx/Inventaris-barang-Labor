// Konstanta tema warna aplikasi PPNP Lab Equipment

export const COLORS = {
  primary: '#1e3a8a',
  primaryLight: '#2563eb',
  accent: '#06b6d4',
  purple: '#8b5cf6',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
  background: '#f1f5f9',
  card: '#ffffff',
  text: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0',
  white: '#ffffff',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
};

export const FONT = {
  title: 22,
  subtitle: 18,
  body: 14,
  small: 12,
};

export const CONDITION_COLORS: Record<string, string> = {
  Baik: COLORS.green,
  Rusak: COLORS.red,
  'Perlu Perbaikan': COLORS.orange,
};

export const STATUS_COLORS: Record<string, string> = {
  Dipinjam: COLORS.orange,
  Dikembalikan: COLORS.green,
  Terlambat: COLORS.red,
};
