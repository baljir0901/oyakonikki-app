import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, CreditCard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FamilyManagement } from "./family/FamilyManagement";
import { PaymentSettings } from "./settings/PaymentSettings";

interface DashboardViewProps {
  userType: 'parent' | 'child';
}

export const DashboardView = ({ userType }: DashboardViewProps) => {
  const [activeTab, setActiveTab] = useState('diary');
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "ログアウト完了",
        description: "またお会いしましょう！",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
    }
  };

  if (showSettings) {
    return <PaymentSettings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">親子日記</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <CreditCard className="w-4 h-4 mr-2" />
              プレミアム
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-[240px,1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">メニュー</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TabsList className="flex flex-col w-full rounded-none gap-1 bg-transparent h-auto p-2">
                  <TabsTrigger
                    value="diary"
                    className="w-full justify-start gap-2 px-3"
                    onClick={() => setActiveTab('diary')}
                  >
                    <Settings className="w-4 h-4" />
                    日記管理
                  </TabsTrigger>
                  {userType === 'parent' && (
                    <TabsTrigger
                      value="family"
                      className="w-full justify-start gap-2 px-3"
                      onClick={() => setActiveTab('family')}
                    >
                      <Users className="w-4 h-4" />
                      家族管理
                    </TabsTrigger>
                  )}
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <Tabs value={activeTab} className="space-y-4">
              <TabsContent value="diary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>日記管理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      日記の管理機能は開発中です...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="family" className="space-y-4">
                {userType === 'parent' && <FamilyManagement />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
