// components/BottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  currentScreen: 'home' | 'offers' | 'cart' | 'profile';
}

export function BottomNav({ currentScreen }: BottomNavProps) {
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
          onPress={() => router.push('../(tabs)/home')}
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
          onPress={() => router.push('../(tabs)/offers')}
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

        {/* Cart Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('../(tabs)/cart')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              currentScreen === 'cart' && styles.iconContainerActive,
            ]}
          >
            <Ionicons name="cart" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('../(tabs)/profile')}
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
  },
  iconContainerActive: {
    backgroundColor: '#000',
  },
});