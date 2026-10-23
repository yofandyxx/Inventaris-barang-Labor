import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getAllBorrowings } from '../services/borrowingService';
import { Borrowing } from '../types';
import BorrowingCard from '../components/BorrowingCard';
import EmptyState from '../components/EmptyState';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../constants/theme';

export default function BorrowingScreen({ navigation }: any) {
  const [items, setItems] = useState<Borrowing[]>([]);

  const load = useCallback(async () => setItems(await getAllBorrowings()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.container}>
      <AppHeader title="Peminjaman Alat" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BorrowingDetail', { id: item.id })}>
            <BorrowingCard item={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState message="Belum ada peminjaman" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('BorrowingForm', {})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.accent, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
});
