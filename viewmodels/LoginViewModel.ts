// viewmodels/LoginViewModel.ts
import { useState } from 'react';
import { AuthService } from '../services/AuthService';

export function useLoginViewModel() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

  const validateEmail = (e: string) => e.includes('@');

  const login = async () => {
    if (!email || !password) {
      throw new Error('Por favor completa todos los campos');
    }

    if (!validateEmail(email)) {
      throw new Error('Por favor ingresa un correo válido');
    }

    setIsLoading(true);

    try {
      const res = await AuthService.login(email, password);

      if (!res.success) {
        const code = res.error ?? '';
        let msg = 'Error al iniciar sesión';

        if (code.includes('user-not-found')) msg = 'Usuario no encontrado';
        else if (code.includes('wrong-password')) msg = 'Contraseña incorrecta';
        else if (code.includes('invalid-email')) msg = 'Correo electrónico inválido';

        throw new Error(msg);
      }

      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = async () => {
    if (!email) throw new Error('Por favor ingresa tu correo electrónico primero');
    if (!validateEmail(email)) throw new Error('Por favor ingresa un correo válido');

    setIsResettingPassword(true);

    try {
      const res = await AuthService.resetPassword(email);

      if (!res.success) {
        const code = res.error ?? '';
        let msg = 'Error al enviar el correo';

        if (code.includes('user-not-found')) msg = 'No existe una cuenta con este correo';
        else if (code.includes('invalid-email')) msg = 'Correo electrónico inválido';

        throw new Error(msg);
      }

      return true;
    } finally {
      setIsResettingPassword(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    isResettingPassword,
    login,
    reset,
  } as const;
}
