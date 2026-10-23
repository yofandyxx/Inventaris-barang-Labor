import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDashboardStats, getEquipmentByCategory, getEquipmentByLaboratory } from '../services/reportService';
import { getConditionHistories } from '../services/conditionService';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';

export default function ReportScreen() {
  const [stats, setStats] = useState<any>(null);
  const [byCat, setByCat] = useState<any[]>([]);
  const [byLab, setByLab] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setStats(await getDashboardStats());
      setByCat(await getEquipmentByCategory());
      setByLab(await getEquipmentByLaboratory());
      setHistories(await getConditionHistories());
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Laporan Inventaris" />
      {stats && (
        <View style={styles.card}>
          <Text style={styles.title}>Ringkasan</Text>
          <Text style={styles.row}>Total Jenis Alat: {stats.totalEquipmentTypes}</Text>
          <Text style={styles.row}>Total Unit: {stats.totalEquipmentUnits}</Text>
          <Text style={styles.row}>Kategori: {stats.totalCategories}</Text>
          <Text style={styles.row}>Laboratorium: {stats.totalLaboratories}</Text>
          <Text style={styles.row}>Baik: {stats.goodCount} | Rusak: {stats.damagedCount} | Perlu Perbaikan: {stats.repairCount}</Text>
          <Text style={styles.row}>Peminjaman Aktif: {stats.activeBorrowings} | Terlambat: {stats.lateBorrowings}</Text>
          <Text style={styles.row}>Unit Tersedia: {stats.availableUnits}</Text>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.title}>Rekap per Kategori</Text>
        {byCat.map((c, i) => <Text key={i} style={styles.row}>{c.name}: {c.count}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Rekap per Laboratorium</Text>
        {byLab.map((l, i) => <Text key={i} style={styles.row}>{l.name}: {l.count}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Riwayat Perubahan Kondisi</Text>
        {histories.map((h, i) => <Text key={i} style={styles.row}>{h.equipment_name}: {h.previous_condition} → {h.new_condition}</Text>)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: { backgroundColor: COLORS.card, margin: SPACING.md, padding: SPACING.lg, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  row: { fontSize: 14, color: COLORS.text, marginTop: 2 },
});
