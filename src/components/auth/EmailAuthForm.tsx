
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface EmailAuthFormProps {
  isLogin: boolean;
  onEmailAuth: (email: string, password: string, isLogin: boolean) => Promise<{ data: any; error: any }>;
}

export const EmailAuthForm = ({ isLogin, onEmailAuth }: EmailAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [loading, setLoading] = useState(false);
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
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "メールアドレスまたはパスワードが正しくありません";
        } else if (error.message.includes("User already registered")) {
          errorMessage = "このメールアドレスは既に登録されています";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "パスワードは6文字以上で入力してください";
        }
        
        toast({
          title: isLogin ? "ログインエラー" : "新規登録エラー",
          description: errorMessage,
          variant: "destructive",
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
          className="h-12 text-base"
          required
        />
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
        className="w-full h-12 text-base font-medium"
        disabled={loading}
      >
        {loading ? "処理中..." : (isLogin ? 'ログイン' : '新規登録')}
      </Button>
    </form>
  );
};
