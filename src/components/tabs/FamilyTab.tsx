
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, Heart, Plus, UserPlus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyTabProps {
  userType: 'parent' | 'child';
}

interface FamilyMember {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  relationship_type: string;
}

interface FamilyInvitation {
  id: string;
  invitee_email: string;
  status: string;
  created_at: string;
  inviter_role: string;
}

export const FamilyTab = ({ userType }: FamilyTabProps) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFamilyData();
    }
  }, [user]);

  const fetchFamilyData = async () => {
    if (!user) return;

    try {
      // Fetch family relationships with proper join syntax
      const { data: relationships, error: relError } = await supabase
        .from('family_relationships')
        .select(`
          parent_id,
          child_id,
          parent:parent_id(id, full_name, email, avatar_url),
          child:child_id(id, full_name, email, avatar_url)
        `)
        .or(`parent_id.eq.${user.id},child_id.eq.${user.id}`);

      if (relError) throw relError;

      const members: FamilyMember[] = [];
      relationships?.forEach(rel => {
        if (rel.parent_id === user.id && rel.child && typeof rel.child === 'object') {
          members.push({
            id: rel.child.id,
            full_name: rel.child.full_name || '',
            email: rel.child.email || '',
            avatar_url: rel.child.avatar_url,
            relationship_type: 'child'
          });
        } else if (rel.child_id === user.id && rel.parent && typeof rel.parent === 'object') {
          members.push({
            id: rel.parent.id,
            full_name: rel.parent.full_name || '',
            email: rel.parent.email || '',
            avatar_url: rel.parent.avatar_url,
            relationship_type: 'parent'
          });
        }
      });

      setFamilyMembers(members);

      // Fetch pending invitations
      const { data: invitationsData, error: invError } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .eq('status', 'pending');

      if (invError) throw invError;
      setInvitations(invitationsData || []);

    } catch (error) {
      console.error('Error fetching family data:', error);
      toast({
        title: "エラー",
        description: "家族データの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    if (!user || !inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { error } = await supabase.functions.invoke('send-family-invitation', {
        body: {
          invitee_email: inviteEmail.trim(),
          inviter_role: userType,
        }
      });

      if (error) throw error;

      toast({
        title: "招待を送信しました",
        description: `${inviteEmail} に家族招待を送信しました`,
      });

      setInviteEmail('');
      fetchFamilyData();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "エラー",
        description: "招待の送信に失敗しました",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">家族</h2>
          <p className="text-amber-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">
          <Users className="inline-block w-6 h-6 mr-2" />
          家族
        </h2>
        <p className="text-amber-700">
          {userType === 'parent' ? 'お子様との絆を深めましょう' : '家族との思い出を共有しましょう'}
        </p>
      </div>

      {/* Family Members */}
      <Card className="bg-yellow-50/80 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            家族メンバー ({familyMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {familyMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-amber-600">まだ家族メンバーがいません</p>
              <p className="text-sm text-amber-500 mt-1">
                下の招待機能を使って家族を招待しましょう
              </p>
            </div>
          ) : (
            familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-white/80 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {member.full_name?.charAt(0) || member.email.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">{member.full_name || member.email}</p>
                    <p className="text-sm text-amber-600">{member.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {member.relationship_type === 'parent' ? '保護者' : 'お子様'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Send Invitation */}
      <Card className="bg-yellow-50/80 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            家族を招待
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-800">
              {userType === 'parent' ? 'お子様のメールアドレス' : '保護者のメールアドレス'}
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button
            onClick={sendInvitation}
            disabled={!inviteEmail.trim() || inviting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            {inviting ? '招待中...' : '招待を送信'}
          </Button>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="bg-yellow-50/80 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              送信済み招待 ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between bg-white/80 p-4 rounded-lg border border-amber-200">
                <div>
                  <p className="font-semibold text-amber-900">{invitation.invitee_email}</p>
                  <p className="text-sm text-amber-600">
                    送信日: {new Date(invitation.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  招待中
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
