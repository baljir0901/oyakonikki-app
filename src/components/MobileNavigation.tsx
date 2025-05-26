
import { Heart, BookOpen, Calendar, Users } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, setActiveTab }: MobileNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Heart, label: 'ホーム' },
    { id: 'write', icon: BookOpen, label: '日記を書く' },
    { id: 'calendar', icon: Calendar, label: 'カレンダー' },
    { id: 'profile', icon: Users, label: 'プロフィール' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-inset-bottom">
      <div className="px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => (
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
  );
};
