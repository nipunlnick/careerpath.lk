
import React, { useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    logout: () => Promise.resolve(),
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only subscribe if auth is initialized
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // If Firebase is not configured, treat user as logged out and finish loading
      setLoading(false);
    }
  }, []);
  
  const logout = () => {
    // Only try to sign out if auth is initialized
    return auth ? signOut(auth) : Promise.resolve();
  }

  const value = {
    currentUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}