// Skema database SQLite untuk PPNP Lab Equipment

export const CREATE_TABLES_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'cube-outline',
  description TEXT
);

CREATE TABLE IF NOT EXISTS laboratories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  person_in_charge TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS equipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  laboratory_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('Baik','Rusak','Perlu Perbaikan')),
  photo_uri TEXT,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (laboratory_id) REFERENCES laboratories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS borrowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  borrower_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrow_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  return_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('Dipinjam','Dikembalikan','Terlambat')),
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS condition_histories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  previous_condition TEXT NOT NULL CHECK (previous_condition IN ('Baik','Rusak','Perlu Perbaikan')),
  new_condition TEXT NOT NULL CHECK (new_condition IN ('Baik','Rusak','Perlu Perbaikan')),
  change_date TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE RESTRICT
);
`;
