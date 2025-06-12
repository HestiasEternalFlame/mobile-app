import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingComponent() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});