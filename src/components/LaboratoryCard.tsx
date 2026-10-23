import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { Laboratory } from '../types';

interface Props {
  item: Laboratory;
  onEdit: () => void;
  onDelete: () => void;
}

export default function LaboratoryCard({ item, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.sub}>Lokasi: {item.location}</Text>
      <Text style={styles.sub}>PJ: {item.person_in_charge}</Text>
      {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.btn}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.btn, { backgroundColor: COLORS.red }]}><Text style={styles.btnText}>Hapus</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginVertical: SPACING.xs, marginHorizontal: SPACING.md },
  name: { fontSize: FONT.body, fontWeight: 'bold', color: COLORS.text },
  sub: { fontSize: FONT.small, color: COLORS.textLight, marginTop: 2 },
  desc: { fontSize: FONT.small, color: COLORS.textLight, marginTop: 4, fontStyle: 'italic' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.sm, gap: SPACING.sm },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm },
  btnText: { color: COLORS.white, fontSize: FONT.small, fontWeight: '600' },
});
