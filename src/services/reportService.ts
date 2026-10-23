import { getDatabase } from '../database/database';
import { DashboardStats } from '../types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDatabase();
  const totalTypes = (await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM equipments'))?.c ?? 0;
  const totalUnits = (await db.getFirstAsync<{ s: number | null }>('SELECT COALESCE(SUM(quantity),0) as s FROM equipments'))?.s ?? 0;
  const totalCategories = (await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM categories'))?.c ?? 0;
  const totalLabs = (await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM laboratories'))?.c ?? 0;
  const good = (await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM equipments WHERE condition='Baik'"))?.c ?? 0;
  const damaged = (await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM equipments WHERE condition='Rusak'"))?.c ?? 0;
  const repair = (await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM equipments WHERE condition='Perlu Perbaikan'"))?.c ?? 0;
  const active = (await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM borrowings WHERE status != 'Dikembalikan'"))?.c ?? 0;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const late = (await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) as c FROM borrowings WHERE status != 'Dikembalikan' AND due_date < ?", [today]))?.c ?? 0;
  // borrowed units
  const borrowedUnits = (await db.getFirstAsync<{ s: number | null }>("SELECT COALESCE(SUM(quantity),0) as s FROM borrowings WHERE status != 'Dikembalikan'"))?.s ?? 0;
  const available = totalUnits - borrowedUnits;
  return {
    totalEquipmentTypes: totalTypes,
    totalEquipmentUnits: totalUnits,
    totalCategories,
    totalLaboratories: totalLabs,
    goodCount: good,
    damagedCount: damaged,
    repairCount: repair,
    activeBorrowings: active,
    lateBorrowings: late,
    availableUnits: available,
  };
}

export async function getEquipmentByCategory(): Promise<{ name: string; count: number }[]> {
  const db = await getDatabase();
  return await db.getAllAsync<{ name: string; count: number }>(
    `SELECT c.name, COUNT(e.id) as count FROM categories c LEFT JOIN equipments e ON e.category_id = c.id GROUP BY c.id ORDER BY count DESC`
  );
}

export async function getEquipmentByLaboratory(): Promise<{ name: string; count: number }[]> {
  const db = await getDatabase();
  return await db.getAllAsync<{ name: string; count: number }>(
    `SELECT l.name, COUNT(e.id) as count FROM laboratories l LEFT JOIN equipments e ON e.laboratory_id = l.id GROUP BY l.id ORDER BY count DESC`
  );
}
