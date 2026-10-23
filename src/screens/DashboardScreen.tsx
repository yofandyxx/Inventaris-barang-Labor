import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDashboardStats } from '../services/reportService';
import { DashboardStats } from '../types';
import AppHeader from '../components/AppHeader';
import StatCard from '../components/StatCard';
import { COLORS, SPACING } from '../constants/theme';

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const load = async () => {
    const s = await getDashboardStats();
    setStats(s);
  };

  useEffect(() => {
    load();
  }, []);

  if (!stats) return <View style={styles.center}><Text>Memuat...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Dashboard" subtitle="PPNP Lab Equipment" />
      <View style={styles.grid}>
        <StatCard title="Jenis Alat" value={stats.totalEquipmentTypes} color={COLORS.primary} />
        <StatCard title="Total Unit" value={stats.totalEquipmentUnits} color={COLORS.accent} />
        <StatCard title="Kategori" value={stats.totalCategories} color={COLORS.purple} />
        <StatCard title="Laboratorium" value={stats.totalLaboratories} color={COLORS.green} />
        <StatCard title="Kondisi Baik" value={stats.goodCount} color={COLORS.green} />
        <StatCard title="Rusak" value={stats.damagedCount} color={COLORS.red} />
        <StatCard title="Perlu Perbaikan" value={stats.repairCount} color={COLORS.orange} />
        <StatCard title="Peminjaman Aktif" value={stats.activeBorrowings} color={COLORS.orange} />
        <StatCard title="Terlambat" value={stats.lateBorrowings} color={COLORS.red} />
        <StatCard title="Unit Tersedia" value={stats.availableUnits} color={COLORS.green} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.sm },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
