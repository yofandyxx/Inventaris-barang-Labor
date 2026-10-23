import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getAllCategories, deleteCategory } from '../services/categoryService';
import { Category } from '../types';
import CategoryCard from '../components/CategoryCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';

export default function CategoryScreen({ navigation }: any) {
  const [items, setItems] = useState<Category[]>([]);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const load = useCallback(async () => setItems(await getAllCategories()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const confirmDelete = async () => {
    if (toDelete) {
      try { await deleteCategory(toDelete.id); } catch (e) { alert((e as Error).message); }
      setToDelete(null);
      load();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Kategori Alat" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <CategoryCard item={item} onEdit={() => navigation.navigate('CategoryForm', { id: item.id })} onDelete={() => setToDelete(item)} />
        )}
        ListEmptyComponent={<EmptyState message="Belum ada kategori" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CategoryForm', {})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <ConfirmDialog visible={!!toDelete} title="Hapus Kategori" message="Yakin hapus kategori ini?" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.accent, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
});
