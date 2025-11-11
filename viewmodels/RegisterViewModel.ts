import { useState } from 'react';
import { AuthService } from '../services/AuthService';

export function useRegisterViewModel() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const register = async () => {
    if (!acceptTerms) throw new Error('Debes aceptar los términos y condiciones');
    if (!nombre || !apellido || !email || !password)
      throw new Error('Completa los campos obligatorios');
    if (!email.includes('@')) throw new Error('Correo inválido');
    if (password.length < 6)
      throw new Error('La contraseña debe tener mínimo 6 caracteres');

    setIsLoading(true);

    try {
      const result = await AuthService.register(email, password, {
        name: nombre,
        lastName: apellido,
        phone: telefono,
        address: direccion,
      });

      if (!result.success) {
        const e = String(result.error || '').toLowerCase();

        if (e.includes('email-already-in-use'))
          throw new Error('Este correo ya está registrado');
        if (e.includes('invalid-email')) throw new Error('Correo inválido');
        if (e.includes('weak-password')) throw new Error('La contraseña es muy débil');

        throw new Error('Error al crear la cuenta');
      }

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nombre,
    setNombre,
    apellido,
    setApellido,
    birthDate,
    setBirthDate,
    email,
    setEmail,
    telefono,
    setTelefono,
    direccion,
    setDireccion,
    password,
    setPassword,
    acceptTerms,
    setAcceptTerms,
    showPassword,
    setShowPassword,
    isLoading,
    register,
  } as const;
}
