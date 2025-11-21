// viewmodels/AdminPaymentMethodsViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getRestaurantInfo, updateRestaurantInfo } from '../lib/firebase';

interface PaymentMethods {
  cash: boolean;
  creditCard: boolean;
  debitCard: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  cash: true,
  creditCard: true,
  debitCard: true,
};

export function useAdminPaymentMethodsViewModel(
  restaurantId: string | null,
  onNavigateBack: () => void
) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>(DEFAULT_PAYMENT_METHODS);

  useEffect(() => {
    loadPaymentMethods();
  }, [restaurantId]);

  const loadPaymentMethods = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getRestaurantInfo(restaurantId);

    if (result.success && result.info && result.info.paymentMethodsConfig) {
      setPaymentMethods(result.info.paymentMethodsConfig);
    }
    setLoading(false);
  };

  const toggleCash = () => {
    setPaymentMethods((prev) => ({ ...prev, cash: !prev.cash }));
  };

  const toggleCreditCard = () => {
    setPaymentMethods((prev) => ({ ...prev, creditCard: !prev.creditCard }));
  };

  const toggleDebitCard = () => {
    setPaymentMethods((prev) => ({ ...prev, debitCard: !prev.debitCard }));
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'ID de restaurante no válido');
      return;
    }

    // Validar que al menos un método esté habilitado
    if (!paymentMethods.cash && !paymentMethods.creditCard && !paymentMethods.debitCard) {
      Alert.alert('Error', 'Debes habilitar al menos un método de pago');
      return;
    }

    setSaving(true);
    const result = await updateRestaurantInfo(restaurantId, {
      paymentMethodsConfig: paymentMethods,
    } as any);

    if (result.success) {
      Alert.alert('Éxito', 'Métodos de pago actualizados correctamente', [
        { text: 'OK', onPress: onNavigateBack },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al guardar los métodos de pago');
    }
    setSaving(false);
  };

  return {
    paymentMethods,
    loading,
    saving,
    toggleCash,
    toggleCreditCard,
    toggleDebitCard,
    handleSave,
  } as const;
}