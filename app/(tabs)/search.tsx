import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors'; // Relative import

export default function SearchScreen(): JSX.Element {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      <Text style={[styles.subtitle, { color: colors.secondary }]}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
});