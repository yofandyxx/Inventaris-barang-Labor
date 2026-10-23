import { getDatabase } from '../database/database';
import { ConditionHistory, Condition } from '../types';

const JOIN_SQL = `
SELECT ch.*, e.name AS equipment_name
FROM condition_histories ch
LEFT JOIN equipments e ON ch.equipment_id = e.id
`;

export async function getConditionHistories(equipmentId?: number): Promise<ConditionHistory[]> {
  const db = await getDatabase();
  if (equipmentId) {
    return await db.getAllAsync<ConditionHistory>(JOIN_SQL + ' WHERE ch.equipment_id = ? ORDER BY ch.change_date DESC', [equipmentId]);
  }
  return await db.getAllAsync<ConditionHistory>(JOIN_SQL + ' ORDER BY ch.change_date DESC');
}

export async function changeCondition(equipmentId: number, newCondition: Condition, notes: string | null): Promise<void> {
  const db = await getDatabase();
  // ambil kondisi sebelumnya
  const eq = await db.getFirstAsync<{ condition: Condition }>('SELECT condition FROM equipments WHERE id = ?', [equipmentId]);
  if (!eq) throw new Error('Alat tidak ditemukan.');
  const previous = eq.condition;
  if (previous === newCondition) {
    throw new Error('Kondisi baru sama dengan kondisi sebelumnya.');
  }
  const today = new Date().toISOString().slice(0, 10);
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE equipments SET condition = ? WHERE id = ?', [newCondition, equipmentId]);
    await db.runAsync(
      'INSERT INTO condition_histories (equipment_id, previous_condition, new_condition, change_date, notes) VALUES (?, ?, ?, ?, ?)',
      [equipmentId, previous, newCondition, today, notes]
    );
  });
}
