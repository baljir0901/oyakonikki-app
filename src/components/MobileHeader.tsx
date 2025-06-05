import { Heart, Sun, Users, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MobileHeaderProps {
  userType: 'parent' | 'child';
}

export const MobileHeader = ({ userType }: MobileHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 shadow-lg border-b border-amber-200 sticky top-0 z-10 backdrop-blur-sm">
      <div className="px-4 py-4 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg text-amber-800 font-bold">
                親子日記
              </p>
              <p className="text-xs text-amber-600">
                {userType === 'parent' ? '保護者モード' : 'お子様モード'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-amber-700 hover:bg-amber-100 relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:bg-amber-100"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Welcome message */}
        <div className="mt-3 text-center">
          <p className="text-sm text-amber-700">
            {userType === 'parent' 
              ? '今日もお子様との素敵な時間を記録しましょう 💕' 
              : '今日の楽しい出来事を書いてみよう ✨'
            }
          </p>
        </div>
      </div>
    </header>
  );
};
