// app/(tabs)/cookbooks.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function CookbooksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cookbooks</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});

// app/(tabs)/recipes.tsx
// Same structure for recipes screen

// app/(tabs)/search.tsx  
// Same structure for search screen