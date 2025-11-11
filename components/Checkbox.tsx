// components/ui/Checkbox.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export default function Checkbox({ value, onValueChange }: Props) {
  return (
    <TouchableOpacity
      style={[styles.box, value && styles.boxChecked]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      {value && <Ionicons name="checkmark" size={16} color="#fff" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
});
