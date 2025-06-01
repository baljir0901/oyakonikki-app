import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "./auth/EmailAuthForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";
import { toast } from "sonner";

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
    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        toast.success("ログインに成功しました！", { duration: 3000 });
        return result;
      } else {
        const result = await signUpWithEmail(email, password);
        toast.success("アカウント登録に成功しました！", { duration: 3000 });
        return result;
      }
    } catch (error) {
      toast.error(
        isLogin
          ? "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。"
          : "アカウント登録に失敗しました。もう一度お試しください。",
        { duration: 4000 }
      );
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-japanese">
      <Card className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            親子日記
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            毎日の物語で心をつなぐ
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode Tabs */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant={userType === "parent" ? "default" : "outline"}
              onClick={() => setUserType("parent")}
              className="flex-1 h-10 rounded-md text-sm font-medium bg-green-200 hover:bg-green-300 text-gray-800"
            >
              <Users className="w-4 h-4 mr-1 text-green-600" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === "child" ? "default" : "outline"}
              onClick={() => setUserType("child")}
              className="flex-1 h-10 rounded-md text-sm font-medium bg-pink-200 hover:bg-pink-300 text-gray-800"
            >
              <BookOpen className="w-4 h-4 mr-1 text-pink-600" />
              お子様
            </Button>
          </div>

          {/* Mode-specific subtitle */}
          <div className="text-xs text-center text-gray-600 mt-1">
            {userType === "parent"
              ? "保護者の方はこちらからログイン・登録してください"
              : "お子様は保護者の招待後にこちらからログイン"}
          </div>

          {/* Social Auth */}
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">または</span>
            </div>
          </div>

          {/* Email Form */}
          <EmailAuthForm 
            isLogin={isLogin} 
            onEmailAuth={handleEmailAuth} 
            loginButtonClass="bg-gray-900 hover:bg-gray-800 text-white rounded-md" // Логин товчлуур хар өнгөтэй
          />

          <Separator className="bg-gray-200" />

          {/* Toggle Link - Дизайн сайжруулсан */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-8 text-sm text-pink-500 hover:text-pink-700 underline underline-offset-2 transition-colors duration-200"
          >
            {isLogin
              ? "アカウントをお持ちでない方は新規登録"
              : "すでにアカウントをお持ちの方はログイン"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};