
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

interface EmailAuthFormProps {
  isLogin: boolean;
  onEmailAuth: (email: string, password: string, isLogin: boolean) => Promise<{ data: any; error: any }>;
  onResetPassword: (email: string) => Promise<{ data: any; error: any }>;
  onToggleMode: () => void;
}

export const EmailAuthForm = ({ 
  isLogin, 
  onEmailAuth, 
  onResetPassword,
  onToggleMode 
}: EmailAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check payment approval for registration
    if (!isLogin && !paymentApproved) {
      toast({
        title: "支払い承認が必要",
        description: "月額料金の支払いに同意してください",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await onEmailAuth(email, password, isLogin);
      
      if (error) {
        let errorMessage = "予期しないエラーが発生しました";
        let showAccountSuggestion = false;
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "メールアドレスまたはパスワードが正しくありません";
          showAccountSuggestion = true;
        } else if (error.message.includes("User already registered")) {
          errorMessage = "このメールアドレスは既に登録されています";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "パスワードは6文字以上で入力してください";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "メールアドレスの確認が完了していません";
        }
        
        toast({
          title: isLogin ? "ログインエラー" : "新規登録エラー",
          description: errorMessage,
          variant: "destructive",
          action: showAccountSuggestion && isLogin ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleMode}
              className="text-blue-600"
            >
              新規登録
            </Button>
          ) : undefined,
        });
      } else if (!isLogin) {
        toast({
          title: "新規登録完了",
          description: "アカウントが作成され、自動的にログインされました",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "予期しないエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-700">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            className="h-10 text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-gray-700">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="h-10 text-sm border-gray-300 rounded-md"
            required
          />
          {isLogin && (
            <div className="text-right">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
              >
                パスワードを忘れた方
              </Button>
            </div>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="payment-approval"
                  checked={paymentApproved}
                  onCheckedChange={(checked) => setPaymentApproved(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="payment-approval" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    月額料金の支払いに同意する
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    このアプリの月額料金は<span className="font-semibold text-blue-600">300円</span>です。
                    登録することで、毎月の支払いに同意したことになります。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition"
        >
          {loading ? "処理中..." : (isLogin ? "ログイン" : "新規登録")}
        </Button>
      </form>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onResetPassword={onResetPassword}
      />
    </>
  );
};
