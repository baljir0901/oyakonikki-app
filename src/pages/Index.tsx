
import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { DashboardView } from "@/components/DashboardView";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');

  if (isAuthenticated) {
    return <DashboardView userType={userType} setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <AuthForm 
      setIsAuthenticated={setIsAuthenticated} 
      setUserType={setUserType} 
      userType={userType} 
    />
  );
};

export default Index;
