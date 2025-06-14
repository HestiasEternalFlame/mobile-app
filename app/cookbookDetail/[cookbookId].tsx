import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRecipesByCookbook } from '@/hooks/useRecipesByCookbook';

export default function CookbookDetailScreen() {
  const { cookbookId } = useLocalSearchParams();
  const router = useRouter();

  if (!cookbookId || typeof cookbookId !== 'string') {
    return <Text style={styles.center}>Invalid cookbook ID</Text>;
  }

  const {
    data: recipes,
    isLoading,
    error,
  } = useRecipesByCookbook(cookbookId);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error) {
    return <Text style={styles.center}>Failed to load recipes</Text>;
  }

  if (!recipes || recipes.length === 0) {
    return <Text style={styles.center}>No recipes found in this cookbook.</Text>;
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.header}>Recipes in Cookbook: {cookbookId}</Text>}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/recipe/${item.id}`)}
          style={styles.recipeItem}
        >
          <Text style={styles.recipeTitle}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  recipeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});