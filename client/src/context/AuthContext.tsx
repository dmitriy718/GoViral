import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { getUserProfile } from '@/lib/api';

interface DbUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = async () => {
    try {
      const profile = await getUserProfile();
      setDbUser(profile);
    } catch (error) {
      console.error("Failed to fetch DB profile", error);
      // Don't toast here to avoid spam on initial load if backend is down
    }
  };

  useEffect(() => {
    // Set persistence to LOCAL so users stay logged in across refresh
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            await fetchDbUser();
          } else {
            setDbUser(null);
          }
          setLoading(false);
        });
        return unsubscribe;
      })
      .catch((error) => {
        console.error("Auth persistence error:", error);
        setLoading(false);
      });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome back, ${result.user.displayName}!`);
    } catch (error) {
      console.error("Login failed:", error);
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // fetchDbUser will be triggered by onAuthStateChanged
      toast.success('Welcome back!');
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      toast.success('Account created successfully! Please check your email.');
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDbUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      // Log error but don't expose to user purely
      console.error("Logout failed", error);
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, signInWithGoogle, loginWithEmail, signupWithEmail, logout, refreshProfile: fetchDbUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
