
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">
            {userType === 'parent' ? "お子様の物語" : "家族の日記"}
          </h2>
          <p className="text-amber-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">
          {userType === 'parent' ? "お子様の物語" : "家族の日記"}
        </h2>
        <p className="text-amber-700">
          {userType === 'parent' 
            ? "お子様の毎日の気持ちを見ることができます" 
            : "毎日の冒険を家族と共有しましょう"}
        </p>
      </div>

      <div className="space-y-4">
        {diaryEntries.length === 0 ? (
          <Card className="bg-yellow-50/80 border-amber-200">
            <CardContent className="p-5 text-center">
              <p className="text-amber-700">まだ日記がありません。</p>
              <p className="text-amber-600 text-sm mt-1">「日記を書く」タブから最初の日記を書いてみましょう！</p>
            </CardContent>
          </Card>
        ) : (
          diaryEntries.map((entry) => (
            <Card key={entry.id} className="bg-yellow-50/80 border-amber-200 hover:shadow-lg transition-all duration-200 active:scale-95">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{entry.mood}</span>
                    <div>
                      <p className="font-semibold text-amber-900 text-lg">あなた</p>
                      <p className="text-sm text-amber-600">
                        {format(new Date(entry.created_at), 'yyyy年M月d日', { locale: ja })}
                      </p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                    あなた
                  </span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {entry.content.length > 100 
                    ? `${entry.content.substring(0, 100)}...`
                    : entry.content
                  }
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
