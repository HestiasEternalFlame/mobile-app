import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors'; // Relative import

// Mock data for now - replace with actual API calls later
interface Recipe {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  prep_time?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Cookbook {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  recipe_count?: number;
  category?: string;
}

const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh basil and mozzarella',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
    prep_time: 30,
    servings: 4,
    difficulty: 'medium',
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
    prep_time: 20,
    servings: 24,
    difficulty: 'easy',
  },
];

const mockCookbooks: Cookbook[] = [
  {
    id: 1,
    title: 'Italian Classics',
    description: 'Traditional recipes from Italy',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    recipe_count: 25,
    category: 'Italian',
  },
  {
    id: 2,
    title: 'Quick Desserts',
    description: 'Easy and delicious dessert recipes',
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300',
    recipe_count: 18,
    category: 'Desserts',
  },
];

export default function HomeScreen(): JSX.Element {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [featuredCookbooks, setFeaturedCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load home data (mock for now)
  const loadHomeData = useCallback(async (): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecentRecipes(mockRecipes);
      setFeaturedCookbooks(mockCookbooks);
    } catch (error) {
      console.error('Error loading home data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    loadHomeData();
  }, [loadHomeData]);

  const getDifficultyColor = (difficulty: Recipe['difficulty']): string => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.secondary;
    }
  };


  const styles = createStyles(colors);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome to CookbookAI</Text>
        <Text style={styles.welcomeSubtext}>
          Discover, organize, and enjoy your favorite recipes
        </Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Collection</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockRecipes.length}</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockCookbooks.length}</Text>
            <Text style={styles.statLabel}>Cookbooks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Ingredients</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={[styles.actionCard, { borderLeftColor: colors.success }]}
          onPress={() => router.push('/(tabs)/cookbooks')}
        >
          <Ionicons name="library-outline" size={32} color={colors.success} />
          <View style={styles.actionCardText}>
            <Text style={styles.actionCardTitle}>Browse Cookbooks</Text>
            <Text style={styles.actionCardSubtitle}>Explore your recipe collections</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { borderLeftColor: colors.warning }]}
          onPress={() => router.push('/(tabs)/recipes')}
        >
          <Ionicons name="restaurant-outline" size={32} color={colors.warning} />
          <View style={styles.actionCardText}>
            <Text style={styles.actionCardTitle}>All Recipes</Text>
            <Text style={styles.actionCardSubtitle}>Browse all available recipes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { borderLeftColor: colors.info }]}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search-outline" size={32} color={colors.info} />
          <View style={styles.actionCardText}>
            <Text style={styles.actionCardTitle}>Search Recipes</Text>
            <Text style={styles.actionCardSubtitle}>Find recipes by ingredients</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Recent Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Recipes</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/recipes')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => {
              // Navigate to recipe detail (you'll create this later)
              Alert.alert('Recipe', `Opening ${recipe.title}`);
            }}
          >
            <Image
              source={{ uri: recipe.image_url }}
              style={styles.recipeImage}
              defaultSource={{ uri: 'https://via.placeholder.com/120x120?text=Recipe' }}
            />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {recipe.title}
              </Text>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {recipe.description || 'Delicious recipe to try'}
              </Text>
              <View style={styles.recipeMetadata}>
                <View style={styles.metadataItem}>
                  <Ionicons name="time-outline" size={14} color={colors.icon} />
                  <Text style={styles.metadataText}>
                    {recipe.prep_time ? `${recipe.prep_time} min` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <Ionicons name="people-outline" size={14} color={colors.icon} />
                  <Text style={styles.metadataText}>
                    {recipe.servings ? `${recipe.servings} servings` : 'N/A'}
                  </Text>
                </View>
                {recipe.difficulty && (
                  <View style={styles.metadataItem}>
                    <Ionicons 
                      name="flame-outline" 
                      size={14} 
                      color={getDifficultyColor(recipe.difficulty)} 
                    />
                    <Text style={[styles.metadataText, { color: getDifficultyColor(recipe.difficulty) }]}>
                      {recipe.difficulty}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Cookbooks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Cookbooks</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cookbooks')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cookbooksRow}
          contentContainerStyle={styles.cookbooksRowContent}
        >
          {featuredCookbooks.map((cookbook) => (
            <TouchableOpacity
              key={cookbook.id}
              style={styles.cookbookCard}
              onPress={() => {
                // Navigate to cookbook detail (you'll create this later)
                Alert.alert('Cookbook', `Opening ${cookbook.title}`);
              }}
            >
              <Image
                source={{ uri: cookbook.image_url }}
                style={styles.cookbookImage}
                defaultSource={{ uri: 'https://via.placeholder.com/140x100?text=Cookbook' }}
              />
              <Text style={styles.cookbookTitle} numberOfLines={2}>
                {cookbook.title}
              </Text>
              <Text style={styles.cookbookRecipeCount}>
                {cookbook.recipe_count || 0} recipes
              </Text>
              {cookbook.category && (
                <View style={styles.cookbookCategory}>
                  <Text style={styles.cookbookCategoryText}>
                    {cookbook.category}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  welcomeSection: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#BFDBFE',
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionCardText: {
    flex: 1,
    marginLeft: 16,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: colors.secondary,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  recipeContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: colors.secondary,
    marginLeft: 4,
  },
  cookbooksRow: {
    marginBottom: 16,
  },
  cookbooksRowContent: {
    paddingRight: 16,
  },
  cookbookCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginRight: 16,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cookbookImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cookbookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    padding: 12,
    paddingBottom: 4,
  },
  cookbookRecipeCount: {
    fontSize: 12,
    color: colors.secondary,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  cookbookCategory: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  cookbookCategoryText: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});