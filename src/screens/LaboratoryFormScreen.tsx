import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getLaboratoryById, createLaboratory, updateLaboratory, isLaboratoryNameDuplicate } from '../services/laboratoryService';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { isRequired } from '../utils/validation';

export default function LaboratoryFormScreen({ route, navigation }: any) {
  const id = route?.params?.id;
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      getLaboratoryById(id).then((l) => {
        if (l) { setName(l.name); setLocation(l.location); setPersonInCharge(l.person_in_charge); setDescription(l.description || ''); }
      });
    }
  }, [id]);

  const save = async () => {
    if (!isRequired(name) || !isRequired(location) || !isRequired(personInCharge)) {
      Alert.alert('Validasi', 'Field wajib belum lengkap.');
      return;
    }
    const dup = await isLaboratoryNameDuplicate(name, id);
    if (dup) { Alert.alert('Validasi', 'Nama laboratorium sudah ada.'); return; }
    if (id) await updateLaboratory(id, name, location, personInCharge, description || null);
    else await createLaboratory(name, location, personInCharge, description || null);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader title={id ? 'Edit Laboratorium' : 'Tambah Laboratorium'} />
      <View style={styles.form}>
        <Text style={styles.label}>Nama Laboratorium *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Lokasi *</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />
        <Text style={styles.label}>Penanggung Jawab *</Text>
        <TextInput style={styles.input} value={personInCharge} onChangeText={setPersonInCharge} />
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
  saveBtn: { backgroundColor: COLORS.green, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginTop: SPACING.lg },
  saveText: { color: COLORS.white, fontWeight: 'bold' },
});
