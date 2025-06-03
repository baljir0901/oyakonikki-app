
import { Heart, Sun } from "lucide-react";

interface MobileHeaderProps {
  userType: 'parent' | 'child';
}

export const MobileHeader = ({ userType }: MobileHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 shadow-lg border-b border-amber-200 sticky top-0 z-10 backdrop-blur-sm">
      <div className="px-6 py-5 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                親子日記
              </h1>
              <p className="text-sm text-amber-700 font-medium">
                {userType === 'parent' ? '保護者モード' : 'お子様モード'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-600 font-medium">オンライン</span>
          </div>
        </div>
      </div>
    </header>
  );
};
