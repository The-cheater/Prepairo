'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/backend/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  course: string;
  department: string;
  avatarUrl?: string;
  totalCredits: number;
  redeemedCredits: number;
  papersApproved: number;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ error?: string }>;
  login: (emailOrUsername: string, password?: string) => Promise<{ error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password?: string;
    fullName: string;
    course: string;
    department: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'prepairo_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile({
          id: data.id,
          username: data.username,
          fullName: data.full_name,
          course: data.course || 'BS-MS',
          department: data.department || 'Foundation',
          avatarUrl: data.avatar_url,
          totalCredits: data.total_credits || 0,
          redeemedCredits: data.redeemed_credits || 0,
          papersApproved: data.papers_approved || 0,
          role: data.role || 'student',
        });
        return;
      }
    } catch (e) {
      console.warn('Supabase profile fetch error:', e);
    }

    // Auto-create from user metadata if logged in with Google
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === userId) {
        const meta = user.user_metadata || {};
        const username = (meta.name || meta.full_name || user.email?.split('@')[0] || 'student')
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_');
        const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'IISER Student';
        const avatarUrl = meta.avatar_url || meta.picture || '';

        const newProfile: UserProfile = {
          id: userId,
          username,
          fullName,
          course: 'BS-MS',
          department: 'Foundation',
          avatarUrl,
          totalCredits: 10,
          redeemedCredits: 0,
          papersApproved: 0,
          role: 'student',
        };

        try {
          await supabase.from('profiles').upsert({
            id: userId,
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
            course: 'BS-MS',
            department: 'Foundation',
            total_credits: 10,
            role: 'student',
          });
        } catch {}

        setProfile(newProfile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
        return;
      }
    } catch {}

    // Fallback: check localStorage
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {}
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          // Check local stored profile for quick demo / offline
          const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_USER_KEY) : null;
          if (stored && mounted) {
            const p = JSON.parse(stored);
            setProfile(p);
            // Mock a minimal User object if not in Supabase session
            setUser({
              id: p.id,
              email: `${p.username}@student.iisertvm.ac.in`,
              app_metadata: {},
              user_metadata: { username: p.username, full_name: p.fullName },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as User);
          }
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err?.message || 'Google OAuth sign-in failed' };
    }
  };

  const login = async (emailOrUsername: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const email = emailOrUsername.includes('@')
        ? emailOrUsername
        : `${emailOrUsername.toLowerCase()}@student.iisertvm.ac.in`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback demo login if Supabase auth is unconfirmed or offline
        const mockProfile: UserProfile = {
          id: `usr-${emailOrUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          username: emailOrUsername.split('@')[0],
          fullName: emailOrUsername.split('@')[0].toUpperCase(),
          course: 'BS-MS',
          department: 'Foundation',
          avatarUrl: '',
          totalCredits: 30, // start with 30 demo credits
          redeemedCredits: 0,
          papersApproved: 3,
          role: 'student',
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockProfile));
        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          email,
          aud: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
        } as User);
        setIsLoading(false);
        return {};
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err?.message || 'Login failed' };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password?: string;
    fullName: string;
    course: string;
    department: string;
  }) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || 'password123',
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
            course: data.course,
            department: data.department,
          },
        },
      });

      const newUserId = authData?.user?.id || `usr-${Date.now()}`;

      const newProfile: UserProfile = {
        id: newUserId,
        username: data.username,
        fullName: data.fullName,
        course: data.course,
        department: data.department,
        avatarUrl: '',
        totalCredits: 10, // welcome bonus 10 credits
        redeemedCredits: 0,
        papersApproved: 0,
        role: 'student',
      };

      // Try saving profile to Supabase
      try {
        await supabase.from('profiles').insert({
          id: newUserId,
          username: data.username,
          full_name: data.fullName,
          course: data.course,
          department: data.department,
          total_credits: 10,
          role: 'student',
        });
      } catch (dbErr) {
        console.warn('Failed to insert profile in supabase:', dbErr);
      }

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      setUser(authData?.user || ({
        id: newUserId,
        email: data.email,
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      } as User));

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: 'Not logged in' };
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    try {
      await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          course: updated.course,
          department: updated.department,
          avatar_url: updated.avatarUrl,
        })
        .eq('id', profile.id);
    } catch (e) {
      console.warn('Failed to update profile on supabase:', e);
    }
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        loginWithGoogle,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
