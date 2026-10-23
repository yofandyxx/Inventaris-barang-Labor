import { getBorrowedQuantity } from '../services/equipmentService';

export async function getAvailable(equipmentId: number, totalQuantity: number): Promise<number> {
  const borrowed = await getBorrowedQuantity(equipmentId);
  return totalQuantity - borrowed;
}
