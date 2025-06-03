
import { Heart, Sun, Users } from "lucide-react";

interface MobileHeaderProps {
  userType: 'parent' | 'child';
}

export const MobileHeader = ({ userType }: MobileHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 shadow-lg border-b border-amber-200 sticky top-0 z-10 backdrop-blur-sm">
      <div className="px-6 py-5 safe-area-inset-top">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg text-amber-800 font-bold">
                {userType === 'parent' ? '保護者モード' : 'お子様モード'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
