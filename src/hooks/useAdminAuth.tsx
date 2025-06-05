
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'moderator';
  is_active: boolean;
  last_login: string | null;
}

interface AdminSession {
  id: string;
  admin_user_id: string;
  session_token: string;
  expires_at: string;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (sessionError || !sessionData) {
        localStorage.removeItem('admin_session_token');
        setLoading(false);
        return;
      }

      setSession(sessionData);
      setAdminUser(sessionData.admin_users);
    } catch (error) {
      console.error('Error checking admin session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_session_token', data.session_token);
        setSession(data.session);
        setAdminUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (sessionToken) {
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'logout', session_token: sessionToken }
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('admin_session_token');
      setSession(null);
      setAdminUser(null);
    }
  };

  const hasPermission = (requiredRole: 'super_admin' | 'admin' | 'editor' | 'moderator') => {
    if (!adminUser) return false;
    
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'editor': 2,
      'moderator': 1
    };

    return roleHierarchy[adminUser.role] >= roleHierarchy[requiredRole];
  };

  return {
    adminUser,
    session,
    loading,
    signIn,
    signOut,
    hasPermission,
    isAuthenticated: !!adminUser
  };
};
