
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'email' | 'google';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate JWT token structure
interface SimulatedJWT {
  token: string;
  user: User;
  expiresAt: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate JWT token creation
  const createSimulatedJWT = (user: User): SimulatedJWT => {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };
    
    // Simulate JWT token (base64 encoded payload)
    const token = btoa(JSON.stringify(payload));
    
    return {
      token,
      user,
      expiresAt: payload.exp * 1000,
    };
  };

  // Validate simulated JWT
  const validateJWT = (jwtData: SimulatedJWT): boolean => {
    return Date.now() < jwtData.expiresAt;
  };

  // Simulate user database
  const getStoredUsers = (): Array<{ email: string; password: string; name: string }> => {
    const stored = localStorage.getItem('auth-users-db');
    return stored ? JSON.parse(stored) : [];
  };

  const addUserToStorage = (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    users.push({ email, password, name });
    localStorage.setItem('auth-users-db', JSON.stringify(users));
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate input
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Check if user already exists
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    // Store user credentials
    addUserToStorage(name, email, password);

    // Create and store JWT
    const jwtData = createSimulatedJWT(newUser);
    localStorage.setItem('auth-jwt', JSON.stringify(jwtData));

    setUser(newUser);
    return { success: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials
    if (email === 'demo@gramabot.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-1',
        name: 'Demo User',
        email,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const jwtData = createSimulatedJWT(demoUser);
      localStorage.setItem('auth-jwt', JSON.stringify(jwtData));
      setUser(demoUser);
      return { success: true };
    }

    // Check stored users
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const user: User = {
        id: Date.now().toString(),
        name: foundUser.name,
        email: foundUser.email,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const jwtData = createSimulatedJWT(user);
      localStorage.setItem('auth-jwt', JSON.stringify(jwtData));
      setUser(user);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful Google login
    const googleUser: User = {
      id: 'google-' + Date.now().toString(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: '🔵',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    const jwtData = createSimulatedJWT(googleUser);
    localStorage.setItem('auth-jwt', JSON.stringify(jwtData));
    setUser(googleUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-jwt');
  };

  // Check for stored JWT on mount
  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('auth-jwt');
      if (stored) {
        try {
          const jwtData: SimulatedJWT = JSON.parse(stored);
          if (validateJWT(jwtData)) {
            setUser(jwtData.user);
          } else {
            localStorage.removeItem('auth-jwt');
          }
        } catch (error) {
          localStorage.removeItem('auth-jwt');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      loginWithGoogle,
      logout, 
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
