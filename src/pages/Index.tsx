import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen, Users, Calendar } from "lucide-react";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <DashboardView userType={userType} />;
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
            Oyako Nikki
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 font-medium">
            親子日記
          </CardDescription>
          <p className="text-sm text-gray-500 mt-2">
            Connect hearts through daily stories
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
              Parent
            </Button>
            <Button
              type="button"
              variant={userType === 'child' ? 'default' : 'outline'}
              onClick={() => setUserType('child')}
              className="flex-1 h-12 text-base"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Child
            </Button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 text-base"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 text-base"
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <Separator />
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full h-12 text-base"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardView = ({ userType }: { userType: 'parent' | 'child' }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 safe-area-inset">
      {/* Mobile-optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 safe-area-inset-top">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Oyako Nikki
              </h1>
              <p className="text-sm text-gray-500">
                {userType === 'parent' ? 'Parent View' : 'Child View'}
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
        {activeTab === 'profile' && <ProfileTab userType={userType} />}
      </main>

      {/* Mobile-optimized Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-inset-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'home', icon: Heart, label: 'Home' },
              { id: 'write', icon: BookOpen, label: 'Write' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'profile', icon: Users, label: 'Profile' }
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
      date: '2025-01-20',
      author: userType === 'parent' ? 'Yuki' : 'Mom',
      mood: '😊',
      excerpt: 'Today was a wonderful day at school...',
      isOwn: userType === 'child'
    },
    {
      id: 2,
      date: '2025-01-19',
      author: userType === 'parent' ? 'Yuki' : 'Dad',
      mood: '😴',
      excerpt: 'I felt a bit tired today but...',
      isOwn: userType === 'child'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {userType === 'parent' ? "Your child's stories" : "Your family diary"}
        </h2>
        <p className="text-gray-600">
          {userType === 'parent' 
            ? "See how your child is feeling each day" 
            : "Share your daily adventures"}
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
                    You
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

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😲', label: 'Surprised' },
    { emoji: '🤔', label: 'Thoughtful' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How are you feeling today?
        </h2>
        <p className="text-gray-600">
          {userType === 'child' 
            ? "Share your day with your family" 
            : "Write about your day"}
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-4 block">
              Pick your mood
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
              Write about your day
            </Label>
            <textarea
              id="diary-entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={userType === 'child' 
                ? "What happened today? How did you feel?"
                : "Share your thoughts about today..."
              }
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base leading-relaxed"
              rows={8}
            />
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold" 
            disabled={!mood || !entry.trim()}
          >
            Save Today's Entry
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
          Your Diary Calendar
        </h2>
        <p className="text-gray-600">
          Look back at your family's memories
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <p className="text-lg text-gray-500 mb-2">Calendar view coming soon!</p>
            <p className="text-sm text-gray-400">
              You'll be able to browse all your diary entries by date
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileTab = ({ userType }: { userType: 'parent' | 'child' }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Profile Settings
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
                {userType === 'parent' ? 'Parent Account' : 'Child Account'}
              </p>
              <p className="text-sm text-gray-500">user@example.com</p>
            </div>
          </div>

          {userType === 'parent' && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Family Connections</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Yuki</p>
                    <p className="text-sm text-gray-500">Connected child</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-10">
                    Manage
                  </Button>
                </div>
                <Button variant="outline" className="w-full h-12">
                  Add Another Child
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t space-y-3">
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
