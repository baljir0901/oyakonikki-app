
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Sun, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4 font-japanese relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-32 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-orange-200/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-300/25 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl transform rotate-6 mx-auto">
              <div className="w-full h-full flex items-center justify-center">
                <Sun className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="absolute -inset-2 border border-amber-300/40 rounded-2xl animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 bg-clip-text text-transparent mb-2 tracking-tight">
            親子日記
          </h1>
          <div className="flex items-center justify-center gap-2 text-amber-700/80 mb-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">家族の思い出を残そう</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
        </div>

        <Card className="shadow-2xl rounded-3xl border-0 backdrop-blur-sm bg-white/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-amber-50/30 pointer-events-none"></div>
          
          <CardHeader className="text-center space-y-3 pb-6 relative">
            <CardTitle className="text-2xl font-bold text-amber-900 tracking-tight">
              {isLogin ? 'おかえりなさい' : 'はじめまして'}
            </CardTitle>
            <CardDescription className="text-amber-700/70 text-base leading-relaxed">
              {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成しましょう'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8 relative">
            {/* Social Login */}
            <SocialAuthButtons onGoogleAuth={handleGoogleAuth} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-amber-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 text-amber-600 font-medium rounded-full">または</span>
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
            <div className="text-center pt-4 border-t border-amber-100">
              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="text-amber-700 hover:text-amber-800 font-medium text-base relative group"
              >
                <span className="relative z-10">
                  {isLogin ? '新規アカウントを作成' : 'ログインはこちら'}
                </span>
                <div className="absolute inset-0 bg-amber-100/50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer message */}
        <div className="text-center mt-6">
          <p className="text-amber-700/60 text-sm leading-relaxed">
            親子の絆を深める<br />
            <span className="font-medium text-amber-800">特別な場所へようこそ</span>
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-15px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-8px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-20px) rotate(270deg); opacity: 0.7; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
