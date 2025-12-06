// app/register.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
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
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!acceptTerms) return alert("Debes aceptar los términos y condiciones");
    if (!form.nombre || !form.apellido || !form.email || !form.password)
      return alert("Completa todos los campos obligatorios");

    const result = await registerUser(form.email, form.password, {
      name: form.nombre,
      lastName: form.apellido,
      phone: form.telefono,
      address: form.direccion,
    });

    if (result.success) {
      alert("✓ Cuenta creada");
      router.push("/login");
    } else {
      alert("✗ Error: " + result.error);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Registro</Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.nombre}
            onChangeText={(v) => handleChange("nombre", v)}
          />

          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.apellido}
            onChangeText={(v) => handleChange("apellido", v)}
          />

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Número de celular"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.telefono}
            onChangeText={(v) => handleChange("telefono", v)}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Dirección"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.direccion}
            onChangeText={(v) => handleChange("direccion", v)}
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />

          <View style={styles.checkboxRow}>
            <Checkbox value={acceptTerms} onValueChange={setAcceptTerms} />
            <Text style={styles.checkboxLabel}>
              Acepto los{" "}
              <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                Términos y condiciones
              </Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarte</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{" "}
          <Text style={styles.link} onPress={() => router.push("/login")}>
            Iniciar sesión
          </Text>
        </Text>
      </ScrollView>

      {/* Modal de Términos y Condiciones */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Términos y Condiciones</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Ionicons name="close" size={28} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              <View style={styles.modalBody}>
                <Text style={styles.sectionTitle}>1. ACEPTACIÓN DE LOS TÉRMINOS</Text>
                <Text style={styles.sectionText}>
                  El presente documento establece los Términos y Condiciones que regulan el acceso
                  y uso de la aplicación móvil Appetito (en adelante, "la Aplicación"),
                  desarrollada por el equipo de Appetito. Al registrarse o utilizar los servicios,
                  el usuario acepta plenamente estos Términos y Condiciones.
                </Text>

                <Text style={styles.sectionTitle}>2. OBJETO DE LA APLICACIÓN</Text>
                <Text style={styles.sectionText}>
                  Appetito es una plataforma digital que permite a los usuarios: realizar pedidos
                  de comida a domicilio, reservar mesas en restaurantes afiliados, consultar menús,
                  promociones y disponibilidad en tiempo real. Los restaurantes afiliados pueden
                  gestionar pedidos, reservas, menús y visualizar estadísticas de ventas mediante
                  un panel administrativo.
                </Text>

                <Text style={styles.sectionTitle}>3. USUARIOS DE LA PLATAFORMA</Text>
                <Text style={styles.sectionText}>
                  Appetito tiene tres tipos de usuarios: Clientes, Restaurantes afiliados y
                  Repartidores. Cada usuario es responsable de la veracidad de la información
                  registrada y del uso adecuado de su cuenta.
                </Text>

                <Text style={styles.sectionTitle}>4. REGISTRO Y SEGURIDAD DE LA CUENTA</Text>
                <Text style={styles.sectionText}>
                  Para acceder a las funcionalidades, los usuarios deberán crear una cuenta con
                  información personal veraz y actualizada. Appetito implementa medidas de
                  seguridad y cifrado para la protección de datos conforme a la Ley 1581 de 2012 y
                  el Decreto 1377 de 2013. Está prohibido suplantar a otra persona, manipular
                  pedidos o usar la aplicación para fines ilícitos.
                </Text>

                <Text style={styles.sectionTitle}>5. PAGOS Y TRANSACCIONES</Text>
                <Text style={styles.sectionText}>
                  Los pagos se realizan mediante pasarelas seguras integradas en la aplicación.
                  Appetito no almacena información financiera de los usuarios. En caso de fallos en
                  las pasarelas de pago, el usuario deberá comunicarse directamente con el
                  proveedor del servicio o el restaurante correspondiente.
                </Text>

                <Text style={styles.sectionTitle}>6. RESPONSABILIDADES DE APPETITO</Text>
                <Text style={styles.sectionText}>
                  Appetito facilita la conexión entre usuarios, restaurantes y repartidores,
                  garantiza el funcionamiento técnico y la protección de los datos personales. No
                  se responsabiliza por la calidad o cumplimiento de los productos ofrecidos por
                  los restaurantes, ni por retrasos o fallos imputables a terceros.
                </Text>

                <Text style={styles.sectionTitle}>7. PROPIEDAD INTELECTUAL</Text>
                <Text style={styles.sectionText}>
                  Todos los derechos sobre el diseño, código fuente, funcionalidades, logotipos y
                  contenido de Appetito son propiedad de su equipo desarrollador. Está prohibida la
                  reproducción o modificación sin autorización previa por escrito.
                </Text>

                <Text style={styles.sectionTitle}>8. PRIVACIDAD Y PROTECCIÓN DE DATOS</Text>
                <Text style={styles.sectionText}>
                  El tratamiento de datos personales se realiza conforme a la Política de
                  Privacidad de Appetito y a la legislación colombiana.
                </Text>

                <Text style={styles.sectionTitle}>9. LIMITACIÓN DE RESPONSABILIDAD</Text>
                <Text style={styles.sectionText}>
                  Appetito no garantiza la disponibilidad ininterrumpida del servicio ni se hace
                  responsable de pérdidas derivadas del mal uso de la aplicación o eventos fuera de
                  su control.
                </Text>

                <Text style={styles.sectionTitle}>10. MODIFICACIONES</Text>
                <Text style={styles.sectionText}>
                  Appetito podrá modificar estos Términos y Condiciones en cualquier momento. Las
                  versiones actualizadas estarán disponibles dentro de la aplicación y se
                  entenderán aceptadas al continuar usando el servicio.
                </Text>

                <Text style={styles.sectionTitle}>
                  11. LEGISLACIÓN APLICABLE Y JURISDICCIÓN
                </Text>
                <Text style={styles.sectionText}>
                  Estos términos y condiciones se rigen por las leyes de la República de Colombia.
                  Cualquier controversia se resolverá ante los tribunales competentes de la ciudad
                  de Cali, Valle del Cauca.
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    color: "#374151",
  },
  termsLink: {
    color: "#D60000",
    textDecorationLine: "underline",
    fontWeight: "600",
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D60000",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    textAlign: "justify",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  closeButton: {
    backgroundColor: "#D60000",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});