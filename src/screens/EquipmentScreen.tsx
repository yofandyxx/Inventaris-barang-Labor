import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getAllEquipments, searchEquipments, deleteEquipment } from '../services/equipmentService';
import { getAllCategories } from '../services/categoryService';
import { getAllLaboratories } from '../services/laboratoryService';
import { Equipment, Category, Laboratory, Condition } from '../types';
import EquipmentCard from '../components/EquipmentCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';

export default function EquipmentScreen({ navigation }: any) {
  const [items, setItems] = useState<Equipment[]>([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [laboratoryId, setLaboratoryId] = useState<number | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [toDelete, setToDelete] = useState<Equipment | null>(null);

  const load = useCallback(async () => {
    const data = await searchEquipments(query, categoryId, laboratoryId, condition);
    setItems(data);
  }, [query, categoryId, laboratoryId, condition]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => {
    load();
    getAllCategories().then(setCategories);
    getAllLaboratories().then(setLabs);
  }, [load]));

  const confirmDelete = async () => {
    if (toDelete) {
      try { await deleteEquipment(toDelete.id); } catch (e) { alert((e as Error).message); }
      setToDelete(null);
      load();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Inventaris Alat" />
      <View style={styles.searchRow}>
        <TextInput style={styles.search} placeholder="Cari nama/kode..." value={query} onChangeText={setQuery} />
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setCategoryId(null)}><Text style={styles.filterText}>Semua Kategori</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setLaboratoryId(null)}><Text style={styles.filterText}>Semua Lab</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setCondition(null)}><Text style={styles.filterText}>Semua Kondisi</Text></TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <EquipmentCard
            item={item}
            onPress={() => navigation.navigate('EquipmentDetail', { id: item.id })}
            onEdit={() => navigation.navigate('EquipmentForm', { id: item.id })}
            onDelete={() => setToDelete(item)}
          />
        )}
        ListEmptyComponent={<EmptyState message="Belum ada data alat" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EquipmentForm', {})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <ConfirmDialog visible={!!toDelete} title="Hapus Alat" message="Yakin hapus alat ini?" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: { padding: SPACING.md },
  search: { backgroundColor: COLORS.card, borderRadius: 8, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.xs, flexWrap: 'wrap' },
  filterBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: 6 },
  filterText: { color: COLORS.white, fontSize: 12 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.accent, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
});
