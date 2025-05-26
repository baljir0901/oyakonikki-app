
import { Heart } from "lucide-react";

interface MobileHeaderProps {
  userType: 'parent' | 'child';
}

export const MobileHeader = ({ userType }: MobileHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="px-4 py-4 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              親子日記
            </h1>
            <p className="text-sm text-gray-500">
              {userType === 'parent' ? '保護者モード' : 'お子様モード'}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
