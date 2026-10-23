import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT, STATUS_COLORS } from '../constants/theme';
import { Borrowing } from '../types';
import { formatDate } from '../utils/dateUtils';

interface Props {
  item: Borrowing;
}

export default function BorrowingCard({ item }: Props) {
  const statusColor = STATUS_COLORS[item.status] || COLORS.textLight;
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.borrower_name}</Text>
      <Text style={styles.sub}>{item.equipment_name} ({item.inventory_code})</Text>
      <Text style={styles.sub}>Jumlah: {item.quantity}</Text>
      <Text style={styles.sub}>Pinjam: {formatDate(item.borrow_date)} • Kembali: {formatDate(item.due_date)}</Text>
      {item.return_date ? <Text style={styles.sub}>Dikembalikan: {formatDate(item.return_date)}</Text> : null}
      <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginVertical: SPACING.xs, marginHorizontal: SPACING.md },
  name: { fontSize: FONT.body, fontWeight: 'bold', color: COLORS.text },
  sub: { fontSize: FONT.small, color: COLORS.textLight, marginTop: 2 },
  status: { fontSize: FONT.small, fontWeight: 'bold', marginTop: 4 },
});
