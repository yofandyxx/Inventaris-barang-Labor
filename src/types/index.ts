// Tipe data untuk aplikasi PPNP Lab Equipment

export type Condition = 'Baik' | 'Rusak' | 'Perlu Perbaikan';

export type BorrowingStatus = 'Dipinjam' | 'Dikembalikan' | 'Terlambat';

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string | null;
}

export interface Laboratory {
  id: number;
  name: string;
  location: string;
  person_in_charge: string;
  description: string | null;
}

export interface Equipment {
  id: number;
  inventory_code: string;
  name: string;
  category_id: number;
  laboratory_id: number;
  quantity: number;
  condition: Condition;
  photo_uri: string | null;
  description: string | null;
  // joined
  category_name?: string;
  category_icon?: string;
  laboratory_name?: string;
}

export interface Borrowing {
  id: number;
  equipment_id: number;
  borrower_name: string;
  quantity: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: BorrowingStatus;
  notes: string | null;
  // joined
  equipment_name?: string;
  inventory_code?: string;
}

export interface ConditionHistory {
  id: number;
  equipment_id: number;
  previous_condition: Condition;
  new_condition: Condition;
  change_date: string;
  notes: string | null;
  // joined
  equipment_name?: string;
}

export interface DashboardStats {
  totalEquipmentTypes: number;
  totalEquipmentUnits: number;
  totalCategories: number;
  totalLaboratories: number;
  goodCount: number;
  damagedCount: number;
  repairCount: number;
  activeBorrowings: number;
  lateBorrowings: number;
  availableUnits: number;
}

export interface ReportFilter {
  laboratoryId: number | null;
  categoryId: number | null;
  condition: Condition | null;
}
