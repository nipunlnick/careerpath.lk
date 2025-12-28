import React, { useContext, ReactNode } from "react";

// Mock User type to satisfy type requirements if needed, or just use any
type User = any;

interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Alias for compatibility
  loading: boolean;
  logout: () => Promise<void>;
  isFirebaseConnected: boolean;
  loginAsFallbackAdmin: () => void;
  isFallbackMode: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  user: null,
  loading: false,
  logout: () => Promise.resolve(),
  isFirebaseConnected: false,
  loginAsFallbackAdmin: () => {},
  isFallbackMode: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // No-op values for a completely public app
  const value = {
    currentUser: null,
    user: null,
    loading: false, // Always done loading
    logout: async () => {},
    isFirebaseConnected: false,
    loginAsFallbackAdmin: () => {},
    isFallbackMode: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
