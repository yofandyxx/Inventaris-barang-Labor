import { getDatabase } from '../database/database';
import { Category } from '../types';

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name ASC');
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

export async function createCategory(name: string, icon: string, description: string | null): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)',
    [name, icon, description]
  );
  return result.lastInsertRowId;
}

export async function updateCategory(id: number, name: string, icon: string, description: string | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE categories SET name = ?, icon = ?, description = ? WHERE id = ?',
    [name, icon, description, id]
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDatabase();
  // cek apakah masih digunakan
  const used = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM equipments WHERE category_id = ?',
    [id]
  );
  if (used && used.c > 0) {
    throw new Error('Kategori masih digunakan oleh data alat, tidak dapat dihapus.');
  }
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}

export async function isCategoryNameDuplicate(name: string, excludeId?: number): Promise<boolean> {
  const db = await getDatabase();
  const row = excludeId
    ? await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM categories WHERE name = ? AND id != ?', [name, excludeId])
    : await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM categories WHERE name = ?', [name]);
  return !!row && row.c > 0;
}
