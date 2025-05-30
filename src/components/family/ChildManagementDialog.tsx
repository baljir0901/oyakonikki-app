
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Trash2, Settings, Shield } from "lucide-react";

interface ChildData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface ChildManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
}

export const ChildManagementDialog = ({ open, onOpenChange, childName }: ChildManagementDialogProps) => {
  const [childSettings, setChildSettings] = useState({
    allowDiarySharing: true,
    requireApproval: false,
    restrictedMode: false,
    notificationEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [childData, setChildData] = useState<ChildData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchChildData();
    }
  }, [open, user]);

  const fetchChildData = async () => {
    if (!user) return;

    try {
      // For now, we'll use mock data since we don't have the relationship system fully implemented
      // In a real implementation, this would fetch the actual child data from the family_relationships table
      setChildData({
        id: 'mock-child-id',
        email: 'yuki@example.com',
        full_name: 'ゆき',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
  };

  const handleSettingChange = (key: keyof typeof childSettings) => {
    setChildSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // Here you would save the settings to the database
      // For now, we'll just show a success message
      
      toast({
        title: "設定を保存しました",
        description: `${childName}の設定が正常に更新されました`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChild = async () => {
    if (!confirm(`${childName}との接続を解除しますか？この操作は元に戻せません。`)) {
      return;
    }

    setLoading(true);
    
    try {
      // Here you would remove the family relationship from the database
      
      toast({
        title: "接続を解除しました",
        description: `${childName}との接続が解除されました`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error removing child:', error);
      toast({
        title: "エラー",
        description: "接続の解除に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {childName}の管理
          </DialogTitle>
          <DialogDescription>
            お子様のアカウント設定とプライバシー設定を管理できます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Child Info */}
          {childData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">アカウント情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">メール:</span>
                  <span>{childData.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">接続日:</span>
                  <span>{new Date(childData.created_at).toLocaleDateString('ja-JP')}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy & Safety Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                プライバシーと安全設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">日記の共有を許可</Label>
                  <p className="text-xs text-gray-500">お子様の日記を家族で共有します</p>
                </div>
                <Switch
                  checked={childSettings.allowDiarySharing}
                  onCheckedChange={() => handleSettingChange('allowDiarySharing')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">承認制モード</Label>
                  <p className="text-xs text-gray-500">日記の公開前に保護者の承認が必要</p>
                </div>
                <Switch
                  checked={childSettings.requireApproval}
                  onCheckedChange={() => handleSettingChange('requireApproval')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">制限モード</Label>
                  <p className="text-xs text-gray-500">一部の機能を制限します</p>
                </div>
                <Switch
                  checked={childSettings.restrictedMode}
                  onCheckedChange={() => handleSettingChange('restrictedMode')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">通知を有効</Label>
                  <p className="text-xs text-gray-500">お子様の活動について通知を受け取ります</p>
                </div>
                <Switch
                  checked={childSettings.notificationEnabled}
                  onCheckedChange={() => handleSettingChange('notificationEnabled')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-sm text-red-600">危険な操作</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveChild}
                disabled={loading}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {childName}との接続を解除
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                この操作を行うと、お子様との家族接続が解除され、日記の共有ができなくなります。
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? "保存中..." : "設定を保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
