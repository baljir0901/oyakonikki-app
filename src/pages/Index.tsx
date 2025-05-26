
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen, Users, Calendar, Settings, Bell, Shield, LogOut, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    toast({
      title: "ログイン成功",
      description: `${userType === 'parent' ? '保護者' : 'お子様'}としてログインしました`,
    });
  };

  if (isAuthenticated) {
    return <DashboardView userType={userType} setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 safe-area-inset">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            親子日記
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 font-medium">
            Oyako Nikki
          </CardDescription>
          <p className="text-sm text-gray-500 mt-2">
            毎日の物語で心をつなぐ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant={userType === 'parent' ? 'default' : 'outline'}
              onClick={() => setUserType('parent')}
              className="flex-1 h-12 text-base"
            >
              <Users className="w-5 h-5 mr-2" />
              保護者
            </Button>
            <Button
              type="button"
              variant={userType === 'child' ? 'default' : 'outline'}
              onClick={() => setUserType('child')}
              className="flex-1 h-12 text-base"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              お子様
            </Button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="メールアドレスを入力"
                className="h-12 text-base"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                className="h-12 text-base"
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium">
              {isLogin ? 'ログイン' : '新規登録'}
            </Button>
            
            <Separator />
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full h-12 text-base"
            >
              {isLogin ? "アカウントをお持ちでない方は新規登録" : "すでにアカウントをお持ちの方はログイン"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardView = ({ userType, setIsAuthenticated }: { userType: 'parent' | 'child', setIsAuthenticated: (value: boolean) => void }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    toast({
      title: "ログアウト",
      description: "ログアウトしました",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 safe-area-inset">
      {/* Mobile-optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 safe-area-inset-top">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                親子日記
              </h1>
              <p className="text-sm text-gray-500">
                {userType === 'parent' ? '保護者モード' : 'お子様モード'}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper mobile spacing */}
      <main className="px-4 py-6 pb-24">
        {activeTab === 'home' && <HomeTab userType={userType} />}
        {activeTab === 'write' && <WriteTab userType={userType} />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'profile' && <ProfileTab userType={userType} onSignOut={handleSignOut} />}
      </main>

      {/* Mobile-optimized Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-inset-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'home', icon: Heart, label: 'ホーム' },
              { id: 'write', icon: BookOpen, label: '日記を書く' },
              { id: 'calendar', icon: Calendar, label: 'カレンダー' },
              { id: 'profile', icon: Users, label: 'プロフィール' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  activeTab === tab.id
                    ? 'text-purple-600 bg-purple-50 scale-105'
                    : 'text-gray-500 hover:text-gray-700 active:bg-gray-50'
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

const HomeTab = ({ userType }: { userType: 'parent' | 'child' }) => {
  const sampleEntries = [
    {
      id: 1,
      date: '2025年1月20日',
      author: userType === 'parent' ? 'ゆき' : 'ママ',
      mood: '😊',
      excerpt: '今日は学校でとても楽しい一日でした...',
      isOwn: userType === 'child'
    },
    {
      id: 2,
      date: '2025年1月19日',
      author: userType === 'parent' ? 'ゆき' : 'パパ',
      mood: '😴',
      excerpt: '今日は少し疲れましたが...',
      isOwn: userType === 'child'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {userType === 'parent' ? "お子様の物語" : "家族の日記"}
        </h2>
        <p className="text-gray-600">
          {userType === 'parent' 
            ? "お子様の毎日の気持ちを見ることができます" 
            : "毎日の冒険を家族と共有しましょう"}
        </p>
      </div>

      <div className="space-y-4">
        {sampleEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-all duration-200 active:scale-95">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{entry.mood}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{entry.author}</p>
                    <p className="text-sm text-gray-500">{entry.date}</p>
                  </div>
                </div>
                {entry.isOwn && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                    あなた
                  </span>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed">{entry.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const WriteTab = ({ userType }: { userType: 'parent' | 'child' }) => {
  const [mood, setMood] = useState('');
  const [entry, setEntry] = useState('');
  const { toast } = useToast();

  const moods = [
    { emoji: '😊', label: '嬉しい' },
    { emoji: '😢', label: '悲しい' },
    { emoji: '😴', label: '疲れた' },
    { emoji: '😠', label: '怒り' },
    { emoji: '😲', label: 'びっくり' },
    { emoji: '🤔', label: '考え中' }
  ];

  const handleSave = () => {
    if (mood && entry.trim()) {
      toast({
        title: "日記を保存しました",
        description: "今日の日記が保存されました",
      });
      setMood('');
      setEntry('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          今日の気分はどうですか？
        </h2>
        <p className="text-gray-600">
          {userType === 'child' 
            ? "今日の出来事を家族と共有しましょう" 
            : "今日のことを書いてみましょう"}
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-4 block">
              気分を選んでください
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.emoji}
                  onClick={() => setMood(moodOption.emoji)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                    mood === moodOption.emoji
                      ? 'border-purple-400 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-2">{moodOption.emoji}</span>
                  <span className="text-sm text-gray-600 font-medium">{moodOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="diary-entry" className="text-lg font-semibold text-gray-700 mb-3 block">
              今日のことを書いてください
            </Label>
            <textarea
              id="diary-entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={userType === 'child' 
                ? "今日は何がありましたか？どんな気持ちでしたか？"
                : "今日の出来事について書いてください..."
              }
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base leading-relaxed"
              rows={8}
            />
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold" 
            disabled={!mood || !entry.trim()}
            onClick={handleSave}
          >
            今日の日記を保存
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          日記カレンダー
        </h2>
        <p className="text-gray-600">
          家族の思い出を振り返ってみましょう
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <p className="text-lg text-gray-500 mb-2">カレンダー機能は開発中です！</p>
            <p className="text-sm text-gray-400">
              日付別に日記を見ることができるようになります
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileTab = ({ userType, onSignOut }: { userType: 'parent' | 'child', onSignOut: () => void }) => {
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

export default Index;
