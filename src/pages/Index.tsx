
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { DashboardView } from "@/components/DashboardView";
import { SplashScreen } from "@/components/SplashScreen";
import { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center font-japanese">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-800 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <DashboardView userType={userType} />;
  }

  return (
    <AuthForm 
      setIsAuthenticated={() => {}} 
      setUserType={setUserType} 
      userType={userType} 
    />
  );
};

export default Index;
