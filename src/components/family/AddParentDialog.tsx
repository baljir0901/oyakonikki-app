
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddParentDialog = ({ open, onOpenChange, onSuccess }: AddParentDialogProps) => {
  const [parentEmail, setParentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddParent = async () => {
    if (!user || !parentEmail.trim()) {
      toast({
        title: "エラー",
        description: "メールアドレスを入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create invitation (child inviting parent)
      const { error: invitationError } = await supabase
        .from('family_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: parentEmail.trim(),
          relationship_type: 'parent_child',
          inviter_role: 'child'
        });

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
        toast({
          title: "エラー",
          description: "招待の送信に失敗しました",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "招待を送信しました",
        description: `${parentEmail} に招待メールを送信しました`,
      });

      setParentEmail('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding parent:', error);
      toast({
        title: "エラー",
        description: "予期しないエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>保護者を追加</DialogTitle>
          <DialogDescription>
            保護者のメールアドレスを入力して招待を送信してください
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="parentEmail">保護者のメールアドレス</Label>
            <Input
              id="parentEmail"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleAddParent}
            disabled={isLoading || !parentEmail.trim()}
          >
            {isLoading ? "送信中..." : "招待を送信"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
