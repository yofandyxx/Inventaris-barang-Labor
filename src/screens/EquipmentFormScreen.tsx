import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getEquipmentById, createEquipment, updateEquipment, isInventoryCodeDuplicate } from '../services/equipmentService';
import { getAllCategories } from '../services/categoryService';
import { getAllLaboratories } from '../services/laboratoryService';
import { Category, Laboratory, Condition } from '../types';
import AppHeader from '../components/AppHeader';
import { COLORS, SPACING } from '../constants/theme';
import { isRequired, isNonNegativeNumber } from '../utils/validation';

const CONDITIONS: Condition[] = ['Baik', 'Rusak', 'Perlu Perbaikan'];

export default function EquipmentFormScreen({ route, navigation }: any) {
  const id = route?.params?.id;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [laboratoryId, setLaboratoryId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('0');
  const [condition, setCondition] = useState<Condition>('Baik');
  const [photoUri, setPhotoUri] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [labs, setLabs] = useState<Laboratory[]>([]);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses galeri untuk memilih foto alat.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) setPhotoUri(result.assets[0].uri);
  };

  useEffect(() => {
    getAllCategories().then(setCategories);
    getAllLaboratories().then(setLabs);
    if (id) {
      getEquipmentById(id).then((e) => {
        if (e) {
          setCode(e.inventory_code);
          setName(e.name);
          setCategoryId(e.category_id);
          setLaboratoryId(e.laboratory_id);
          setQuantity(String(e.quantity));
          setCondition(e.condition);
          setPhotoUri(e.photo_uri || '');
          setDescription(e.description || '');
        }
      });
    }
  }, [id]);

  const save = async () => {
    const missing: string[] = [];
    if (!isRequired(code)) missing.push('Kode inventaris');
    if (!isRequired(name)) missing.push('Nama alat');
    if (categoryId === null || categoryId === undefined) missing.push('Kategori');
    if (laboratoryId === null || laboratoryId === undefined) missing.push('Laboratorium');
    if (missing.length > 0) {
      Alert.alert('Validasi', `Lengkapi: ${missing.join(', ')}.`);
      return;
    }
    if (!isNonNegativeNumber(quantity)) {
      Alert.alert('Validasi', 'Jumlah tidak valid.');
      return;
    }
    const selectedCategoryId = categoryId as number;
    const selectedLaboratoryId = laboratoryId as number;
    try {
      const normalizedCode = code.trim();
      const normalizedName = name.trim();
      const dup = await isInventoryCodeDuplicate(normalizedCode, id);
      if (dup) {
        Alert.alert('Validasi', 'Kode inventaris sudah digunakan.');
        return;
      }
      const data = {
      inventory_code: normalizedCode,
      name: normalizedName,
      category_id: selectedCategoryId,
      laboratory_id: selectedLaboratoryId,
      quantity: Number(quantity),
      condition,
      photo_uri: photoUri || null,
      description: description.trim() || null,
      };
      if (id) await updateEquipment(id, data);
      else await createEquipment(data);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Gagal menyimpan', (e as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader title={id ? 'Edit Alat' : 'Tambah Alat'} />
      <View style={styles.form}>
        <Text style={styles.label}>Kode Inventaris *</Text>
        <TextInput style={styles.input} value={code} onChangeText={setCode} />
        <Text style={styles.label}>Nama Alat *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Kategori *</Text>
        <View style={styles.row}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} style={[styles.chip, categoryId === c.id && styles.chipActive]} onPress={() => setCategoryId(c.id)}>
              <Text style={styles.chipText}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Laboratorium *</Text>
        <View style={styles.row}>
          {labs.map((l) => (
            <TouchableOpacity key={l.id} style={[styles.chip, laboratoryId === l.id && styles.chipActive]} onPress={() => setLaboratoryId(l.id)}>
              <Text style={styles.chipText}>{l.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Jumlah *</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        <Text style={styles.label}>Kondisi *</Text>
        <View style={styles.row}>
          {CONDITIONS.map((c) => (
            <TouchableOpacity key={c} style={[styles.chip, condition === c && styles.chipActive]} onPress={() => setCondition(c)}>
              <Text style={styles.chipText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Foto Alat</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
          <Text style={styles.photoButtonText}>{photoUri ? 'Ganti Foto' : 'Pilih Foto dari Galeri'}</Text>
        </TouchableOpacity>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : null}
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
  chipText: { color: COLORS.text, fontSize: 12 },
  saveBtn: { backgroundColor: COLORS.green, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginTop: SPACING.lg },
  saveText: { color: COLORS.white, fontWeight: 'bold' },
  photoButton: { backgroundColor: COLORS.primary, borderRadius: 8, padding: SPACING.sm, alignItems: 'center' },
  photoButtonText: { color: COLORS.white, fontWeight: '600' },
  preview: { width: '100%', height: 180, borderRadius: 8, marginTop: SPACING.sm, resizeMode: 'cover' },
});
