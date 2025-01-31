import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/floor';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers = {
  admin: {
    id: 'admin-demo',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  } as User,
  employee: {
    id: 'employee-demo',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee'
  } as User
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Demo authentication logic
    if (email === 'admin@example.com' && password === 'admin123') {
      setUser(demoUsers.admin);
      return;
    } else if (email === 'employee@example.com' && password === 'employee123') {
      setUser(demoUsers.employee);
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