import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAllEquipments } from '../services/equipmentService';
import { createBorrowing } from '../services/borrowingService';
import { getAvailableQuantity } from '../services/equipmentService';
import { Equipment } from '../types';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { isRequired, isPositiveNumber, isValidDate } from '../utils/validation';
import { todayISO } from '../utils/dateUtils';

export default function BorrowingFormScreen({ navigation }: any) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [equipmentId, setEquipmentId] = useState<number | null>(null);
  const [borrower, setBorrower] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [borrowDate, setBorrowDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(todayISO());
  const [notes, setNotes] = useState('');

  useEffect(() => { getAllEquipments().then(setEquipments); }, []);

  const save = async () => {
    if (!equipmentId || !isRequired(borrower)) { Alert.alert('Validasi', 'Lengkapi data.'); return; }
    if (!isPositiveNumber(quantity)) { Alert.alert('Validasi', 'Jumlah tidak valid.'); return; }
    if (!isValidDate(borrowDate) || !isValidDate(dueDate) || dueDate < borrowDate) { Alert.alert('Validasi', 'Tanggal tidak valid atau tanggal kembali lebih awal dari tanggal pinjam.'); return; }
    const eq = equipments.find((e: Equipment) => e.id === equipmentId)!;
    const available = await getAvailableQuantity(eq.id, eq.quantity);
    if (Number(quantity) > available) { Alert.alert('Validasi', 'Jumlah melebihi stok tersedia.'); return; }
    try {
      await createBorrowing({
        equipment_id: equipmentId,
        borrower_name: borrower.trim(),
        quantity: Number(quantity),
        borrow_date: borrowDate,
        due_date: dueDate,
        notes: notes.trim() || null,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Gagal menyimpan', (e as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Tambah Peminjaman" />
      <View style={styles.form}>
        <Text style={styles.label}>Alat *</Text>
        <View style={styles.row}>
          {equipments.map((e) => (
            <TouchableOpacity key={e.id} style={[styles.chip, equipmentId === e.id && styles.chipActive]} onPress={() => setEquipmentId(e.id)}>
              <Text style={styles.chipText}>{e.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Nama Peminjam *</Text>
        <TextInput style={styles.input} value={borrower} onChangeText={setBorrower} />
        <Text style={styles.label}>Jumlah *</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        <Text style={styles.label}>Tanggal Pinjam *</Text>
        <TextInput style={styles.input} value={borrowDate} onChangeText={setBorrowDate} />
        <Text style={styles.label}>Tanggal Rencana Kembali *</Text>
        <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />
        <Text style={styles.label}>Catatan</Text>
        <TextInput style={styles.input} value={notes} onChangeText={setNotes} multiline />
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: SPACING.lg },
  label: { fontSize: 13, color: COLORS.text, marginTop: SPACING.sm, marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: COLORS.card, borderRadius: 8, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { backgroundColor: COLORS.border, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: 6, marginVertical: 2 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.text, fontSize: 12 },
  saveBtn: { backgroundColor: COLORS.green, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginTop: SPACING.lg },
  saveText: { color: COLORS.white, fontWeight: 'bold' },
});
