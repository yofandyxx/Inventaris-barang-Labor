import { getDatabase } from '../database/database';
import { Borrowing, BorrowingStatus } from '../types';

const JOIN_SQL = `
SELECT b.*, e.name AS equipment_name, e.inventory_code
FROM borrowings b
LEFT JOIN equipments e ON b.equipment_id = e.id
`;

export async function getAllBorrowings(): Promise<Borrowing[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Borrowing>(JOIN_SQL + ' ORDER BY b.borrow_date DESC');
  // update status terlambat
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return rows.map((r: Borrowing) => {
    if (r.status === 'Dipinjam' && r.due_date < today) {
      return { ...r, status: 'Terlambat' as BorrowingStatus };
    }
    return r;
  });
}

export async function getBorrowingById(id: number): Promise<Borrowing | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Borrowing>(JOIN_SQL + ' WHERE b.id = ?', [id]);
  if (!row || row.status === 'Dikembalikan') return row;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return row.due_date < today ? { ...row, status: 'Terlambat' as BorrowingStatus } : row;
}

export async function getBorrowingsByEquipment(equipmentId: number): Promise<Borrowing[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Borrowing>(JOIN_SQL + ' WHERE b.equipment_id = ? ORDER BY b.borrow_date DESC', [equipmentId]);
}

export async function createBorrowing(data: {
  equipment_id: number;
  borrower_name: string;
  quantity: number;
  borrow_date: string;
  due_date: string;
  notes: string | null;
}): Promise<number> {
  const db = await getDatabase();
  let insertedId = 0;
  await db.withTransactionAsync(async () => {
    const equipment = await db.getFirstAsync<{ quantity: number }>(
      'SELECT quantity FROM equipments WHERE id = ?', [data.equipment_id]
    );
    if (!equipment) throw new Error('Alat tidak ditemukan.');
    const borrowed = await db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(quantity), 0) AS total FROM borrowings WHERE equipment_id = ? AND status != 'Dikembalikan'",
      [data.equipment_id]
    );
    if (data.quantity > equipment.quantity - (borrowed?.total ?? 0)) {
      throw new Error('Jumlah melebihi stok tersedia.');
    }
    const result = await db.runAsync(
      `INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrow_date, due_date, return_date, status, notes)
       VALUES (?, ?, ?, ?, ?, NULL, 'Dipinjam', ?)`,
      [data.equipment_id, data.borrower_name, data.quantity, data.borrow_date, data.due_date, data.notes]
    );
    insertedId = result.lastInsertRowId;
  });
  return insertedId;
}

export async function returnBorrowing(id: number, returnDate: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE borrowings SET return_date = ?, status = 'Dikembalikan' WHERE id = ? AND status != 'Dikembalikan'",
    [returnDate, id]
  );
}

export async function isAlreadyReturned(id: number): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ status: string }>('SELECT status FROM borrowings WHERE id = ?', [id]);
  return row?.status === 'Dikembalikan';
}
