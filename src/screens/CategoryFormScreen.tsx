import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getCategoryById, createCategory, updateCategory, isCategoryNameDuplicate } from '../services/categoryService';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { isRequired } from '../utils/validation';

const ICONS = ['cube-outline', 'laptop-outline', 'flask-outline', 'analytics-outline', 'hardware-chip-outline'];

export default function CategoryFormScreen({ route, navigation }: any) {
  const id = route?.params?.id;
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('cube-outline');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      getCategoryById(id).then((c) => {
        if (c) { setName(c.name); setIcon(c.icon); setDescription(c.description || ''); }
      });
    }
  }, [id]);

  const save = async () => {
    if (!isRequired(name)) { Alert.alert('Validasi', 'Nama kategori wajib diisi.'); return; }
    const dup = await isCategoryNameDuplicate(name, id);
    if (dup) { Alert.alert('Validasi', 'Nama kategori sudah ada.'); return; }
    if (id) await updateCategory(id, name, icon, description || null);
    else await createCategory(name, icon, description || null);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader title={id ? 'Edit Kategori' : 'Tambah Kategori'} />
      <View style={styles.form}>
        <Text style={styles.label}>Nama Kategori *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Ikon</Text>
        <View style={styles.row}>
          {ICONS.map((ic) => (
            <TouchableOpacity key={ic} style={[styles.chip, icon === ic && styles.chipActive]} onPress={() => setIcon(ic)}>
              <Text style={styles.chipText}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Deskripsi</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
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
  input: { backgroundColor: COLORS.card, borderRadius: 8, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { backgroundColor: COLORS.border, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: 6, marginVertical: 2 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.text, fontSize: 11 },
  saveBtn: { backgroundColor: COLORS.green, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginTop: SPACING.lg },
  saveText: { color: COLORS.white, fontWeight: 'bold' },
});
