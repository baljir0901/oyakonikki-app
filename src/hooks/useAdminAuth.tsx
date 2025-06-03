
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'moderator';
  is_active: boolean;
  last_login: string | null;
  two_factor_enabled: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        // Check if this user has an admin session
        const { data: adminSession } = await supabase
          .from('admin_sessions')
          .select(`
            admin_user_id,
            expires_at,
            admin_users!inner(
              id,
              email,
              full_name,
              role,
              is_active,
              last_login,
              two_factor_enabled
            )
          `)
          .eq('admin_user_id', session.session.user.id)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (adminSession?.admin_users) {
          setAdminUser(adminSession.admin_users as AdminUser);
        }
      }
    } catch (error) {
      console.log('No active admin session');
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      // First authenticate with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if this user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        throw new Error('Invalid admin credentials');
      }

      // Create admin session
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: authData.user.id,
          session_token: crypto.randomUUID(),
          expires_at: expiresAt.toISOString(),
          ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => null),
          user_agent: navigator.userAgent,
        });

      if (sessionError) throw sessionError;

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Log activity
      await supabase
        .from('admin_activity_log')
        .insert({
          admin_user_id: adminUser.id,
          action: 'login',
          resource_type: 'admin_session',
          details: { ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => null) },
        });

      setAdminUser(adminUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const adminLogout = async () => {
    try {
      if (adminUser) {
        // Delete admin session
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('admin_user_id', adminUser.id);

        // Log activity
        await supabase
          .from('admin_activity_log')
          .insert({
            admin_user_id: adminUser.id,
            action: 'logout',
            resource_type: 'admin_session',
          });
      }

      await supabase.auth.signOut();
      setAdminUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    adminUser,
    loading,
    checkSession,
    adminLogin,
    adminLogout,
  };
};
