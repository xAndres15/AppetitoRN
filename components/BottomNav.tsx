// components/BottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  currentScreen: 'home' | 'offers' | 'cart' | 'profile';
  cartItemCount?: number; // ← AGREGADO
}

export function BottomNav({ currentScreen, cartItemCount = 0 }: BottomNavProps) { // ← AGREGADO
  return (
    <LinearGradient
      colors={['#FEC901', '#F47A00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.navContent}>
        {/* Home Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/home')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              currentScreen === 'home' && styles.iconContainerActive,
            ]}
          >
            <Ionicons name="home" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Offers Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/offers')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              currentScreen === 'offers' && styles.iconContainerActive,
            ]}
          >
            <Ionicons name="flame" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Cart Button CON BADGE */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              currentScreen === 'cart' && styles.iconContainerActive,
            ]}
          >
            <Ionicons name="cart" size={20} color="#fff" />
            {/* ← AGREGADO: Badge del carrito */}
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              currentScreen === 'profile' && styles.iconContainerActive,
            ]}
          >
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // ← AGREGADO para el badge
  },
  iconContainerActive: {
    backgroundColor: '#000',
  },
  // ← AGREGADO: Estilos del badge
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});