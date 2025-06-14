import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRecipe } from '@/hooks/useRecipe';

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams();

  const {
    data: recipe,
    isLoading,
    error,
  } = useRecipe(recipeId as string);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error || !recipe) {
    return <Text style={styles.center}>Failed to load recipe</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.section}>Ingredients</Text>
      {recipe.recipe_ingredients?.length ? (
        recipe.recipe_ingredients.map((entry, index) => {
          const { quantity, unit, preparation, ingredients_master } = entry;
          const ingredientText = [
            quantity,
            unit,
            ingredients_master?.name,
            preparation ? `(${preparation})` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <Text style={styles.text} key={index}>
              • {ingredientText}
            </Text>
          );
        })
      ) : (
        <Text style={styles.text}>No ingredients found.</Text>
      )}

      <Text style={styles.section}>Instructions</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>
    </ScrollView>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});