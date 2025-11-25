import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth, checkFirebaseConnection } from "../firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import FallbackAuth from "../utils/fallbackAuth";

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
  loading: true,
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [fallbackUser, setFallbackUser] = useState<any>(null);

  // Enable fallback auth in development when Firebase has issues
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !FallbackAuth.isEnabled()) {
      FallbackAuth.enable();
    }
  }, []);

  useEffect(() => {
    // Check Firebase connection status
    const checkConnection = async () => {
      const connected = await checkFirebaseConnection();
      setIsFirebaseConnected(connected);

      // If Firebase is not connected, check for fallback user
      if (!connected) {
        const fallback = FallbackAuth.getCurrentUser();
        setFallbackUser(fallback);
      }
    };

    checkConnection();

    // Check for fallback user changes
    const checkFallbackUser = () => {
      const fallback = FallbackAuth.getCurrentUser();
      setFallbackUser(fallback);
    };

    // Listen for storage changes (fallback user changes)
    window.addEventListener("storage", checkFallbackUser);

    // Only subscribe if auth is initialized
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
          setLoading(false);
          if (user) {
            // Clear fallback user when Firebase user is available
            setFallbackUser(null);
          }
        },
        (error) => {
          console.error("Auth state change error:", error);
          setLoading(false);
          setIsFirebaseConnected(false);
          // Check for fallback user when Firebase fails
          const fallback = FallbackAuth.getCurrentUser();
          setFallbackUser(fallback);
        }
      );

      return () => {
        unsubscribe();
        window.removeEventListener("storage", checkFallbackUser);
      };
    } else {
      // If Firebase is not configured, check fallback and finish loading
      const fallback = FallbackAuth.getCurrentUser();
      setFallbackUser(fallback);
      setLoading(false);
      setIsFirebaseConnected(false);

      return () => {
        window.removeEventListener("storage", checkFallbackUser);
      };
    }
  }, []);

  const logout = async () => {
    try {
      // Clear fallback user first
      FallbackAuth.logout();
      setFallbackUser(null);

      // Only try to sign out if auth is initialized
      if (auth && isFirebaseConnected) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear the local state
      setCurrentUser(null);
      setFallbackUser(null);
    }
  };

  const loginAsFallbackAdmin = () => {
    try {
      const adminUser = FallbackAuth.loginAsAdmin();
      setFallbackUser(adminUser);
      console.log("🔧 Fallback admin login successful");
    } catch (error) {
      console.error("Fallback admin login failed:", error);
    }
  };

  // Use Firebase user if available, otherwise use fallback user
  const effectiveUser = currentUser || fallbackUser;
  const isFallbackMode = !isFirebaseConnected && !!fallbackUser;

  const value = {
    currentUser: effectiveUser,
    user: effectiveUser, // Alias for compatibility
    loading,
    logout,
    isFirebaseConnected,
    loginAsFallbackAdmin,
    isFallbackMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
