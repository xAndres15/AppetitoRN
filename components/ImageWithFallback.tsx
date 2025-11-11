// components/ImageWithFallback.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';

export function ImageWithFallback(props: ImageProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  if (didError) {
    return (
      <View style={[styles.fallbackContainer, props.style]}>
        <Ionicons name="image-outline" size={40} color="#9CA3AF" />
      </View>
    );
  }

  return <Image {...props} onError={handleError} />;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});