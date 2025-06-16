import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Creating user account...');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('User account created, updating profile...');

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      console.log('User registration complete');
      Alert.alert('Success', 'Account created successfully!');
      
      // Clear form
      setEmail('');
      setPassword('');
      setName('');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Attempting to sign in user...');
      
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log('User signed in successfully');
      
      // Update last login
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          lastLogin: new Date().toISOString()
        }, { merge: true });
      }

      Alert.alert('Success', 'Logged in successfully!');
      
      // Clear form
      setEmail('');
      setPassword('');
      
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={isLogin ? handleLogin : handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => {
            setIsLogin(!isLogin);
            setEmail('');
            setPassword('');
            setName('');
          }}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});