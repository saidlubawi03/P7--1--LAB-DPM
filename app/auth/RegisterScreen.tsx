import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import API_URL from "../../config/config";

export default function RegisterScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleRegister = async () => {
		try {
			await axios.post(`${API_URL}/api/auth/register`, {
				username,
				password,
				email,
			});
			Alert.alert("Registration Successful", "You can now log in");
			router.replace("/auth/LoginScreen");
		} catch (error) {
			Alert.alert("Registration Failed", (error as any).response?.data?.message || "An error occurred");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}> {/* Added a centered header view */}
				<Image
					source={require("../../assets/images/favicon1.png")}
					style={styles.image}
				/>
				<Text style={styles.title}>Create an Account</Text>
				<Text style={styles.subtitle}>Join us and get started</Text>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				style={styles.registerButton}
				onPress={handleRegister}
			>
				<Text style={styles.registerButtonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => router.replace("/auth/LoginScreen")}
			>
				<Text style={styles.backButtonText}>Back to Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#4A90E2",
        backgroundImage: 'linear-gradient(to bottom,rgb(103, 175, 238),rgb(206, 230, 230))',
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
        paddingTop: 50,
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#ffffff",
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 18,
        color: "#E0F7FF",
        marginBottom: 16,
    },
    input: {
		width: "100%",
        height: 50,
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 18,
        backgroundColor: "#ffffff30",
        fontSize: 16,
        color: "#ffffff",
         // Warna placeholder lebih jelas
      
    },
    registerButton: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    registerButtonText: {
        color: "#4A90E2",
        fontSize: 18,
        fontWeight: "700",
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    backButton: {
		width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ffffff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff20",
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    backButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
	
});
