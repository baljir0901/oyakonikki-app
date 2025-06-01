
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "./auth/EmailAuthForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";

interface AuthFormProps {
  setIsAuthenticated: (value: boolean) => void;
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

  return (
    // <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 safe-area-inset font-japanese">
    //   <Card className="w-full max-w-md mx-auto">
    //     <CardHeader className="text-center pb-4">
    //       <div className="flex justify-center mb-4">
    //         <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
    //           <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            親子日記
          </CardTitle>
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "./auth/EmailAuthForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";

interface AuthFormProps {
  setIsAuthenticated: (value: boolean) => void;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 safe-area-inset font-japanese">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            親子日記
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            毎日の物語で心をつなぐ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant={userType === 'parent' ? 'default' : 'outline'}
              onClick={() => setUserType('parent')}
              className="flex-1 h-12 text-base"
            >
              <Users className="w-5 h-5 mr-2" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === 'child' ? 'default' : 'outline'}
              onClick={() => setUserType('child')}
              className="flex-1 h-12 text-base"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              お子様
            </Button>
          </div>
          
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />
          
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">または</span>
            </div>
          </div>
          
          <EmailAuthForm 
            isLogin={isLogin}
            onEmailAuth={handleEmailAuth}
          />
          
          <Separator />
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-12 text-base"
          >
            {isLogin ? "アカウントをお持ちでない方は新規登録" : "すでにアカウントをお持ちの方はログイン"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
          <p className="text-sm text-gray-500 mt-2">
            毎日の物語で心をつなぐ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant={userType === 'parent' ? 'default' : 'outline'}
              onClick={() => setUserType('parent')}
              className="flex-1 h-12 text-base"
            >
              <Users className="w-5 h-5 mr-2" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === 'child' ? 'default' : 'outline'}
              onClick={() => setUserType('child')}
              className="flex-1 h-12 text-base"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              お子様
            </Button>
          </div>
          
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />
          
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">または</span>
            </div>
          </div>
          
          <EmailAuthForm 
            isLogin={isLogin}
            onEmailAuth={handleEmailAuth}
          />
          
          <Separator />
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-12 text-base"
          >
            {isLogin ? "アカウントをお持ちでない方は新規登録" : "すでにアカウントをお持ちの方はログイン"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
