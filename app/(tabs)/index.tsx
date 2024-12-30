import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants";
import { LinearGradient } from 'expo-linear-gradient';

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [gradientAnimation, setGradientAnimation] = useState(new Animated.Value(0));
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();

       
        const gradientColors = [
            ['#B1F0F7', '#B4DA1A9', '#0A5EB0'],
            ['#3D3BF3', '#4335A7', '#FFD700'],
            ['#1F509A', '#FF8C00', '#B1F0F7']
        ];

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % gradientColors.length;
            setGradientAnimation(new Animated.Value(0));

          
            Animated.timing(gradientAnimation, {
                toValue: 1,
                duration: 3000, 
                useNativeDriver: false,
            }).start();

            
            gradientAnimation.setValue(0); 
        }, 3000); 
        return () => clearInterval(interval); 
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            {}
            <View style={styles.container}>
            <LinearGradient
    colors={['#E6E6FA', '#ADD8E6', '#98FF98']} // Lavender, Light Blue, Mint Green
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.background, {
        transform: [
            {
                translateX: gradientAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                }),
            },
        ],
    }]}
/>
                
                {/* Content */}
                <ThemedView style={styles.innerContainer}>
                    <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={5} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button onPress={() => handleDeleteTodo(item._id)} style={styles.deleteButton}>Delete</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Todo</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Todo" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFC',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        zIndex: -1,
        borderRadius: 10,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#2C3E50',
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        padding: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#34495E',
    },
    description: {
        color: '#7F8C8D',
        fontSize: 14,
        marginTop: 6,
    },
    deleteButton: {
        backgroundColor: '#E74C3C',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#16A085',
        elevation: 6,
        borderRadius: 30,
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 6,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#F2F4F8',
        borderRadius: 8,
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#27AE60',
        borderRadius: 8,
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#BDC3C7',
        borderRadius: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 5,
    },
    dialogButton: {
        backgroundColor: '#2ECC71',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
});

export default TodosScreen;
