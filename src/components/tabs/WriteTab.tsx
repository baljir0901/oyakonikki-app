
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WriteTabProps {
  userType: 'parent' | 'child';
}

export const WriteTab = ({ userType }: WriteTabProps) => {
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
