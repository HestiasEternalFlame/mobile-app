import React, { useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useCookbooks } from '@/hooks/useCookbooks'; // adjust path if needed
import CookbookCard from '@/components/CookbookCard';

export default function CookbooksScreen() {
  const { data, isLoading, error } = useCookbooks();
  const cookbooks = data ?? []; // fallback to empty array while loading

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Failed to load cookbooks {error.message}</Text>;

  return (
    <FlatList
        data={cookbooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
        <CookbookCard
            id={item.id}
            title={item.title}
            coverId={item.openLibraryCoverId}
        />
        )}
    />
);
}

const styles = StyleSheet.create({
    center: {
        marginTop: 40,
        textAlign: 'center',
    },
    container: {
        padding: 16,
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
    card: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    description: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
    },
});