import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, backgroundColor: COLORS.primary },
  title: { color: COLORS.white, fontSize: FONT.title, fontWeight: 'bold' },
  subtitle: { color: COLORS.white, fontSize: FONT.small, marginTop: 4, opacity: 0.8 },
});
