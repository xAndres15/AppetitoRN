// app/login.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { resetPassword, signInUser } from "../lib/firebase"; // ← CAMBIADO

const { width } = Dimensions.get("window");

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return alert("Completa todos los campos");
        
        setIsLoading(true);
        const result = await signInUser(email, password); // ← CAMBIADO
        
        if (result.success) {
            alert("Bienvenido a Appetito");
            router.replace("/(tabs)/home");
        } else {
            alert("Error: " + result.error);
        }
        setIsLoading(false);
    };
    
    const handleReset = async () => {
        if (!email) return alert("Ingresa tu correo primero");
        
        setIsResetting(true);
        const result = await resetPassword(email);
        
        result.success 
            ? alert("Correo enviado, revisa tu bandeja") 
            : alert("Error: " + result.error);
            
        setIsResetting(false); 
    };
    
    return (
        <LinearGradient
            colors={["#FEC901", "#F47A00"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        > 
            <SafeAreaView style={styles.safe}>
                {/* HEADER CON FONDO BLANCO REDONDEADO */}
                <View style={styles.header}>
                    <ImageWithFallback
                        source={require("../assets/images/appetitoLogo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                
                {/* TARJETA BLANCA */} 
                <View style={styles.card}> 
                    <Text style={styles.title}>Iniciar sesión</Text>
                    
                    {/* Campo Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Usuario (número o correo)"
                            placeholderTextColor="#999"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    
                    {/* Campo Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor="#999"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword} 
                        />
                        <TouchableOpacity
                            style={styles.iconRight}
                            onPress={() => setShowPassword(!showPassword)} 
                        > 
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20} 
                                color="#888" 
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Link Olvidaste tu contraseña */}
                    <TouchableOpacity onPress={handleReset} disabled={isResetting}>
                        <Text style={styles.forgotText}>
                            {isResetting ? "Enviando..." : "¿Olvidaste tu contraseña?"}
                        </Text>
                    </TouchableOpacity>
                    
                    {/* Botón Iniciar sesión */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>
                
                {/* LINKS ABAJO */}
                <View style={styles.bottomLinks}>
                    <Text style={styles.bottomText}>
                        ¿No tienes cuenta?{" "}
                        <Text style={styles.linkText} onPress={() => router.push("/register")}>
                            Regístrate ahora
                        </Text>
                    </Text>
                    
                    <Text style={styles.linkText}>
                        Regístrate como restaurante o repartidor →
                    </Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({ 
    container: { flex: 1 },
    safe: { flex: 1, alignItems: "center" },
    
    // Header
    header: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 200, 
        borderBottomRightRadius: 200, 
        paddingVertical: 80, 
        alignItems: "center", 
        width: "100%", 
    }, 
    logo: { width: width * 0.45, height: width * 0.45 },
    
    // Tarjeta 
    card: { 
        backgroundColor: "#fff", 
        borderRadius: 20, 
        padding: 20, 
        width: "90%",
        marginTop: 20 
    },
    title: { 
        color: "#dc2626", 
        fontSize: 22, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 20 
    }, 
    
    // Inputs 
    inputContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#f3f4f6", 
        borderRadius: 10, 
        paddingHorizontal: 10, 
        marginBottom: 12 
    }, 
    icon: { marginRight: 6 }, 
    iconRight: { position: "absolute", right: 10 }, 
    input: { flex: 1, height: 45 }, 
    
    // Forgot password
    forgotText: { 
        color: "#444", 
        textAlign: "right", 
        fontSize: 13, 
        textDecorationLine: "underline", 
        marginBottom: 12 
    }, 
        
    // Botón de login
    loginButton: { 
        backgroundColor: "#dc2626",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center"
    }, 
    loginButtonText: { 
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    }, 
    
    // Links inferiores
    bottomLinks: { marginTop: 25, alignItems: "center" },
    bottomText: { color: "#fff", fontSize: 14 }, 
    linkText: { 
        color: "#fff", 
        textDecorationLine: "underline", 
        fontSize: 14, 
        marginTop: 6 
    } 
});