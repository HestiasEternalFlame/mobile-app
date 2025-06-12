import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function RootLayout(): JSX.Element {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
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
          name="index" 
          options={{ 
            headerShown: false, // Hide header for splash screen
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="cookbook/[id]" 
          options={{ 
            title: 'Cookbook Details',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="recipe/[id]" 
          options={{ 
            title: 'Recipe Details',
            headerBackTitle: 'Back',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}