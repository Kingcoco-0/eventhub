import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Convert Supabase user to our User type with timeout
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!supabaseUser) return null;

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 5000);
      });

      // Race between the database query and timeout
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        console.warn('Error fetching user profile, using auth metadata:', error);
        // Fallback to auth metadata immediately
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: supabaseUser.user_metadata?.first_name || 'User',
          lastName: supabaseUser.user_metadata?.last_name || '',
          avatar: supabaseUser.user_metadata?.avatar_url,
          createdAt: new Date(supabaseUser.created_at),
        };
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || 'User',
        lastName: profile.last_name || '',
        avatar: profile.avatar_url,
        createdAt: new Date(profile.created_at),
      };
    } catch (error) {
      console.warn('Error converting user, using fallback:', error);
      // Always provide a fallback user object
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName: supabaseUser.user_metadata?.first_name || 'User',
        lastName: supabaseUser.user_metadata?.last_name || '',
        avatar: supabaseUser.user_metadata?.avatar_url,
        createdAt: new Date(supabaseUser.created_at),
      };
    }
  };

  // Initialize auth state with faster timeout
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Add timeout to initial auth check
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), 3000);
        });

        const authPromise = supabase.auth.getUser();
        const { data: { user: supabaseUser } } = await Promise.race([authPromise, timeoutPromise]);
        
        if (mounted) {
          if (supabaseUser) {
            const user = await convertSupabaseUser(supabaseUser);
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: !!user,
            });
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        }
      } catch (error) {
        console.warn('Auth initialization timeout or error:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with faster response
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          // Set authenticated state immediately, then fetch profile
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true,
          }));

          // Fetch user profile in background
          const user = await convertSupabaseUser(session.user);
          if (mounted) {
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: !!user,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Add timeout to sign in
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Sign in timeout - please check your connection')), 10000);
      });

      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const { data, error } = await Promise.race([signInPromise, timeoutPromise]);

      if (error) {
        console.error('Sign in error:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to sign in' 
        };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Failed to sign in' };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection timeout - please try again' 
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Add timeout to sign up
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Sign up timeout - please check your connection')), 10000);
      });

      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);

      if (error) {
        console.error('Sign up error:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to create account' 
        };
      }

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          return { 
            success: true, 
            error: 'Please check your email to confirm your account' 
          };
        }
        
        return { success: true };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection timeout - please try again' 
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};