
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetPassword: (email: string) => Promise<{ data: any; error: any }>;
}

export const ForgotPasswordDialog = ({ 
  open, 
  onOpenChange, 
  onResetPassword 
}: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "エラー",
        description: "メールアドレスを入力してください",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await onResetPassword(email);
      
      if (error) {
        toast({
          title: "エラー",
          description: "パスワードリセットメールの送信に失敗しました",
          variant: "destructive",
        });
      } else {
        setResetSent(true);
        toast({
          title: "メール送信完了",
          description: "パスワードリセット用のメールを送信しました。メールをご確認ください。",
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

  const handleClose = () => {
    setEmail("");
    setResetSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            パスワードリセット
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {resetSent 
              ? "パスワードリセット用のメールを送信しました。"
              : "登録したメールアドレスにパスワードリセット用のリンクを送信します。"
            }
          </DialogDescription>
        </DialogHeader>

        {!resetSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-base">
                メールアドレス
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "送信中..." : "リセットメールを送信"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                メールをご確認いただき、リンクをクリックしてパスワードを変更してください。
                メールが見つからない場合は、迷惑メールフォルダもご確認ください。
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              閉じる
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
