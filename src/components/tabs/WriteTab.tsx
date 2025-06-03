import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface WriteTabProps {
  userType: 'parent' | 'child';
}

export const WriteTab = ({ userType }: WriteTabProps) => {
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  console.log('WriteTab render - entry length:', entry.length, 'user:', !!user, 'loading:', loading);

  const handleSave = async () => {
    console.log('handleSave called - entry:', entry.trim(), 'user:', !!user);
    
    if (!entry.trim() || !user) {
      console.log('Missing required data:', { entry: !!entry.trim(), user: !!user });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to save diary entry...');
      
      const { error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          mood: '📝', // Default mood emoji for diary entries
          content: entry.trim()
        });

      if (error) {
        console.error('Error saving diary entry:', error);
        toast({
          title: "エラー",
          description: "日記の保存に失敗しました",
          variant: "destructive",
        });
      } else {
        console.log('Diary entry saved successfully');
        toast({
          title: "日記を保存しました",
          description: "今日の日記が保存されました",
        });
        setEntry('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "エラー",
        description: "予期しないエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !entry.trim() || loading || !user;
  console.log('Button disabled state:', isButtonDisabled, { entry: !!entry.trim(), loading, user: !!user });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-3">
          今日の日記を書きましょう
        </h2>
        <p className="text-amber-700">
          {userType === 'child' 
            ? "今日の出来事を家族と共有しましょう" 
            : "今日のことを書いてみましょう"}
        </p>
      </div>

      <Card className="bg-yellow-50/80 border-yellow-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="diary-entry" className="text-lg font-semibold text-amber-800 mb-3 block">
              今日のことを書いてください
            </Label>
            <textarea
              id="diary-entry"
              value={entry}
              onChange={(e) => {
                console.log('Entry changed, length:', e.target.value.length);
                setEntry(e.target.value);
              }}
              placeholder={userType === 'child' 
                ? "今日は何がありましたか？どんな気持ちでしたか？"
                : "今日の出来事について書いてください..."
              }
              className="w-full p-4 border border-yellow-300 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base leading-relaxed bg-white/90"
              rows={12}
            />
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-amber-500 hover:bg-amber-600" 
            disabled={isButtonDisabled}
            onClick={handleSave}
          >
            {loading ? "保存中..." : "今日の日記を保存"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
