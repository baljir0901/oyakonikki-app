
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
    // For now, just simulate authentication
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <DashboardView userType={userType} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Oyako Nikki
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            親子日記
          </CardDescription>
          <p className="text-sm text-gray-500 mt-2">
            Connect hearts through daily stories
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={userType === 'parent' ? 'default' : 'outline'}
                onClick={() => setUserType('parent')}
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                Parent
              </Button>
              <Button
                type="button"
                variant={userType === 'child' ? 'default' : 'outline'}
                onClick={() => setUserType('child')}
                className="flex-1"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Child
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <Separator />
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Oyako Nikki
              </h1>
              <p className="text-sm text-gray-500">
                {userType === 'parent' ? 'Parent View' : 'Child View'}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'home' && <HomeTab userType={userType} />}
        {activeTab === 'write' && <WriteTab userType={userType} />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'profile' && <ProfileTab userType={userType} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'home', icon: Heart, label: 'Home' },
              { id: 'write', icon: BookOpen, label: 'Write' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'profile', icon: Users, label: 'Profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{tab.label}</span>
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
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {userType === 'parent' ? "Your child's stories" : "Your family diary"}
        </h2>
        <p className="text-gray-600 text-sm">
          {userType === 'parent' 
            ? "See how your child is feeling each day" 
            : "Share your daily adventures"}
        </p>
      </div>

      <div className="space-y-3">
        {sampleEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{entry.mood}</span>
                  <div>
                    <p className="font-medium text-gray-800">{entry.author}</p>
                    <p className="text-sm text-gray-500">{entry.date}</p>
                  </div>
                </div>
                {entry.isOwn && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{entry.excerpt}</p>
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
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          How are you feeling today?
        </h2>
        <p className="text-gray-600 text-sm">
          {userType === 'child' 
            ? "Share your day with your family" 
            : "Write about your day"}
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Pick your mood
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.emoji}
                  onClick={() => setMood(moodOption.emoji)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                    mood === moodOption.emoji
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{moodOption.emoji}</span>
                  <span className="text-xs text-gray-600">{moodOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="diary-entry" className="text-sm font-medium text-gray-700 mb-2 block">
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
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
            />
          </div>

          <Button className="w-full" disabled={!mood || !entry.trim()}>
            Save Today's Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarTab = () => {
  return (
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Your Diary Calendar
        </h2>
        <p className="text-gray-600 text-sm">
          Look back at your family's memories
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Calendar view coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">
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
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Profile Settings
        </h2>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {userType === 'parent' ? 'Parent Account' : 'Child Account'}
              </p>
              <p className="text-sm text-gray-500">user@example.com</p>
            </div>
          </div>

          {userType === 'parent' && (
            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-800 mb-3">Family Connections</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Yuki</p>
                    <p className="text-xs text-gray-500">Connected child</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  Add Another Child
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
