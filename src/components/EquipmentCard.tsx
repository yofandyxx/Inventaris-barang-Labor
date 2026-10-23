import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import ConditionBadge from './ConditionBadge';
import { Equipment } from '../types';

interface Props {
  item: Equipment;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EquipmentCard({ item, onPress, onEdit, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {item.photo_uri ? (
          <Image source={{ uri: item.photo_uri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoText}>{item.category_icon || '🔧'}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.code}>{item.inventory_code}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sub}>{item.category_name} • {item.laboratory_name}</Text>
          <View style={styles.meta}>
            <Text style={styles.qty}>Jumlah: {item.quantity}</Text>
            <ConditionBadge condition={item.condition} />
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.btn}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.btn, { backgroundColor: COLORS.red }]}><Text style={styles.btnText}>Hapus</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginVertical: SPACING.xs, marginHorizontal: SPACING.md },
  row: { flexDirection: 'row' },
  photo: { width: 60, height: 60, borderRadius: RADIUS.sm },
  photoPlaceholder: { width: 60, height: 60, borderRadius: RADIUS.sm, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  photoText: { fontSize: 28 },
  info: { flex: 1, marginLeft: SPACING.md },
  code: { fontSize: FONT.small, color: COLORS.accent, fontWeight: '600' },
  name: { fontSize: FONT.body, fontWeight: 'bold', color: COLORS.text },
  sub: { fontSize: FONT.small, color: COLORS.textLight, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: SPACING.sm },
  qty: { fontSize: FONT.small, color: COLORS.text },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.sm, gap: SPACING.sm },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm },
  btnText: { color: COLORS.white, fontSize: FONT.small, fontWeight: '600' },
});
