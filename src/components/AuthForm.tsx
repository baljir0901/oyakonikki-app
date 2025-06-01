import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "./auth/EmailAuthForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";

interface AuthFormProps {
  setUserType: (type: "parent" | "child") => void;
  userType: "parent" | "child";
}

export const AuthForm = ({ setUserType, userType }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const handleEmailAuth = async (
    email: string,
    password: string,
    isLogin: boolean
  ) => {
    if (isLogin) {
      return await signInWithEmail(email, password);
    } else {
      return await signUpWithEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4 font-japanese">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl bg-white">
        {/* Header */}
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold text-gray-800 mb-1">
            👨‍👧 親子日記
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            心をつなぐ日記の時間
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode Tabs */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant={userType === "parent" ? "default" : "outline"}
              onClick={() => setUserType("parent")}
              className={`flex-1 h-12 rounded-full text-base font-medium ${
                userType === "parent" ? "bg-purple-100 text-purple-800" : ""
              }`}
            >
              👨‍👧 保護者
            </Button>
            <Button
              type="button"
              variant={userType === "child" ? "default" : "outline"}
              onClick={() => setUserType("child")}
              className={`flex-1 h-12 rounded-full text-base font-medium ${
                userType === "child" ? "bg-purple-100 text-purple-800" : ""
              }`}
            >
              👧 お子様
            </Button>
          </div>

          {/* Subtitle */}
          <div className="text-sm text-center text-gray-600 mt-1">
            {userType === "parent"
              ? "保護者の方はこちらからログイン・登録してください"
              : "お子様は保護者の招待後にログインしてください"}
          </div>

          {/* Social Login */}
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />

          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">または</span>
            </div>
          </div>

          {/* Email Auth Form */}
          <EmailAuthForm
            isLogin={isLogin}
            onEmailAuth={handleEmailAuth}
          />

          {/* Separator */}
          <Separator />

          {/* Mode Toggle */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-12 text-base"
          >
            {isLogin
              ? "🌱 アカウントをお持ちでない方は新規登録"
              : "🔐 すでにアカウントをお持ちの方はログイン"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
