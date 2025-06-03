import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface DiaryEntry {
  id: string;
  mood: string;
  content: string;
  created_at: string;
}

export const CalendarTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch diary entries for the current month
  const fetchDiaryEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching diary entries:', error);
      } else {
        setDiaryEntries(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaryEntries();
  }, [user]);

  // Get diary entry for a specific date
  const getDiaryEntryForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return diaryEntries.find(entry => {
      const entryDate = format(new Date(entry.created_at), 'yyyy-MM-dd');
      return entryDate === dateString;
    });
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const entry = getDiaryEntryForDate(selectedDate);
      setSelectedEntry(entry || null);
    }
  };

  // Check if a date has diary entry
  const hasEntry = (date: Date) => {
    return !!getDiaryEntryForDate(date);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-3">
          日記カレンダー
        </h2>
        <p className="text-amber-700">
          家族の思い出を振り返ってみましょう
        </p>
      </div>

      {/* Monthly Calendar - Top Section */}
      <Card className="bg-yellow-50/80 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={ja}
              className="rounded-md border border-yellow-300 bg-white/90"
              modifiers={{
                hasEntry: (date) => hasEntry(date)
              }}
              modifiersStyles={{
                hasEntry: {
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>日記がある日</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Entry - Bottom Section */}
      <Card className="bg-yellow-50/80 border-yellow-200">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-amber-600">読み込み中...</div>
            </div>
          ) : date ? (
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-4">
                {format(date, 'yyyy年MM月dd日(EEEE)', { locale: ja })}
              </h3>
              
              {selectedEntry ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedEntry.mood}</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {format(new Date(selectedEntry.created_at), 'HH:mm')}
                    </Badge>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 border border-yellow-200">
                    <p className="text-amber-800 whitespace-pre-wrap leading-relaxed">
                      {selectedEntry.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-amber-400 mb-2">📝</div>
                  <p className="text-amber-600">この日の日記はありません</p>
                  <p className="text-sm text-amber-500 mt-1">
                    日記を書いて思い出を残しましょう
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-amber-600">日付を選択してください</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries Summary */}
      {diaryEntries.length > 0 && (
        <Card className="bg-yellow-50/80 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              最近の日記 ({diaryEntries.length}件)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {diaryEntries.slice(0, 6).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/80 rounded-lg p-3 cursor-pointer hover:bg-white/90 transition-colors border border-yellow-200"
                  onClick={() => {
                    const entryDate = new Date(entry.created_at);
                    setDate(entryDate);
                    setSelectedEntry(entry);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{entry.mood}</span>
                    <span className="text-sm text-amber-600">
                      {format(new Date(entry.created_at), 'MM/dd', { locale: ja })}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 line-clamp-2">
                    {entry.content.substring(0, 50)}
                    {entry.content.length > 50 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
