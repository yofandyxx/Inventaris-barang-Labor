import { getDatabase } from '../database/database';
import { Equipment, Condition } from '../types';

const JOIN_SQL = `
SELECT e.*, c.name AS category_name, c.icon AS category_icon, l.name AS laboratory_name
FROM equipments e
LEFT JOIN categories c ON e.category_id = c.id
LEFT JOIN laboratories l ON e.laboratory_id = l.id
`;

export async function getAllEquipments(): Promise<Equipment[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Equipment>(JOIN_SQL + ' ORDER BY e.name ASC');
}

export async function getEquipmentById(id: number): Promise<Equipment | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<Equipment>(JOIN_SQL + ' WHERE e.id = ?', [id]);
}

export async function searchEquipments(query: string, categoryId: number | null, laboratoryId: number | null, condition: Condition | null): Promise<Equipment[]> {
  const db = await getDatabase();
  let sql = JOIN_SQL + ' WHERE 1=1';
  const params: any[] = [];
  if (query.trim()) {
    sql += ' AND (e.name LIKE ? OR e.inventory_code LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }
  if (categoryId) {
    sql += ' AND e.category_id = ?';
    params.push(categoryId);
  }
  if (laboratoryId) {
    sql += ' AND e.laboratory_id = ?';
    params.push(laboratoryId);
  }
  if (condition) {
    sql += ' AND e.condition = ?';
    params.push(condition);
  }
  sql += ' ORDER BY e.name ASC';
  return await db.getAllAsync<Equipment>(sql, params);
}

export async function createEquipment(data: Omit<Equipment, 'id' | 'category_name' | 'category_icon' | 'laboratory_name'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO equipments (inventory_code, name, category_id, laboratory_id, quantity, condition, photo_uri, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.inventory_code, data.name, data.category_id, data.laboratory_id, data.quantity, data.condition, data.photo_uri, data.description]
  );
  return result.lastInsertRowId;
}

export async function updateEquipment(id: number, data: Omit<Equipment, 'id' | 'category_name' | 'category_icon' | 'laboratory_name'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE equipments SET inventory_code=?, name=?, category_id=?, laboratory_id=?, quantity=?, condition=?, photo_uri=?, description=? WHERE id=?`,
    [data.inventory_code, data.name, data.category_id, data.laboratory_id, data.quantity, data.condition, data.photo_uri, data.description, id]
  );
}

export async function deleteEquipment(id: number): Promise<void> {
  const db = await getDatabase();
  // cek peminjaman aktif
  const active = await db.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) as c FROM borrowings WHERE equipment_id = ? AND status != 'Dikembalikan'",
    [id]
  );
  if (active && active.c > 0) {
    throw new Error('Alat masih dipinjam, tidak dapat dihapus.');
  }
  // hapus riwayat kondisi dulu
  await db.runAsync('DELETE FROM condition_histories WHERE equipment_id = ?', [id]);
  await db.runAsync('DELETE FROM equipments WHERE id = ?', [id]);
}

export async function isInventoryCodeDuplicate(code: string, excludeId?: number): Promise<boolean> {
  const db = await getDatabase();
  const row = excludeId
    ? await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM equipments WHERE inventory_code = ? AND id != ?', [code, excludeId])
    : await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM equipments WHERE inventory_code = ?', [code]);
  return !!row && row.c > 0;
}

export async function getBorrowedQuantity(equipmentId: number): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ total: number | null }>(
    "SELECT COALESCE(SUM(quantity),0) as total FROM borrowings WHERE equipment_id = ? AND status != 'Dikembalikan'",
    [equipmentId]
  );
  return row?.total ?? 0;
}

export async function getAvailableQuantity(equipmentId: number, totalQuantity: number): Promise<number> {
  const borrowed = await getBorrowedQuantity(equipmentId);
  return totalQuantity - borrowed;
}
