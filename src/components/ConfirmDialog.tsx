import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ visible, title, message, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <Text style={styles.confirmText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, width: '80%' },
  title: { fontSize: FONT.subtitle, fontWeight: 'bold', color: COLORS.text },
  message: { fontSize: FONT.body, color: COLORS.textLight, marginTop: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.lg, gap: SPACING.sm },
  cancel: { padding: SPACING.sm },
  cancelText: { color: COLORS.textLight },
  confirm: { backgroundColor: COLORS.red, padding: SPACING.sm, borderRadius: RADIUS.sm },
  confirmText: { color: COLORS.white, fontWeight: 'bold' },
});
