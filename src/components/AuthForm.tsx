
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();

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

  const handleResetPassword = async (email: string) => {
    return await resetPassword(email);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-japanese">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">親子日記</CardTitle>
          <CardDescription className="text-sm text-gray-500 break-words">
            家族の思い出を残そう
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          <h2 className="text-center text-lg font-semibold text-gray-500">
            {isLogin ? 'ログイン' : '新規登録'}
          </h2>

          {/* Social Login */}
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

          {/* Email Login */}
          <EmailAuthForm
            isLogin={isLogin}
            onEmailAuth={handleEmailAuth}
            onResetPassword={handleResetPassword}
            onToggleMode={toggleMode}
          />

          {/* Switch mode */}
          <div className="text-center pt-4">
            <Button
              type="button"
              variant="link"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? '新規アカウントを作成' : 'ログインはこちら'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
