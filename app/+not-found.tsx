import { Link, Stack } from 'expo-router';
import { StyleSheet, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <ImageBackground
      source={{uri: 'https://example.com/background.jpg'}} // Ganti dengan URL atau gambar lokal
      style={styles.background}
    >
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          This screen doesn't exist.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>
            Go to home screen!
          </ThemedText>
        </Link>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparan gelap untuk memperjelas teks
    borderRadius: 10,
    padding: 30,
    width: '80%',
  },
  title: {
    fontSize: 32,  // Ukuran font lebih besar
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#ff6347',  // Warna latar belakang tombol lebih cerah
    borderRadius: 30,  // Sudut tombol lebih melengkung
    elevation: 5,  // Bayangan untuk memberikan efek kedalaman
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
