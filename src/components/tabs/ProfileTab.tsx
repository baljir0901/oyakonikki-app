
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Bell, LogOut, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileTabProps {
  userType: 'parent' | 'child';
  onSignOut: () => void;
}

export const ProfileTab = ({ userType, onSignOut }: ProfileTabProps) => {
  const { toast } = useToast();

  const handlePrivacySettings = () => {
    toast({
      title: "プライバシー設定",
      description: "プライバシー設定画面を開きます",
    });
  };

  const handleNotificationSettings = () => {
    toast({
      title: "通知設定",
      description: "通知設定画面を開きます",
    });
  };

  const handleAddChild = () => {
    toast({
      title: "お子様を追加",
      description: "新しいお子様を追加する画面を開きます",
    });
  };

  const handleManageChild = () => {
    toast({
      title: "お子様の管理",
      description: "お子様の設定を管理します",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          プロフィール設定
        </h2>
      </div>

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

          {userType === 'parent' && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">家族の接続</h3>
              <div className="space-y-3">
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
              </div>
            </div>
          )}

          <div className="pt-4 border-t space-y-3">
            <Button variant="outline" className="w-full justify-start h-12 text-base" onClick={handlePrivacySettings}>
              <Shield className="w-5 h-5 mr-3" />
              プライバシー設定
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base" onClick={handleNotificationSettings}>
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
    </div>
  );
};
