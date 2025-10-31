// Fallback authentication for development when Firebase is offline
interface FallbackUser {
  uid: string;
  email: string;
  displayName: string | null;
}

const FALLBACK_ADMIN_USER: FallbackUser = {
  uid: 'fallback-admin-001',
  email: 'admin@careerpath.lk',
  displayName: 'Admin User (Fallback)'
};

const FALLBACK_TEST_USER: FallbackUser = {
  uid: 'fallback-test-001', 
  email: 'test@careerpath.lk',
  displayName: 'Test User (Fallback)'
};

// Storage keys
const FALLBACK_USER_KEY = 'careerpath_fallback_user';
const FALLBACK_AUTH_ENABLED_KEY = 'careerpath_fallback_auth_enabled';

export class FallbackAuth {
  // Check if fallback auth is enabled
  static isEnabled(): boolean {
    return localStorage.getItem(FALLBACK_AUTH_ENABLED_KEY) === 'true';
  }

  // Enable fallback auth (for development)
  static enable(): void {
    localStorage.setItem(FALLBACK_AUTH_ENABLED_KEY, 'true');
    console.log('🔧 Fallback authentication enabled for development');
  }

  // Disable fallback auth
  static disable(): void {
    localStorage.removeItem(FALLBACK_AUTH_ENABLED_KEY);
    localStorage.removeItem(FALLBACK_USER_KEY);
    console.log('🔧 Fallback authentication disabled');
  }

  // Login as admin (for testing)
  static loginAsAdmin(): FallbackUser {
    if (!this.isEnabled()) {
      throw new Error('Fallback auth is not enabled');
    }
    localStorage.setItem(FALLBACK_USER_KEY, JSON.stringify(FALLBACK_ADMIN_USER));
    console.log('🔧 Logged in as fallback admin user');
    return FALLBACK_ADMIN_USER;
  }

  // Login as test user
  static loginAsTestUser(): FallbackUser {
    if (!this.isEnabled()) {
      throw new Error('Fallback auth is not enabled');
    }
    localStorage.setItem(FALLBACK_USER_KEY, JSON.stringify(FALLBACK_TEST_USER));
    console.log('🔧 Logged in as fallback test user');
    return FALLBACK_TEST_USER;
  }

  // Logout fallback user
  static logout(): void {
    localStorage.removeItem(FALLBACK_USER_KEY);
    console.log('🔧 Fallback user logged out');
  }

  // Get current fallback user
  static getCurrentUser(): FallbackUser | null {
    if (!this.isEnabled()) {
      return null;
    }
    
    const userJson = localStorage.getItem(FALLBACK_USER_KEY);
    if (!userJson) {
      return null;
    }
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  // Check if current user is admin
  static isCurrentUserAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.email === 'admin@careerpath.lk';
  }
}

// Development helper functions (available in console)
if (typeof window !== 'undefined') {
  (window as any).fallbackAuth = {
    enable: () => FallbackAuth.enable(),
    disable: () => FallbackAuth.disable(),
    loginAsAdmin: () => FallbackAuth.loginAsAdmin(),
    loginAsTestUser: () => FallbackAuth.loginAsTestUser(),
    logout: () => FallbackAuth.logout(),
    getCurrentUser: () => FallbackAuth.getCurrentUser(),
    isEnabled: () => FallbackAuth.isEnabled(),
  };
  
  console.log('🔧 Fallback auth helpers available: window.fallbackAuth');
}

export default FallbackAuth;