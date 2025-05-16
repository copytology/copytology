
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChangeProcessed, setAuthChangeProcessed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;

        // Simple state updates first, no navigation yet
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthChangeProcessed(true);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      setAuthChangeProcessed(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  // Handle navigation in a separate effect to avoid loops
  useEffect(() => {
    // Skip if auth changes haven't been processed yet or still loading initial state
    if (!authChangeProcessed || loading) return;
    
    // Get the current path without query params
    const currentPath = location.pathname;
    
    if (session?.user) {
      // User is signed in
      if (currentPath === '/login' || currentPath === '/register') {
        // Only show the toast once when they sign in from login/register pages
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
          
        // Get the intended destination or default to dashboard
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    } else if (authChangeProcessed && !loading && !session) {
      // User is signed out, but only navigate if they're on a protected route
      if (currentPath !== '/' && 
          currentPath !== '/login' && 
          currentPath !== '/register' &&
          currentPath !== '/about') {
        
        toast({
          title: "Signed out successfully",
          description: "See you soon!",
        });
        
        // Navigate to home page
        navigate('/', { replace: true });
      }
    }
  }, [authChangeProcessed, session, loading, navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      // No need to navigate here, the onAuthStateChange will handle it
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          },
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email for verification instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // No need to navigate here, the onAuthStateChange will handle it
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
