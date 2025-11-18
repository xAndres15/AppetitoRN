// app/(tabs)/offers.tsx
import { router } from 'expo-router';
import React from 'react';
import { OffersScreen } from '../../screens/OffersScreen';

export default function Offers() {
  return (
    <OffersScreen
      onNavigateBack={() => router.back()}
    />
  );
}