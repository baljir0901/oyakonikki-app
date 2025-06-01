
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const LineCallback = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleLineCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`LINE Login error: ${error}`);
        }

        if (!code) {
          throw new Error('認証コードが見つかりません');
        }

        // Verify state parameter
        const storedState = localStorage.getItem('line_auth_state');
        if (state !== storedState) {
          throw new Error('認証状態が一致しません');
        }

        // Clear stored state
        localStorage.removeItem('line_auth_state');

        console.log('Processing LINE callback with code:', code);

        // Call our edge function to handle the LINE authentication
        const { data, error: functionError } = await supabase.functions.invoke('line-auth', {
          body: {
            code: code,
            redirectUri: `${window.location.origin}/auth/line/callback`
          }
        });

        if (functionError) {
          console.error('Supabase function error:', functionError);
          throw new Error('LINEログイン処理に失敗しました');
        }

        if (!data.success) {
          throw new Error(data.error || 'LINEログインに失敗しました');
        }

        console.log('LINE authentication successful:', data.user);

        // If we have a Supabase session, set it
        if (data.supabaseSession && data.supabaseSession.properties) {
          const { access_token, refresh_token } = data.supabaseSession.properties;
          
          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });

            if (sessionError) {
              console.error('Failed to set Supabase session:', sessionError);
              throw new Error('セッションの設定に失敗しました');
            }
            
            console.log('Supabase session set successfully');
          }
        }

        toast({
          title: "ログイン成功",
          description: `${data.user.name}さん、おかえりなさい！`,
        });

        // Redirect to main app
        navigate('/');

      } catch (error) {
        console.error('LINE callback error:', error);
        toast({
          title: "ログインエラー",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleLineCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center font-japanese">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">LINEログイン処理中...</p>
        </div>
      </div>
    );
  }

  return null;
};
