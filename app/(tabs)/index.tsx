import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useRecipe } from '@/hooks/useRecipe';

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
  TextInput,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
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
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
    prep_time: 20,
    servings: 24,
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { data: recipes } = useRecipe();

  const isLoadingRecipe = false;
  const errorRecipe = false;

  // Get Firebase user and logout function from auth store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled automatically by _layout.tsx
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };
      
  // State
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [featuredCookbooks, setFeaturedCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchActive = useAppStore((state) => state.isSearchActive);
  const setSearchActive = useAppStore((state) => state.setSearchActive);

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
      {/* Search */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search recipes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchActive(true)}
          autoFocus={false}
        />
      </View>

      {!isSearchActive ? (
          <>
            {/* User Profile Section */}
            {user && (
              <View style={styles.userSection}>
                <Text style={styles.userWelcome}>
                  Welcome back, {user.displayName || user.name || 'User'}!
                </Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                {user.lastLogin && (
                  <Text style={styles.lastLogin}>
                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

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
            </View>

            {/* Recent Recipes */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Recipes</Text>
                {isLoadingRecipe && <Text>Loading...</Text>}
                {errorRecipe && <Text>Error loading recipes</Text>}
                {recipes?.map(recipe => (
                  <Text key={recipe.id}>{recipe.title}</Text>
                ))}
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

            {/* Enhanced Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.searchResults}>
            <Text style={styles.searchTitle}>Search Results for "{searchQuery}"</Text>
            {/* TODO: Display search results */}
            <TouchableOpacity onPress={() => setSearchActive(false)}>
              <Text style={styles.cancelSearch}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

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
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  searchBar: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  searchResults: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cancelSearch: {
    marginTop: 16,
    color: colors.primary,
  },
  // User Profile Section Styles
  userSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userWelcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
  },
  lastLogin: {
    fontSize: 12,
    color: colors.secondary,
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
    marginTop: 16,
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
  // Enhanced Logout Button Styles
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});