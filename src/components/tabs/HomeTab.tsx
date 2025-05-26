
import { Card, CardContent } from "@/components/ui/card";

interface HomeTabProps {
  userType: 'parent' | 'child';
}

export const HomeTab = ({ userType }: HomeTabProps) => {
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
