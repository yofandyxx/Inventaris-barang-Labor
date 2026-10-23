import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import EquipmentScreen from '../screens/EquipmentScreen';
import EquipmentFormScreen from '../screens/EquipmentFormScreen';
import EquipmentDetailScreen from '../screens/EquipmentDetailScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CategoryFormScreen from '../screens/CategoryFormScreen';
import LaboratoryScreen from '../screens/LaboratoryScreen';
import LaboratoryFormScreen from '../screens/LaboratoryFormScreen';
import BorrowingScreen from '../screens/BorrowingScreen';
import BorrowingFormScreen from '../screens/BorrowingFormScreen';
import BorrowingDetailScreen from '../screens/BorrowingDetailScreen';
import ConditionHistoryScreen from '../screens/ConditionHistoryScreen';
import ConditionFormScreen from '../screens/ConditionFormScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EquipmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EquipmentList" component={EquipmentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EquipmentForm" component={EquipmentFormScreen} options={{ title: 'Form Alat' }} />
      <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} options={{ title: 'Detail Alat' }} />
      <Stack.Screen name="ConditionForm" component={ConditionFormScreen} options={{ title: 'Ubah Kondisi' }} />
    </Stack.Navigator>
  );
}

function CategoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoryList" component={CategoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CategoryForm" component={CategoryFormScreen} options={{ title: 'Form Kategori' }} />
    </Stack.Navigator>
  );
}

function LaboratoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LaboratoryList" component={LaboratoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LaboratoryForm" component={LaboratoryFormScreen} options={{ title: 'Form Laboratorium' }} />
    </Stack.Navigator>
  );
}

function BorrowingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BorrowingList" component={BorrowingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BorrowingForm" component={BorrowingFormScreen} options={{ title: 'Form Peminjaman' }} />
      <Stack.Screen name="BorrowingDetail" component={BorrowingDetailScreen} options={{ title: 'Detail Peminjaman' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icon = 'home';
            if (route.name === 'Dashboard') icon = 'home';
            else if (route.name === 'Inventaris') icon = 'cube';
            else if (route.name === 'Kategori') icon = 'pricetags';
            else if (route.name === 'Laboratorium') icon = 'business';
            else if (route.name === 'Peminjaman') icon = 'swap-horizontal';
            else if (route.name === 'Laporan') icon = 'bar-chart';
            else if (route.name === 'Profil') icon = 'person';
            return <Ionicons name={icon as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Inventaris" component={EquipmentStack} />
        <Tab.Screen name="Kategori" component={CategoryStack} />
        <Tab.Screen name="Laboratorium" component={LaboratoryStack} />
        <Tab.Screen name="Peminjaman" component={BorrowingStack} />
        <Tab.Screen name="Laporan" component={ReportScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
