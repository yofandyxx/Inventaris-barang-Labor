import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CONDITION_COLORS, RADIUS, FONT } from '../constants/theme';

interface Props {
  condition: string;
}

export default function ConditionBadge({ condition }: Props) {
  const color = CONDITION_COLORS[condition] || '#64748b';
  return (
    <Text style={[styles.badge, { backgroundColor: color + '22', color }]}>{condition}</Text>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm, fontSize: FONT.small, fontWeight: '600', overflow: 'hidden' },
});
