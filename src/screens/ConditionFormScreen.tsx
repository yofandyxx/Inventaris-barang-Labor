import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getEquipmentById } from '../services/equipmentService';
import { changeCondition } from '../services/conditionService';
import { Equipment } from '../types';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { Condition } from '../types';

const CONDITIONS: Condition[] = ['Baik', 'Rusak', 'Perlu Perbaikan'];

export default function ConditionFormScreen({ route, navigation }: any) {
  const equipmentId = route.params.equipmentId;
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [newCondition, setNewCondition] = useState<Condition>('Baik');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getEquipmentById(equipmentId).then(setEquipment);
  }, [equipmentId]);

  const save = async () => {
    if (!equipment) return;
    try {
      await changeCondition(equipmentId, newCondition, notes || null);
      Alert.alert('Sukses', 'Kondisi diperbarui.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Ubah Kondisi Alat" />
      <View style={styles.form}>
        <Text style={styles.label}>Alat</Text>
        <Text style={styles.value}>{equipment?.name}</Text>
        <Text style={styles.label}>Kondisi Sebelumnya</Text>
        <Text style={styles.value}>{equipment?.condition}</Text>
        <Text style={styles.label}>Kondisi Baru *</Text>
        <View style={styles.row}>
          {CONDITIONS.map((c) => (
            <TouchableOpacity key={c} style={[styles.chip, newCondition === c && styles.chipActive]} onPress={() => setNewCondition(c)}>
              <Text style={styles.chipText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Keterangan</Text>
        <TextInput style={styles.input} value={notes} onChangeText={setNotes} multiline />
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  form: { padding: SPACING.lg },
  label: { fontSize: 13, color: COLORS.text, marginTop: SPACING.sm, marginBottom: 4, fontWeight: '600' },
  value: { fontSize: 14, color: COLORS.textLight },
  input: { backgroundColor: COLORS.card, borderRadius: 8, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { backgroundColor: COLORS.border, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: 6, marginVertical: 2 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.text, fontSize: 12 },
  saveBtn: { backgroundColor: COLORS.green, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginTop: SPACING.lg },
  saveText: { color: COLORS.white, fontWeight: 'bold' },
});
