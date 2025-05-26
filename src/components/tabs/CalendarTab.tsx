
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const CalendarTab = () => {
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
