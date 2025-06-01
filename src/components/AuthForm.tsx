import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "./auth/EmailAuthForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";
import { toast } from "sonner"; // Алдааны мессеж харуулахад зориулж sonner нэмсэн

interface AuthFormProps {
  setUserType: (type: "parent" | "child") => void;
  userType: "parent" | "child";
}

export const AuthForm = ({ setUserType, userType }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  // Алдаа боловсруулалт нэмсэн handleEmailAuth
  const handleEmailAuth = async (
    email: string,
    password: string,
    isLogin: boolean
  ) => {
    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        toast.success("ログインに成功しました！"); // Амжилттай нэвтрэлтийн мессеж
        return result;
      } else {
        const result = await signUpWithEmail(email, password);
        toast.success("アカウント登録に成功しました！"); // Амжилттай бүртгэлийн мессеж
        return result;
      }
    } catch (error) {
      // Алдааны мессеж харуулах
      toast.error(
        isLogin
          ? "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。"
          : "アカウント登録に失敗しました。もう一度お試しください。"
      );
      console.error(error);
      throw error; // Алдааг цааш дамжуулах
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 safe-area-inset font-japanese">
      <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            親子日記
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
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
              className="flex-1 h-12 rounded-full text-base font-medium"
            >
              <Users className="w-5 h-5 mr-2" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === "child" ? "default" : "outline"}
              onClick={() => setUserType("child")}
              className="flex-1 h-12 rounded-full text-base font-medium"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              お子様
            </Button>
          </div>

          {/* Mode-specific subtitle */}
          <div className="text-sm text-center text-gray-600 mt-2">
            {userType === "parent"
              ? "保護者の方はこちらからログイン・登録してください"
              : "お子様は保護者の招待後にこちらからログイン"}
          </div>

          {/* Social Auth */}
          <SocialAuthButtons onGoogleAuth={signInWithGoogle} />

          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">
                または
              </span>
            </div>
          </div>

          {/* Email Form */}
          <EmailAuthForm isLogin={isLogin} onEmailAuth={handleEmailAuth} />

          <Separator />

          {/* Toggle Link */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full h-12 text-base"
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