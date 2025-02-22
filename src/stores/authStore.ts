import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, adminCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  signUp: async (email: string, password: string, adminCode?: string) => {
    const isAdmin = adminCode === 'adminTest0';
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          isAdmin,
        },
      },
    });
    if (error) throw error;
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ 
      user: data.user,
      isAdmin: data.user?.user_metadata?.isAdmin || false,
    });
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isAdmin: false });
  },
}));