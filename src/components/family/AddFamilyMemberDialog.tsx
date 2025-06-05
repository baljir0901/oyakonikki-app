import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface AddFamilyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, role: 'parent' | 'child', name: string) => void;
}

export const AddFamilyMemberDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}: AddFamilyMemberDialogProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!email.trim() || !name.trim()) {
      toast({
        title: "入力エラー",
        description: "メールアドレスと名前を入力してください",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "入力エラー",
        description: "有効なメールアドレスを入力してください",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      onSubmit(email, role, name);
      setEmail('');
      setName('');
      setRole('child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            家族メンバーを追加
          </DialogTitle>
          <DialogDescription>
            新しい家族メンバーの情報を入力してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="taro@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>メンバータイプ</Label>
            <RadioGroup value={role} onValueChange={(value: 'parent' | 'child') => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parent" id="parent" />
                <Label htmlFor="parent">親</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="child" id="child" />
                <Label htmlFor="child">子</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "処理中..." : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
