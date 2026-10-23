import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

interface Props {
  title: string;
  value: number | string;
  color: string;
  icon?: string;
}

export default function StatCard({ title, value, color, icon }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.xs,
    borderLeftWidth: 4,
    flex: 1,
    minWidth: 140,
  },
  title: { fontSize: FONT.small, color: COLORS.textLight },
  value: { fontSize: FONT.subtitle, fontWeight: 'bold', marginTop: 4 },
  icon: { position: 'absolute', right: 8, top: 8, fontSize: 20 },
});
