import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({ 
    id: 'demo',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
    aud: 'authenticated',
    role: 'authenticated'
  } as User);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For demo purposes, we'll keep the demo user logged in
    if (window.location.pathname !== '/login') {
      setUser({ 
        id: 'demo',
        email: 'demo@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated'
      } as User);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === 'demo@example.com' && password === 'demo123') {
      setUser({ 
        id: 'demo',
        email: 'demo@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated'
      } as User);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
