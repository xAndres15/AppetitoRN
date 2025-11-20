// screens/AdminSettingsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdminSettingsScreenProps {
  onNavigateBack: () => void;
  onLogout: () => void;
  onNavigateToRestaurantInfo?: () => void;
  onNavigateToOperatingHours?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToPaymentMethods?: () => void;
}

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function AdminSettingsScreen({
  onNavigateBack,
  onLogout,
  onNavigateToRestaurantInfo,
  onNavigateToOperatingHours,
  onNavigateToNotifications,
  onNavigateToPaymentMethods,
}: AdminSettingsScreenProps) {
  const settingsOptions: SettingOption[] = [
    {
      id: 'restaurant',
      title: 'Información del restaurante',
      description: 'Datos básicos y configuración general',
      icon: 'storefront-outline',
    },
    {
      id: 'hours',
      title: 'Horarios de operación',
      description: 'Configura horarios de atención',
      icon: 'time-outline',
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Configura alertas y notificaciones',
      icon: 'notifications-outline',
    },
    {
      id: 'payment',
      title: 'Métodos de pago',
      description: 'Configura opciones de pago',
      icon: 'card-outline',
    },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case 'restaurant':
        onNavigateToRestaurantInfo && onNavigateToRestaurantInfo();
        break;
      case 'hours':
        onNavigateToOperatingHours && onNavigateToOperatingHours();
        break;
      case 'notifications':
        onNavigateToNotifications && onNavigateToNotifications();
        break;
      case 'payment':
        onNavigateToPaymentMethods && onNavigateToPaymentMethods();
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Settings Options */}
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index !== settingsOptions.length - 1 && styles.optionItemBorder,
              ]}
              onPress={() => handleOptionClick(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon} size={24} color="#FFF" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  optionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#374151',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});