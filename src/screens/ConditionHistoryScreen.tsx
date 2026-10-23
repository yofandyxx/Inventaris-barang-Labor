import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { getConditionHistories } from '../services/conditionService';
import { ConditionHistory } from '../types';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

export default function ConditionHistoryScreen() {
  const [items, setItems] = useState<ConditionHistory[]>([]);

  useEffect(() => { getConditionHistories().then(setItems); }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Riwayat Kondisi" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.equipment_name}</Text>
            <Text style={styles.row}>{formatDate(item.change_date)}: {item.previous_condition} → {item.new_condition}</Text>
            {item.notes ? <Text style={styles.note}>{item.notes}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada riwayat</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: { backgroundColor: COLORS.card, margin: SPACING.sm, padding: SPACING.md, borderRadius: 8 },
  name: { fontWeight: 'bold', color: COLORS.text },
  row: { color: COLORS.text, marginTop: 4 },
  note: { color: COLORS.textLight, fontSize: 12, marginTop: 2 },
  empty: { textAlign: 'center', color: COLORS.textLight, marginTop: 20 },
});
