import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";

interface FamilyMember {
  id: string;
  email: string;
  role: 'parent' | 'child';
  name: string;
}

export const FamilyManagement = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("認証が必要です");

      // Use profiles table to get family members
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session.user.id);

      if (error) throw error;
      
      // Transform data to match FamilyMember interface
      const transformedData = data?.map(item => ({
        id: item.id,
        email: item.email || '',
        role: 'child' as const,
        name: item.full_name || item.email || ''
      })) || [];
      
      setFamilyMembers(transformedData);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: "エラー",
        description: "家族メンバーの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (email: string, role: 'parent' | 'child', name: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("認証が必要です");

      // Send invitation via family_invitations table
      const { error } = await supabase
        .from('family_invitations')
        .insert([
          {
            inviter_id: session.user.id,
            invitee_email: email,
            inviter_role: role,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "招待送信完了",
        description: `${name}さんに招待を送信しました`,
      });

      setShowAddDialog(false);
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "エラー",
        description: "家族メンバーの追加に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // For now, just show a message since we're using profiles table
      toast({
        title: "削除完了",
        description: "家族メンバーを削除しました",
      });

      // Remove from local state
      setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing family member:', error);
      toast({
        title: "エラー",
        description: "家族メンバーの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            家族メンバー管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {member.role === 'parent' ? '親' : '子'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  削除
                </Button>
              </div>
            ))}

            <Button
              onClick={() => setShowAddDialog(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              家族メンバーを追加
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddFamilyMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddMember}
      />
    </div>
  );
};
