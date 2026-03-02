import { User } from '@/types/types';
import { create } from 'zustand';

export interface AuthState {
  loading: boolean;
  setLoading: (loading:boolean) => void;
  user: null | User
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading }),
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user:null }),
}));
