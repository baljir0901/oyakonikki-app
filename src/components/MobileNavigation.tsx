
import { Heart, BookOpen, Calendar, Users } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, setActiveTab }: MobileNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Heart, label: 'ホーム', color: 'from-red-400 to-pink-500' },
    { id: 'write', icon: BookOpen, label: '日記を書く', color: 'from-amber-400 to-yellow-500' },
    { id: 'calendar', icon: Calendar, label: 'カレンダー', color: 'from-orange-400 to-amber-500' },
    { id: 'profile', icon: Users, label: 'プロフィール', color: 'from-yellow-400 to-orange-500' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-2xl safe-area-inset-bottom">
      <div className="px-2 py-1">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-300 min-w-0 flex-1 group ${
                activeTab === tab.id
                  ? 'text-white scale-110 shadow-lg'
                  : 'text-amber-600 hover:text-amber-800 active:bg-amber-50 hover:scale-105'
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-2xl shadow-lg`}></div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`p-2 rounded-xl mb-1 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'group-hover:bg-amber-100'
                }`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold tracking-wide">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
