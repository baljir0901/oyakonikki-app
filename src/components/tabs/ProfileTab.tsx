import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Bell, LogOut, UserPlus, Users, CreditCard, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrivacySettings } from "../settings/PrivacySettings";
import { NotificationSettings } from "../settings/NotificationSettings";
import { PaymentSettings } from "../settings/PaymentSettings";
import { AddChildDialog } from "../family/AddChildDialog";
import { AddParentDialog } from "../family/AddParentDialog";
import { FamilyInvitations } from "../family/FamilyInvitations";
import { ChildManagementDialog } from "../family/ChildManagementDialog";

interface ProfileTabProps {
  userType: 'parent' | 'child';
  onSignOut: () => void;
}

interface PersonalInfo {
  location: string;
  postalCode: string;
  phoneNumber: string;
}

export const ProfileTab = ({ userType, onSignOut }: ProfileTabProps) => {
  const [currentView, setCurrentView] = useState<'main' | 'privacy' | 'notifications' | 'payment'>('main');
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [showAddParentDialog, setShowAddParentDialog] = useState(false);
  const [showChildManagement, setShowChildManagement] = useState(false);
  const [selectedChildName, setSelectedChildName] = useState('');
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    location: '',
    postalCode: '',
    phoneNumber: ''
  });
  const { toast } = useToast();

  const handleAddChild = () => {
    setShowAddChildDialog(true);
  };

  const handleAddParent = () => {
    setShowAddParentDialog(true);
  };

  const handleManageChild = (childName: string) => {
    setSelectedChildName(childName);
    setShowChildManagement(true);
  };

  const handleInvitationSuccess = () => {
    // Refresh any family-related queries here if needed
  };

  const handleSavePersonalInfo = () => {
    // Here you would typically save to your backend/database
    setIsEditingPersonalInfo(false);
    toast({
      title: "保存完了",
      description: "個人情報が更新されました",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingPersonalInfo(false);
    // Reset to original values if needed
  };

  if (currentView === 'privacy') {
    return <PrivacySettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'notifications') {
    return <NotificationSettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'payment') {
    return <PaymentSettings onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-3">
          プロフィール設定
        </h2>
      </div>

      <FamilyInvitations />

      <Card className="bg-yellow-50/80 border-yellow-200">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 text-lg">
                {userType === 'parent' ? '保護者アカウント' : 'お子様アカウント'}
              </p>
              <p className="text-sm text-amber-600">user@example.com</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="pt-4 border-t border-yellow-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-amber-800 text-lg">個人情報</h3>
              {!isEditingPersonalInfo ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPersonalInfo(true)}
                  className="h-8 text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  編集
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8 text-amber-700 border-amber-300 hover:bg-amber-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    キャンセル
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSavePersonalInfo}
                    className="h-8 bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-amber-800 mb-1 block">
                  住所
                </Label>
                {isEditingPersonalInfo ? (
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="東京都渋谷区..."
                    className="h-10 border-yellow-300 focus:ring-amber-500"
                  />
                ) : (
                  <div className="h-10 px-3 py-2 bg-white/80 border border-yellow-200 rounded-md flex items-center text-amber-700">
                    {personalInfo.location || "未設定"}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode" className="text-sm font-medium text-amber-800 mb-1 block">
                  郵便番号
                </Label>
                {isEditingPersonalInfo ? (
                  <Input
                    id="postalCode"
                    value={personalInfo.postalCode}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="123-4567"
                    className="h-10 border-yellow-300 focus:ring-amber-500"
                  />
                ) : (
                  <div className="h-10 px-3 py-2 bg-white/80 border border-yellow-200 rounded-md flex items-center text-amber-700">
                    {personalInfo.postalCode || "未設定"}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-amber-800 mb-1 block">
                  電話番号
                </Label>
                {isEditingPersonalInfo ? (
                  <Input
                    id="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="090-1234-5678"
                    className="h-10 border-yellow-300 focus:ring-amber-500"
                  />
                ) : (
                  <div className="h-10 px-3 py-2 bg-white/80 border border-yellow-200 rounded-md flex items-center text-amber-700">
                    {personalInfo.phoneNumber || "未設定"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-yellow-300">
            <h3 className="font-semibold text-amber-800 mb-4 text-lg">家族の接続</h3>
            <div className="space-y-3">
              {userType === 'parent' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-yellow-200">
                    <div>
                      <p className="font-semibold text-amber-800">ゆき</p>
                      <p className="text-sm text-amber-600">接続されたお子様</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 text-amber-700 border-amber-300 hover:bg-amber-100" 
                      onClick={() => handleManageChild('ゆき')}
                    >
                      管理
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full h-12 text-amber-700 border-amber-300 hover:bg-amber-100" onClick={handleAddChild}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    お子様を追加
                  </Button>
                </>
              )}
              
              {userType === 'child' && (
                <Button variant="outline" className="w-full h-12 text-amber-700 border-amber-300 hover:bg-amber-100" onClick={handleAddParent}>
                  <Users className="w-5 h-5 mr-2" />
                  保護者を追加
                </Button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-yellow-300 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-base text-amber-700 border-amber-300 hover:bg-amber-100" 
              onClick={() => setCurrentView('payment')}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              支払い設定
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-base text-amber-700 border-amber-300 hover:bg-amber-100" 
              onClick={() => setCurrentView('privacy')}
            >
              <Shield className="w-5 h-5 mr-3" />
              プライバシー設定
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-base text-amber-700 border-amber-300 hover:bg-amber-100" 
              onClick={() => setCurrentView('notifications')}
            >
              <Bell className="w-5 h-5 mr-3" />
              通知設定
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50" onClick={onSignOut}>
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

      <ChildManagementDialog
        open={showChildManagement}
        onOpenChange={setShowChildManagement}
        childName={selectedChildName}
      />
    </div>
  );
};
