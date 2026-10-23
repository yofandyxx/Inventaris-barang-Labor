import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getAllLaboratories, deleteLaboratory } from '../services/laboratoryService';
import { Laboratory } from '../types';
import LaboratoryCard from '../components/LaboratoryCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../constants/theme';

export default function LaboratoryScreen({ navigation }: any) {
  const [items, setItems] = useState<Laboratory[]>([]);
  const [toDelete, setToDelete] = useState<Laboratory | null>(null);

  const load = useCallback(async () => setItems(await getAllLaboratories()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const confirmDelete = async () => {
    if (toDelete) {
      try { await deleteLaboratory(toDelete.id); } catch (e) { alert((e as Error).message); }
      setToDelete(null);
      load();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Laboratorium" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <LaboratoryCard item={item} onEdit={() => navigation.navigate('LaboratoryForm', { id: item.id })} onDelete={() => setToDelete(item)} />
        )}
        ListEmptyComponent={<EmptyState message="Belum ada laboratorium" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('LaboratoryForm', {})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <ConfirmDialog visible={!!toDelete} title="Hapus Laboratorium" message="Yakin hapus laboratorium ini?" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.accent, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
});
