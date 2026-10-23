import { getDatabase } from '../database/database';
import { Laboratory } from '../types';

export async function getAllLaboratories(): Promise<Laboratory[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Laboratory>('SELECT * FROM laboratories ORDER BY name ASC');
}

export async function getLaboratoryById(id: number): Promise<Laboratory | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<Laboratory>('SELECT * FROM laboratories WHERE id = ?', [id]);
}

export async function createLaboratory(name: string, location: string, personInCharge: string, description: string | null): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO laboratories (name, location, person_in_charge, description) VALUES (?, ?, ?, ?)',
    [name, location, personInCharge, description]
  );
  return result.lastInsertRowId;
}

export async function updateLaboratory(id: number, name: string, location: string, personInCharge: string, description: string | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE laboratories SET name = ?, location = ?, person_in_charge = ?, description = ? WHERE id = ?',
    [name, location, personInCharge, description, id]
  );
}

export async function deleteLaboratory(id: number): Promise<void> {
  const db = await getDatabase();
  const used = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM equipments WHERE laboratory_id = ?',
    [id]
  );
  if (used && used.c > 0) {
    throw new Error('Laboratorium masih memiliki alat, tidak dapat dihapus.');
  }
  await db.runAsync('DELETE FROM laboratories WHERE id = ?', [id]);
}

export async function isLaboratoryNameDuplicate(name: string, excludeId?: number): Promise<boolean> {
  const db = await getDatabase();
  const row = excludeId
    ? await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM laboratories WHERE name = ? AND id != ?', [name, excludeId])
    : await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM laboratories WHERE name = ?', [name]);
  return !!row && row.c > 0;
}
