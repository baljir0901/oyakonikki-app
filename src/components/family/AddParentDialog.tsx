
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
    console.log('Starting parent invitation process for:', parentEmail.trim());

    try {
      // Create invitation (child inviting parent)
      console.log('Creating parent invitation with user ID:', user.id);
      const { data: invitationData, error: invitationError } = await supabase
        .from('family_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: parentEmail.trim(),
          relationship_type: 'parent_child',
          inviter_role: 'child'
        })
        .select()
        .single();

      if (invitationError) {
        console.error('Error creating parent invitation:', invitationError);
        toast({
          title: "エラー",
          description: `招待の作成に失敗しました: ${invitationError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Parent invitation created successfully:', invitationData);

      // Get user profile for name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const inviterName = profileData?.full_name || 'ユーザー';
      console.log('Child inviter name:', inviterName);

      // Send invitation email
      console.log('Sending parent invitation email with data:', {
        invitationId: invitationData.id,
        inviteeEmail: parentEmail.trim(),
        inviterName: inviterName,
        inviterRole: 'child',
        invitationCode: invitationData.invitation_code
      });

      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-family-invitation', {
        body: {
          invitationId: invitationData.id,
          inviteeEmail: parentEmail.trim(),
          inviterName: inviterName,
          inviterRole: 'child',
          invitationCode: invitationData.invitation_code
        }
      });

      console.log('Parent invitation email function response:', emailData);

      if (emailError) {
        console.error('Error sending parent invitation email:', emailError);
        toast({
          title: "招待を作成しました",
          description: `招待コード: ${invitationData.invitation_code}（メール送信に失敗しましたが、招待コードを直接お伝えください）`,
        });
      } else {
        console.log('Parent invitation email sent successfully');
        toast({
          title: "招待を送信しました",
          description: `${parentEmail} に招待メールを送信しました`,
        });
      }

      setParentEmail('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Unexpected error in handleAddParent:', error);
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
