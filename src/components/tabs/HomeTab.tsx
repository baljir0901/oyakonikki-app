
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Heart, BookOpen, Calendar, TrendingUp, Star } from "lucide-react";

interface HomeTabProps {
  userType: 'parent' | 'child';
}

interface DiaryEntry {
  id: string;
  mood: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface DashboardStats {
  totalEntries: number;
  thisWeekEntries: number;
  streak: number;
  favoriteEmoji: string;
}

export const HomeTab = ({ userType }: HomeTabProps) => {
  const { user } = useAuth();

  const { data: diaryEntries = [], isLoading } = useQuery({
    queryKey: ['diary_entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching diary entries for user:', user.id);
      
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching diary entries:', error);
        throw error;
      }

      console.log('Fetched diary entries:', data);
      return data as DiaryEntry[];
    },
    enabled: !!user,
  });

  // Calculate statistics
  const stats: DashboardStats = {
    totalEntries: diaryEntries.length,
    thisWeekEntries: diaryEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    streak: calculateStreak(diaryEntries),
    favoriteEmoji: getMostUsedEmoji(diaryEntries)
  };

  function calculateStreak(entries: DiaryEntry[]): number {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.created_at);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === currentDate.getTime();
      });
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  function getMostUsedEmoji(entries: DiaryEntry[]): string {
    if (entries.length === 0) return '😊';
    
    const emojiCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      emojiCount[entry.mood] = (emojiCount[entry.mood] || 0) + 1;
    });
    
    return Object.keys(emojiCount).reduce((a, b) => 
      emojiCount[a] > emojiCount[b] ? a : b
    ) || '😊';
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">
            ホーム
          </h2>
          <p className="text-amber-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">
          おかえりなさい！
        </h2>
        <p className="text-amber-700">
          {userType === 'parent' 
            ? "お子様の成長を一緒に記録しましょう" 
            : "今日も素敵な一日を記録しましょう"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-700">{stats.totalEntries}</p>
            <p className="text-sm text-red-600">総日記数</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-700">{stats.streak}</p>
            <p className="text-sm text-amber-600">連続記録</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{stats.thisWeekEntries}</p>
            <p className="text-sm text-green-600">今週の日記</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">{stats.favoriteEmoji}</p>
            <p className="text-sm text-purple-600">よく使う気分</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card className="bg-yellow-50/80 border-amber-200">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            最近の日記
          </h3>
          
          <div className="space-y-4">
            {diaryEntries.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-amber-700 mb-2">まだ日記がありません</p>
                <p className="text-amber-600 text-sm mb-4">最初の日記を書いてみましょう！</p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  日記を書く
                </Button>
              </div>
            ) : (
              diaryEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="bg-white/80 rounded-lg p-4 border border-amber-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{entry.mood}</span>
                      <div>
                        <p className="text-sm text-amber-600">
                          {format(new Date(entry.created_at), 'M月d日(EEEE)', { locale: ja })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-amber-800 leading-relaxed text-sm">
                    {entry.content.length > 80 
                      ? `${entry.content.substring(0, 80)}...`
                      : entry.content
                    }
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6">
          <BookOpen className="w-5 h-5 mr-2" />
          日記を書く
        </Button>
        <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 py-6">
          <Calendar className="w-5 h-5 mr-2" />
          カレンダー
        </Button>
      </div>
    </div>
  );
};
