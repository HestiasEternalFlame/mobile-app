// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, useColorScheme, ActivityIndicator, View } from 'react-native';
import Colors from '@/constants/Colors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const queryClient = new QueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loadToken = useAuthStore((state) => state.loadToken);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const checkLogin = async () => {
      try {
        console.log('Initializing app authentication...');
        
        // Initialize Firebase auth listener
        unsubscribe = initializeAuth();
        
        // Load token (for compatibility with existing code)
        await loadToken();
        
        console.log('Authentication initialized successfully');
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up Firebase auth listener');
        unsubscribe();
      }
    };
  }, [initializeAuth, loadToken]);

  if (checkingAuth || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
        />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        >
          {!accessToken ? (
            <Stack.Screen name="login" options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="cookbookDetail/[cookbookId]" options={{ title: 'Cookbook', headerBackTitle: '' }} />
              <Stack.Screen name="recipeDetail/[recipeId]" options={{ title: 'Recipe', headerBackTitle: '' }} />
            </>
          )}
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}