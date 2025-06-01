
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { DashboardView } from "@/components/DashboardView";
import { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center font-japanese">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">読み込み中...</p>
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
