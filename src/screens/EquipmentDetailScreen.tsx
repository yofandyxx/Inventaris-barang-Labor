import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getEquipmentById } from '../services/equipmentService';
import { getBorrowedQuantity } from '../services/equipmentService';
import { getConditionHistories } from '../services/conditionService';
import { Equipment, ConditionHistory } from '../types';
import AppHeader from '../components/AppHeader';
import ConditionBadge from '../components/ConditionBadge';
import { COLORS, SPACING } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

export default function EquipmentDetailScreen({ route, navigation }: any) {
  const id = route.params.id;
  const [item, setItem] = useState<Equipment | null>(null);
  const [borrowed, setBorrowed] = useState(0);
  const [histories, setHistories] = useState<ConditionHistory[]>([]);

  const load = async () => {
    const e = await getEquipmentById(id);
    setItem(e);
    if (e) {
      const b = await getBorrowedQuantity(e.id);
      setBorrowed(b);
      const h = await getConditionHistories(e.id);
      setHistories(h);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (!item) return <View style={styles.center}><Text>Memuat...</Text></View>;

  const available = item.quantity - borrowed;

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Detail Alat" />
      <View style={styles.card}>
        {item.photo_uri ? <Image source={{ uri: item.photo_uri }} style={styles.photo} /> : null}
        <Text style={styles.code}>{item.inventory_code}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.row}>Kategori: {item.category_name}</Text>
        <Text style={styles.row}>Laboratorium: {item.laboratory_name}</Text>
        <Text style={styles.row}>Jumlah Total: {item.quantity}</Text>
        <Text style={styles.row}>Sedang Dipinjam: {borrowed}</Text>
        <Text style={styles.row}>Tersedia: {available}</Text>
        <View style={styles.rowInline}>
          <Text style={styles.row}>Kondisi: </Text>
          <ConditionBadge condition={item.condition} />
        </View>
        {item.description ? <Text style={styles.row}>Deskripsi: {item.description}</Text> : null}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ConditionForm', { equipmentId: item.id })}>
        <Text style={styles.btnText}>Ubah Kondisi</Text>
      </TouchableOpacity>
      <Text style={styles.section}>Riwayat Perubahan Kondisi</Text>
      {histories.length === 0 ? <Text style={styles.empty}>Belum ada riwayat</Text> : histories.map((h) => (
        <View key={h.id} style={styles.hist}>
          <Text style={styles.histText}>{formatDate(h.change_date)}: {h.previous_condition} → {h.new_condition}</Text>
          {h.notes ? <Text style={styles.histNote}>{h.notes}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: COLORS.card, margin: SPACING.md, padding: SPACING.lg, borderRadius: 10 },
  code: { color: COLORS.accent, fontWeight: '600', fontSize: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  row: { fontSize: 14, color: COLORS.text, marginTop: 4 },
  rowInline: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  btn: { backgroundColor: COLORS.orange, margin: SPACING.md, padding: SPACING.md, borderRadius: 8, alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: 'bold' },
  section: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, margin: SPACING.md },
  empty: { color: COLORS.textLight, marginHorizontal: SPACING.md },
  hist: { backgroundColor: COLORS.card, marginHorizontal: SPACING.md, marginBottom: SPACING.xs, padding: SPACING.sm, borderRadius: 6 },
  histText: { fontSize: 13, color: COLORS.text },
  histNote: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  photo: { width: '100%', height: 220, borderRadius: 8, marginBottom: SPACING.md, resizeMode: 'cover' },
});
