import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Profil & Informasi" />
      <View style={styles.card}>
        <Text style={styles.title}>PPNP Lab Equipment</Text>
        <Text style={styles.row}>Sistem Inventaris Laboratorium</Text>
        <Text style={styles.row}>Versi 1.0.0</Text>
        <Text style={styles.row}>Dibuat untuk praktikum Workshop Pemrograman Mobile</Text>
        <Text style={styles.row}>Program Studi Teknologi Rekayasa Komputer</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Fitur</Text>
        <Text style={styles.row}>• CRUD Kategori & Laboratorium</Text>
        <Text style={styles.row}>• CRUD Inventaris Alat</Text>
        <Text style={styles.row}>• Peminjaman & Pengembalian</Text>
        <Text style={styles.row}>• Riwayat Perubahan Kondisi</Text>
        <Text style={styles.row}>• Dashboard & Laporan</Text>
        <Text style={styles.row}>• Pencarian & Filter</Text>
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
