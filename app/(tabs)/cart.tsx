// app/(tabs)/cart.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Cart() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carrito de Compras</Text>
      <Text style={styles.subtext}>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6B7280',
  },
});