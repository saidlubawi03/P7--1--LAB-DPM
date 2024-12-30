import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ImageBackground style={styles.container} resizeMode="cover">
                <ThemedView style={styles.contentContainer}>
                    {profile ? (
                        <View style={styles.profileContainer}>
                            <View style={styles.header}>
                                <ThemedText style={styles.username}>{profile.username}</ThemedText>
                                <ThemedText style={styles.email}>{profile.email}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <ThemedText style={styles.label}>Username</ThemedText>
                                <ThemedText style={styles.value}>{profile.username}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <ThemedText style={styles.label}>Email</ThemedText>
                                <ThemedText style={styles.value}>{profile.email}</ThemedText>
                            </View>
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </View>
                    ) : (
                        <ThemedText>No profile data available</ThemedText>
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                                <Button onPress={confirmLogout}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'linear-gradient(to bottom, #87CEEB, #FFFFFF)', // Biru langit dan putih
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Putih transparan
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
        backgroundColor: '#87CEEB', // Biru langit
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    username: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff', // Putih untuk teks username
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    email: {
        fontSize: 18,
        color: '#FFFFFF', // Putih untuk email
        marginTop: 8,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#ffffff', // Putih
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#87CEEB', // Biru langit untuk aksen kiri
    },
    label: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    logoutButton: {
        marginTop: 32,
        backgroundColor: '#E74C3C', // Merah untuk tombol logout
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff', // Putih untuk teks tombol
    },
});

export default ProfileScreen;