// app/(tabs)/home.tsx
import { router } from 'expo-router';
import React from 'react';
import { HomeScreen } from '../../screens/HomeScreen';

export default function Home() {
  return (
    <HomeScreen
      onNavigateToOrder={() => router.push('/')}
      onNavigateToReserve={() => router.push('/')}
    />
  );
}