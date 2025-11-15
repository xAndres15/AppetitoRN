import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Checkbox from "../components/Checkbox";
import { registerUser } from "../lib/firebase";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!acceptTerms) return alert("Debes aceptar los tÃ©rminos y condiciones");
    if (!form.nombre || !form.apellido || !form.email || !form.password)
      return alert("Completa todos los campos obligatorios");

    const result = await registerUser(form.email, form.password, {
      name: form.nombre,
      lastName: form.apellido,
      phone: form.telefono,
      address: form.direccion,
    });

    if (result.success) {
      alert("âœ… Cuenta creada");
      router.push("/login");
    } else {
      alert("âŒ Error: " + result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={form.nombre}
          onChangeText={(v) => handleChange("nombre", v)}
        />

        <TextInput
          placeholder="Apellido"
          style={styles.input}
          value={form.apellido}
          onChangeText={(v) => handleChange("apellido", v)}
        />

        <TextInput
          placeholder="Correo electrÃ³nico"
          style={styles.input}
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />

        <TextInput
          placeholder="NÃºmero de celular"
          style={styles.input}
          value={form.telefono}
          onChangeText={(v) => handleChange("telefono", v)}
        />

        <TextInput
          placeholder="DirecciÃ³n"
          style={styles.input}
          value={form.direccion}
          onChangeText={(v) => handleChange("direccion", v)}
        />

        <TextInput
          placeholder="ContraseÃ±a"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />

        <View style={styles.checkboxRow}>
          <Checkbox value={acceptTerms} onValueChange={setAcceptTerms} />
          <Text style={styles.checkboxLabel}>TÃ©rminos y condiciones</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarte</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.loginText}>
        Â¿Ya tienes cuenta?{" "}
        <Text style={styles.link} onPress={() => router.push("/login")}>
          Iniciar sesiÃ³n
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FF9B00",
    flexGrow: 1,
    justifyContent: "center",
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: "#D60000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#D60000",
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
  link: {
    textDecorationLine: "underline",
    color: "#fff",
  },
});