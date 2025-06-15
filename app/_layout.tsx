import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>

      <SafeAreaProvider>
        <StatusBar 
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
        />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="cookbookDetail/[cookbookId]" 
            options={{ 
              title: 'Cookbook',
              headerBackTitle: ''
            }}
          />
          <Stack.Screen 
            name="recipeDetail/[recipeId]" 
            options={{ 
              title: 'Recipe',
              headerBackTitle: ''
            }} 
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}