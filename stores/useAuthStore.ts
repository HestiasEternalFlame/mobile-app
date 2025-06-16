// stores/useAuthStore.ts
import { create } from 'zustand';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  name?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user: AuthUser | null) => {
    console.log('Setting user in store:', user ? user.email : 'null');
    set({
      user,
      accessToken: user ? 'firebase-authenticated' : null,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      console.log('Logging out user...');
      await signOut(auth);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  loadToken: async () => {
    const currentState = get();
    if (currentState.isLoading) {
      setTimeout(() => {
        const state = get();
        if (state.isLoading) {
          console.log('No auth state change detected, setting loading to false');
          set({ isLoading: false });
        }
      }, 3000);
    }
  },

  initializeAuth: () => {
    console.log('Initializing Firebase auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            ...userData
          };

          console.log('Setting authenticated user:', authUser.email);
          get().setUser(authUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || ''
          };
          get().setUser(authUser);
        }
      } else {
        console.log('No user authenticated, clearing user state');
        get().setUser(null);
      }
    });
    
    console.log('Firebase auth listener initialized');
    return unsubscribe;
  },
}));