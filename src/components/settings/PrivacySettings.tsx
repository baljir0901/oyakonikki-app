
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface PrivacySettingsProps {
  onBack: () => void;
}

export const PrivacySettings = ({ onBack }: PrivacySettingsProps) => {
  const [settings, setSettings] = useState({
    profileVisible: true,
    shareWithFamily: true,
    allowComments: true,
    showOnlineStatus: false,
    dataCollection: true,
    thirdPartySharing: false,
  });

  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // ここで設定を保存する処理を実装
    toast({
      title: "設定を保存しました",
      description: "プライバシー設定が正常に更新されました",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">プライバシー設定</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>プロフィールを公開</Label>
              <p className="text-sm text-gray-500">他のユーザーがあなたのプロフィールを見ることができます</p>
            </div>
            <Switch
              checked={settings.profileVisible}
              onCheckedChange={() => handleSettingChange('profileVisible')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>家族と共有</Label>
              <p className="text-sm text-gray-500">家族メンバーと日記を自動的に共有します</p>
            </div>
            <Switch
              checked={settings.shareWithFamily}
              onCheckedChange={() => handleSettingChange('shareWithFamily')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>コメントを許可</Label>
              <p className="text-sm text-gray-500">他のユーザーがあなたの日記にコメントできます</p>
            </div>
            <Switch
              checked={settings.allowComments}
              onCheckedChange={() => handleSettingChange('allowComments')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>オンライン状態を表示</Label>
              <p className="text-sm text-gray-500">他のユーザーにオンライン状態を表示します</p>
            </div>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={() => handleSettingChange('showOnlineStatus')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データとプライバシー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>データ収集を許可</Label>
              <p className="text-sm text-gray-500">アプリの改善のための匿名データ収集を許可します</p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={() => handleSettingChange('dataCollection')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>第三者との共有</Label>
              <p className="text-sm text-gray-500">マーケティング目的での第三者とのデータ共有を許可します</p>
            </div>
            <Switch
              checked={settings.thirdPartySharing}
              onCheckedChange={() => handleSettingChange('thirdPartySharing')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          設定を保存
        </Button>
        <Button variant="outline" onClick={onBack} className="flex-1">
          キャンセル
        </Button>
      </div>
    </div>
  );
};
