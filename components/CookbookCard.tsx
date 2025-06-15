// 📄 CookbookCard.tsx

import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type CookbookCardProps = {
  id: string;
  title: string;
  coverId?: string;
};

// 👇 THIS is where your component begins
export default function CookbookCard({ id, title, coverId }: CookbookCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

    return (
    <Pressable onPress={() => router.push(`/cookbookDetail/${id}`)} style={styles.card}>
      {coverUrl && !imageError ? (
        <Image
          source={{ uri: coverUrl }}
          style={styles.cover}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-start',
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});