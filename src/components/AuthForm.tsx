
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
  setIsAuthenticated: (authenticated: boolean) => void;
  setUserType: (type: 'parent' | 'child') => void;
  userType: 'parent' | 'child';
}

export const AuthForm = ({ setIsAuthenticated, setUserType, userType }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const handleEmailAuth = async (email: string, password: string, isLogin: boolean) => {
    if (isLogin) {
      return await signInWithEmail(email, password);
    } else {
      return await signUpWithEmail(email, password);
    }
  };

  const handleGoogleAuth = async () => {
    return await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-japanese p-4">
      <div className="w-full max-w-md">
        {/* Header - No logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">親子日記</h1>
          <p className="text-gray-600 text-base leading-relaxed px-4">家族の思い出を残そう</p>
        </div>

        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">
              {isLogin ? 'ログイン' : '新規登録'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            {!isLogin && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">アカウントタイプ</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={userType === 'parent' ? 'default' : 'outline'}
                    onClick={() => setUserType('parent')}
                    className="h-12 bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200"
                  >
                    保護者
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'child' ? 'default' : 'outline'}
                    onClick={() => setUserType('child')}
                    className="h-12 bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200"
                  >
                    子ども
                  </Button>
                </div>
              </div>
            )}

            {/* Social Authentication */}
            <SocialAuthButtons onGoogleAuth={handleGoogleAuth} />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            {/* Email Authentication */}
            <EmailAuthForm 
              isLogin={isLogin}
              onEmailAuth={handleEmailAuth}
            />

            {/* Toggle between login and signup */}
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                {isLogin ? '新規アカウントを作成' : 'ログインはこちら'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
