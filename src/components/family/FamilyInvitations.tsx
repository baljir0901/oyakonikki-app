
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Check, X, Clock } from "lucide-react";

interface FamilyInvitation {
  id: string;
  inviter_id: string;
  invitee_email: string;
  relationship_type: string;
  inviter_role: string;
  status: string;
  invitation_code: string;
  expires_at: string;
  created_at: string;
}

export const FamilyInvitations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: receivedInvitations = [] } = useQuery({
    queryKey: ['family_invitations_received', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('invitee_email', user.email)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching received invitations:', error);
        return [];
      }
      
      return data as FamilyInvitation[];
    },
    enabled: !!user?.email,
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: async (invitation: FamilyInvitation) => {
      const { error: updateError } = await supabase
        .from('family_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Create the family relationship
      const relationshipData = invitation.inviter_role === 'parent' 
        ? { parent_id: invitation.inviter_id, child_id: user!.id }
        : { parent_id: user!.id, child_id: invitation.inviter_id };

      const { error: relationshipError } = await supabase
        .from('family_relationships')
        .insert({
          ...relationshipData,
          relationship_type: 'parent_child'
        });

      if (relationshipError) throw relationshipError;
    },
    onSuccess: () => {
      toast({
        title: "招待を承諾しました",
        description: "家族関係が確立されました",
      });
      queryClient.invalidateQueries({ queryKey: ['family_invitations_received'] });
      queryClient.invalidateQueries({ queryKey: ['family_relationships'] });
    },
    onError: (error) => {
      console.error('Error accepting invitation:', error);
      toast({
        title: "エラー",
        description: "招待の承諾に失敗しました",
        variant: "destructive",
      });
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('family_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "招待を拒否しました",
        description: "招待が拒否されました",
      });
      queryClient.invalidateQueries({ queryKey: ['family_invitations_received'] });
    },
    onError: (error) => {
      console.error('Error declining invitation:', error);
      toast({
        title: "エラー",
        description: "招待の拒否に失敗しました",
        variant: "destructive",
      });
    },
  });

  if (receivedInvitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          家族からの招待
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {receivedInvitations.map((invitation) => (
          <div key={invitation.id} className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {invitation.inviter_role === 'parent' ? '保護者' : 'お子様'}からの招待
                </p>
                <p className="text-sm text-gray-500">
                  招待コード: {invitation.invitation_code}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptInvitationMutation.mutate(invitation)}
                  disabled={acceptInvitationMutation.isPending || declineInvitationMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-1" />
                  承諾
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => declineInvitationMutation.mutate(invitation.id)}
                  disabled={acceptInvitationMutation.isPending || declineInvitationMutation.isPending}
                >
                  <X className="w-4 h-4 mr-1" />
                  拒否
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
