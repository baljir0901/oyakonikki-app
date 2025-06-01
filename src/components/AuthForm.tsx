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
    <div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-teal-50 flex items-center justify-center p-4 font-japanese"
      style={{
        backgroundImage: "url('https://example.com/sakura-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
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
              className="flex-1 h-12 rounded-full text-base font-medium bg-teal-100 hover:bg-teal-200 text-gray-800"
            >
              <Users className="w-5 h-5 mr-2 text-teal-600" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === "child" ? "default" : "outline"}
              onClick={() => setUserType("child")}
              className="flex-1 h-12 rounded-full text-base font-medium bg-pink-100 hover:bg-pink-200 text-gray-800"
            >
              <BookOpen className="w-5 h-5 mr-2 text-pink-600" />
              お子様
            </Button>
          </div>

          {/* Mode-specific subtitle */}
          <div className="text-sm text-center text-gray-700 mt-2">
            {userType === "parent"
              ? "保護者の方はこちらからログイン・登録してください"
              : "お子様は保護者の招待後にこちらからログイン"}
          </div>

          {/* Social Auth */}
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-gray-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">または</span>
            </div>
          </div>

          {/* Email Form */}
          <EmailAuthForm 
            isLogin={isLogin} 
            onEmailAuth={handleEmailAuth} 
            loginButtonClass="bg-sakura hover:bg-sakura-hover text-white" // Логин товчлуурын шинэ класс
          />

          <Separator className="bg-gray-300" />

          {/* Toggle Link - Дизайн сайжруулсан */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-10 text-sm text-rose-600 hover:text-rose-800 underline underline-offset-2 transition-colors duration-300"
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