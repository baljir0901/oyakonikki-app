
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MobileHeader } from "./MobileHeader";
import { MobileNavigation } from "./MobileNavigation";
import { HomeTab } from "./tabs/HomeTab";
import { WriteTab } from "./tabs/WriteTab";
import { CalendarTab } from "./tabs/CalendarTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { FamilyTab } from "./tabs/FamilyTab";

interface DashboardViewProps {
  userType: 'parent' | 'child';
}

export const DashboardView = ({ userType }: DashboardViewProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
    } else {
      toast({
        title: "ログアウト",
        description: "ログアウトしました",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 safe-area-inset font-japanese">
      <MobileHeader userType={userType} />

      <main className="px-4 py-6 pb-24 min-h-screen">
        <div className="max-w-lg mx-auto">
          {activeTab === 'home' && <HomeTab userType={userType} />}
          {activeTab === 'write' && <WriteTab userType={userType} />}
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'family' && <FamilyTab userType={userType} />}
          {activeTab === 'profile' && <ProfileTab userType={userType} onSignOut={handleSignOut} />}
        </div>
      </main>

      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
