import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <LinearGradient
                        colors={['#B0BEC5', '#64B5F6']} // Abu-abu ke biru
                        style={{ flex: 1, borderRadius: 20 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderRadius: 20,
                        marginBottom: 16,
                        marginHorizontal: 8,
                        elevation: 5,
                    },
                    default: {
                        backgroundColor: '#E0E0E0', // Abu-abu sebagai warna dasar pada Android
                        borderRadius: 20,
                    },
                }),
                tabBarIcon: ({ focused, color }) => {
                    let iconName = route.name === 'index' ? 'list.fill' : 'person.fill';
                    const scale = new Animated.Value(focused ? 1.2 : 1);
                    Animated.spring(scale, { toValue: focused ? 1.3 : 1, useNativeDriver: true }).start();

                    return (
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <IconSymbol size={30} name={iconName} color={color} />
                        </Animated.View>
                    );
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Todos',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
