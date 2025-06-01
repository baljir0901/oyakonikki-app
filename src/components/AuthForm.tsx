import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EmailAuthFormProps {
  isLogin: boolean;
  onEmailAuth: (email: string, password: string, isLogin: boolean) => Promise<void>;
}

export const EmailAuthForm = ({ isLogin, onEmailAuth }: EmailAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await onEmailAuth(email, password, isLogin);
    } catch (error: any) {
      setErrorMessage(error?.message || "エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* メールアドレス */}
      <div>
        <Label htmlFor="email" className="text-sm text-gray-700">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          placeholder="メールアドレスを入力してください"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {/* パスワード */}
      <div>
        <Label htmlFor="password" className="text-sm text-gray-700">パスワード</Label>
        <Input
          id="password"
          type="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {/* エラー表示 */}
      {errorMessage && (
        <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
      )}

      {/* ログイン / 新規登録ボタン */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold rounded-full transition duration-200"
      >
        {isLoading ? "処理中..." : isLogin ? "ログイン" : "新規登録"}
      </Button>
    </form>
  );
};
