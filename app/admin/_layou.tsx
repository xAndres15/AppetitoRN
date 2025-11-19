// app/admin/_layout.tsx
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="reservations" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="promotions" />
      <Stack.Screen name="statistics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}