
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface NotificationSettingsProps {
  onBack: () => void;
}

export const NotificationSettings = ({ onBack }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    familyUpdates: true,
    reminderTime: '19:00',
    weeklyDigest: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '07:00',
  });

  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings, value?: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key as keyof typeof settings]
    }));
  };

  const handleSave = () => {
    // ここで設定を保存する処理を実装
    toast({
      title: "設定を保存しました",
      description: "通知設定が正常に更新されました",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">通知設定</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本通知</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>プッシュ通知</Label>
              <p className="text-sm text-gray-500">アプリからの通知を受け取ります</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={() => handleSettingChange('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>メール通知</Label>
              <p className="text-sm text-gray-500">重要な更新をメールで受け取ります</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleSettingChange('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>家族の更新通知</Label>
              <p className="text-sm text-gray-500">家族メンバーの新しい日記を通知します</p>
            </div>
            <Switch
              checked={settings.familyUpdates}
              onCheckedChange={() => handleSettingChange('familyUpdates')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>リマインダー設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>日記のリマインダー時間</Label>
            <Select
              value={settings.reminderTime}
              onValueChange={(value) => handleSettingChange('reminderTime', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="19:00">19:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
                <SelectItem value="21:00">21:00</SelectItem>
                <SelectItem value="22:00">22:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>週間ダイジェスト</Label>
              <p className="text-sm text-gray-500">週に一度、活動のまとめを送信します</p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={() => handleSettingChange('weeklyDigest')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>サウンド</Label>
              <p className="text-sm text-gray-500">通知音を再生します</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={() => handleSettingChange('soundEnabled')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>バイブレーション</Label>
              <p className="text-sm text-gray-500">通知時にバイブレーションします</p>
            </div>
            <Switch
              checked={settings.vibrationEnabled}
              onCheckedChange={() => handleSettingChange('vibrationEnabled')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>おやすみモード</Label>
              <p className="text-sm text-gray-500">指定した時間帯は通知を停止します</p>
            </div>
            <Switch
              checked={settings.quietHours}
              onCheckedChange={() => handleSettingChange('quietHours')}
            />
          </div>

          {settings.quietHours && (
            <div className="grid grid-cols-2 gap-4 ml-4">
              <div className="space-y-2">
                <Label className="text-sm">開始時間</Label>
                <Select
                  value={settings.quietStart}
                  onValueChange={(value) => handleSettingChange('quietStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21:00">21:00</SelectItem>
                    <SelectItem value="22:00">22:00</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                    <SelectItem value="00:00">00:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">終了時間</Label>
                <Select
                  value={settings.quietEnd}
                  onValueChange={(value) => handleSettingChange('quietEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
