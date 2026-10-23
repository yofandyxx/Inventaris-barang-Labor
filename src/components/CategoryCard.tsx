import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { Category } from '../types';

interface Props {
  item: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryCard({ item, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>{item.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.btn}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.btn, { backgroundColor: COLORS.red }]}><Text style={styles.btnText}>Hapus</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginVertical: SPACING.xs, marginHorizontal: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 28, marginRight: SPACING.md },
  info: { flex: 1 },
  name: { fontSize: FONT.body, fontWeight: 'bold', color: COLORS.text },
  desc: { fontSize: FONT.small, color: COLORS.textLight, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.sm, gap: SPACING.sm },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm },
  btnText: { color: COLORS.white, fontSize: FONT.small, fontWeight: '600' },
});
