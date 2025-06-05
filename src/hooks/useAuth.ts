import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { getAuthRedirectUrl } from '@/config/domains';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "ログイン成功",
        description: "ようこそ！",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast({
        title: "エラー",
        description: "ログインに失敗しました",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      });

      if (error) throw error;

      toast({
        title: "登録完了",
        description: "確認メールを送信しました。メールをご確認ください。",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast({
        title: "エラー",
        description: "登録に失敗しました",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      toast({
        title: "エラー",
        description: "Googleログインに失敗しました",
        variant: "destructive",
      });
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl('/auth/reset-password'),
      });

      if (error) throw error;

      toast({
        title: "パスワードリセット",
        description: "パスワードリセット用のメールを送信しました",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast({
        title: "エラー",
        description: "パスワードリセットに失敗しました",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "ログアウト完了",
        description: "またお会いしましょう！",
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
  };
};
