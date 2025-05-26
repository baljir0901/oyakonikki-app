
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MobileHeader } from "./MobileHeader";
import { MobileNavigation } from "./MobileNavigation";
import { HomeTab } from "./tabs/HomeTab";
import { WriteTab } from "./tabs/WriteTab";
import { CalendarTab } from "./tabs/CalendarTab";
import { ProfileTab } from "./tabs/ProfileTab";

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 safe-area-inset font-japanese">
      <MobileHeader userType={userType} />

      <main className="px-4 py-6 pb-24">
        {activeTab === 'home' && <HomeTab userType={userType} />}
        {activeTab === 'write' && <WriteTab userType={userType} />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'profile' && <ProfileTab userType={userType} onSignOut={handleSignOut} />}
      </main>

      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
