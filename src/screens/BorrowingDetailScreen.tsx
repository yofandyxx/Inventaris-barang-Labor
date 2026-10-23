import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getBorrowingById, returnBorrowing, isAlreadyReturned } from '../services/borrowingService';
import { Borrowing } from '../types';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { formatDate, todayISO } from '../utils/dateUtils';

export default function BorrowingDetailScreen({ route, navigation }: any) {
  const id = route.params.id;
  const [item, setItem] = useState<Borrowing | null>(null);

  const load = async () => setItem(await getBorrowingById(id));
  useEffect(() => { load(); }, [id]);

  const handleReturn = async () => {
    if (await isAlreadyReturned(id)) { Alert.alert('Info', 'Sudah dikembalikan.'); return; }
    await returnBorrowing(id, todayISO());
    Alert.alert('Sukses', 'Alat dikembalikan.');
    load();
  };

  if (!item) return <View style={styles.center}><Text>Memuat...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Detail Peminjaman" />
      <View style={styles.card}>
        <Text style={styles.row}>Peminjam: {item.borrower_name}</Text>
        <Text style={styles.row}>Alat: {item.equipment_name} ({item.inventory_code})</Text>
        <Text style={styles.row}>Jumlah: {item.quantity}</Text>
        <Text style={styles.row}>Tanggal Pinjam: {formatDate(item.borrow_date)}</Text>
        <Text style={styles.row}>Rencana Kembali: {formatDate(item.due_date)}</Text>
        <Text style={styles.row}>Pengembalian: {formatDate(item.return_date)}</Text>
        <Text style={styles.row}>Status: {item.status}</Text>
        {item.notes ? <Text style={styles.row}>Catatan: {item.notes}</Text> : null}
      </View>
      {item.status !== 'Dikembalikan' && (
        <TouchableOpacity style={styles.btn} onPress={handleReturn}>
          <Text style={styles.btnText}>Kembalikan Alat</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: COLORS.card, margin: SPACING.md, padding: SPACING.lg, borderRadius: 10 },
  row: { fontSize: 14, color: COLORS.text, marginTop: 4 },
  btn: { backgroundColor: COLORS.green, margin: SPACING.md, padding: SPACING.md, borderRadius: 8, alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: 'bold' },
});
