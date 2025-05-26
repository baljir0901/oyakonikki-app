
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  setIsAuthenticated: (value: boolean) => void;
  setUserType: (type: 'parent' | 'child') => void;
  userType: 'parent' | 'child';
}

export const AuthForm = ({ setIsAuthenticated, setUserType, userType }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    toast({
      title: "ログイン成功",
      description: `${userType === 'parent' ? '保護者' : 'お子様'}としてログインしました`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 safe-area-inset">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            親子日記
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 font-medium">
            Oyako Nikki
          </CardDescription>
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
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="メールアドレスを入力"
                className="h-12 text-base"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                className="h-12 text-base"
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium">
              {isLogin ? 'ログイン' : '新規登録'}
            </Button>
            
            <Separator />
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full h-12 text-base"
            >
              {isLogin ? "アカウントをお持ちでない方は新規登録" : "すでにアカウントをお持ちの方はログイン"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
