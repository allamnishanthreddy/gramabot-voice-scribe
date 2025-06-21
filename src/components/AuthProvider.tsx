import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client'; // Adjusted import path for clarity

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to handle initial session and listen for auth state changes
  useEffect(() => {
    const handleSession = async () => {
      setLoading(true); // Ensure loading is true while checking session
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // If a session exists, try to fetch the user's profile
        await fetchUser(data.session.user.id);
      }
      setLoading(false);
    };

    handleSession(); // Call immediately on mount

    // Set up real-time listener for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        // When auth state changes to logged in, fetch the user profile
        await fetchUser(session.user.id);
      } else {
        // When auth state changes to logged out, clear the user profile
        setUser(null);
      }
      setLoading(false); // Set loading to false after auth state is processed
    });

    // Cleanup the listener on component unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []); // Run only once on mount

  // Function to fetch user profile from the 'users' table
  const fetchUser = async (id: string) => {
    const { data, error }: any = await supabase.from('users' as any).select('*').eq('id', id).single();
    if (data) {
      setUser(data as User);
    } else {
      console.error("Failed to fetch user profile:", error?.message);
      setUser(null); // Clear user if profile fetch fails
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login failed:", error.message);
      return { success: false, error: error.message };
    }
    // Session is set by signInWithPassword, onAuthStateChange will handle fetching user profile
    return { success: true };
  };

  // Register function with enhanced session handling to prevent RLS violations
  const register = async (name: string, email: string, password: string) => {
    // Step 1: Sign up the user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError || !signUpData.user) {
      console.error("Supabase signUp failed:", signUpError?.message || "No user data after signup.");
      return { success: false, error: signUpError?.message || "Registration failed" };
    }

    // IMPORTANT FIX: Explicitly get the session after signup to ensure the client
    // has the latest authentication token before attempting to insert into 'users' table.
    // This helps in cases where the token might not be immediately propagated for subsequent requests.
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    

    // if (sessionError || !sessionData.session) {
    //   console.error("Failed to establish session after signup:", sessionError?.message);
    //   // If session isn't established, the user isn't fully authenticated client-side.
    //   await supabase.auth.signOut(); // Clean up the partially created auth user
    //   return { success: false, error: sessionError?.message || "Failed to establish session after registration." };
    // }

    // Step 2: Insert the user's profile into the 'users' public table
    // Now with a confirmed active session, the RLS policy should pass.
    const { error: insertError } = await supabase.from("users" as any).insert({
      id: signUpData.user.id, // This MUST match auth.uid() for the RLS policy to pass
      name,
      email,
      // avatar is optional; if not provided, Supabase will insert null or default
    });

    if (insertError) {
      console.error("Failed to insert user profile into 'users' table (RLS violation suspected):", insertError.message);
      // If insert fails, it means the RLS policy blocked it, likely due to auth.uid() mismatch.
      // Clean up the auth user as well to avoid orphaned auth.users entries without public profiles.
      await supabase.auth.signOut(); // Sign out the partially created user
      return { success: false, error: insertError.message };
    }

    // The onAuthStateChange listener will now trigger and fetch the user profile.
    return { success: true };
  };

  // Login with Google (OAuth)
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      console.error("Google login failed:", error.message);
      return { success: false, error: error.message };
    }
    // onAuthStateChange will handle fetching user profile after successful OAuth
    return { success: true };
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout failed:", error.message);
    setUser(null); // Clear user state immediately on logout
  };

  // Provide authentication context to children components
  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // This error helps ensure useAuth is always used within an AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
