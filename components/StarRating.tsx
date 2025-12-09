// components/StarRating.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  color?: string;
  emptyColor?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
  readonly = false,
  color = '#F59E0B',
  emptyColor = '#D1D5DB',
}: StarRatingProps) {
  const handlePress = (selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

        if (readonly) {
          // Modo solo lectura (mostrar rating)
          return (
            <View key={index} style={styles.starContainer}>
              {isHalfFilled ? (
                <View style={styles.halfStarContainer}>
                  <Ionicons name="star-half" size={size} color={color} />
                  <View style={styles.emptyHalfStar}>
                    <Ionicons name="star-outline" size={size} color={emptyColor} />
                  </View>
                </View>
              ) : (
                <Ionicons
                  name={isFilled ? 'star' : 'star-outline'}
                  size={size}
                  color={isFilled ? color : emptyColor}
                />
              )}
            </View>
          );
        }

        // Modo interactivo (seleccionar rating)
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(starNumber)}
            activeOpacity={0.7}
            style={styles.starContainer}
          >
            <Ionicons
              name={isFilled ? 'star' : 'star-outline'}
              size={size}
              color={isFilled ? color : emptyColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginHorizontal: 2,
  },
  halfStarContainer: {
    position: 'relative',
  },
  emptyHalfStar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});