
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Sun } from "lucide-react";

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
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center">
            <Sun className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-orange-800 mb-2">
            親子日記
          </h1>
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-sm">家族の思い出を残そう</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
        </div>

        <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">
              おかえりなさい
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              アカウントにログインしてください
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {/* Social Login */}
            <SocialAuthButtons onGoogleAuth={handleGoogleAuth} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">または</span>
              </div>
            </div>

            {/* Email Login */}
            <EmailAuthForm
              isLogin={isLogin}
              onEmailAuth={handleEmailAuth}
              onResetPassword={handleResetPassword}
              onToggleMode={toggleMode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
