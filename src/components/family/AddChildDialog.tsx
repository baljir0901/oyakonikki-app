
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

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddChildDialog = ({ open, onOpenChange, onSuccess }: AddChildDialogProps) => {
  const [childEmail, setChildEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddChild = async () => {
    if (!user || !childEmail.trim()) {
      toast({
        title: "エラー",
        description: "メールアドレスを入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting invitation process for:', childEmail.trim());

    try {
      // Create invitation
      console.log('Creating invitation with user ID:', user.id);
      const { data: invitationData, error: invitationError } = await supabase
        .from('family_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: childEmail.trim(),
          relationship_type: 'parent_child',
          inviter_role: 'parent'
        })
        .select()
        .single();

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
        toast({
          title: "エラー",
          description: `招待の作成に失敗しました: ${invitationError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Invitation created successfully:', invitationData);

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
      console.log('Inviter name:', inviterName);

      // Send invitation email
      console.log('Sending invitation email with data:', {
        invitationId: invitationData.id,
        inviteeEmail: childEmail.trim(),
        inviterName: inviterName,
        inviterRole: 'parent',
        invitationCode: invitationData.invitation_code
      });

      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-family-invitation', {
        body: {
          invitationId: invitationData.id,
          inviteeEmail: childEmail.trim(),
          inviterName: inviterName,
          inviterRole: 'parent',
          invitationCode: invitationData.invitation_code
        }
      });

      console.log('Email function response:', emailData);

      if (emailError) {
        console.error('Error sending invitation email:', emailError);
        toast({
          title: "招待を作成しました",
          description: `招待コード: ${invitationData.invitation_code}（メール送信に失敗しましたが、招待コードを直接お伝えください）`,
        });
      } else {
        console.log('Email sent successfully');
        toast({
          title: "招待を送信しました",
          description: `${childEmail} に招待メールを送信しました`,
        });
      }

      setChildEmail('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Unexpected error in handleAddChild:', error);
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
          <DialogTitle>お子様を追加</DialogTitle>
          <DialogDescription>
            お子様のメールアドレスを入力して招待を送信してください
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="childEmail">お子様のメールアドレス</Label>
            <Input
              id="childEmail"
              type="email"
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              placeholder="child@example.com"
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
            onClick={handleAddChild}
            disabled={isLoading || !childEmail.trim()}
          >
            {isLoading ? "送信中..." : "招待を送信"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
