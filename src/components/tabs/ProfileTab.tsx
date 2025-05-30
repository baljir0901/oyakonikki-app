
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Bell, LogOut, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrivacySettings } from "../settings/PrivacySettings";
import { NotificationSettings } from "../settings/NotificationSettings";
import { AddChildDialog } from "../family/AddChildDialog";
import { AddParentDialog } from "../family/AddParentDialog";
import { FamilyInvitations } from "../family/FamilyInvitations";

interface ProfileTabProps {
  userType: 'parent' | 'child';
  onSignOut: () => void;
}

export const ProfileTab = ({ userType, onSignOut }: ProfileTabProps) => {
  const [currentView, setCurrentView] = useState<'main' | 'privacy' | 'notifications'>('main');
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [showAddParentDialog, setShowAddParentDialog] = useState(false);
  const { toast } = useToast();

  const handleAddChild = () => {
    setShowAddChildDialog(true);
  };

  const handleAddParent = () => {
    setShowAddParentDialog(true);
  };

  const handleManageChild = () => {
    toast({
      title: "お子様の管理",
      description: "お子様の設定を管理します",
    });
  };

  const handleInvitationSuccess = () => {
    // Refresh any family-related queries here if needed
  };

  if (currentView === 'privacy') {
    return <PrivacySettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'notifications') {
    return <NotificationSettings onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          プロフィール設定
        </h2>
      </div>

      <FamilyInvitations />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">
                {userType === 'parent' ? '保護者アカウント' : 'お子様アカウント'}
              </p>
              <p className="text-sm text-gray-500">user@example.com</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">家族の接続</h3>
            <div className="space-y-3">
              {userType === 'parent' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">ゆき</p>
                      <p className="text-sm text-gray-500">接続されたお子様</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-10" onClick={handleManageChild}>
                      管理
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full h-12" onClick={handleAddChild}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    お子様を追加
                  </Button>
                </>
              )}
              
              {userType === 'child' && (
                <Button variant="outline" className="w-full h-12" onClick={handleAddParent}>
                  <Users className="w-5 h-5 mr-2" />
                  保護者を追加
                </Button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-base" 
              onClick={() => setCurrentView('privacy')}
            >
              <Shield className="w-5 h-5 mr-3" />
              プライバシー設定
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-base" 
              onClick={() => setCurrentView('notifications')}
            >
              <Bell className="w-5 h-5 mr-3" />
              通知設定
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700" onClick={onSignOut}>
              <LogOut className="w-5 h-5 mr-3" />
              ログアウト
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddChildDialog 
        open={showAddChildDialog}
        onOpenChange={setShowAddChildDialog}
        onSuccess={handleInvitationSuccess}
      />

      <AddParentDialog 
        open={showAddParentDialog}
        onOpenChange={setShowAddParentDialog}
        onSuccess={handleInvitationSuccess}
      />
    </div>
  );
};
