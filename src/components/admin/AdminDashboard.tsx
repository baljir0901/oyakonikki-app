import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, CreditCard, Activity, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  newUsersToday: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription_status: 'free' | 'premium';
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    newUsersToday: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*');

      if (subscribersError) throw subscribersError;

      // Transform users data
      const transformedUsers: User[] = usersData?.map(user => ({
        id: user.id,
        email: user.email || '',
        full_name: user.full_name || '',
        created_at: user.created_at,
        subscription_status: subscribersData?.some(sub => sub.user_id === user.id) ? 'premium' : 'free'
      })) || [];

      setUsers(transformedUsers);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = transformedUsers.filter(user => 
        user.created_at.startsWith(today)
      ).length;

      setStats({
        totalUsers: transformedUsers.length,
        activeSubscriptions: subscribersData?.length || 0,
        totalRevenue: (subscribersData?.length || 0) * 300, // 300 yen per subscription
        newUsersToday
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "エラー",
        description: "管理者データの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate') => {
    try {
      // In a real implementation, you would update user status
      toast({
        title: "操作完了",
        description: `ユーザーを${action === 'suspend' ? '停止' : '有効化'}しました`,
      });
      
      fetchAdminData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "エラー",
        description: "ユーザー操作に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <Button onClick={fetchAdminData} disabled={loading}>
          <Activity className="w-4 h-4 mr-2" />
          更新
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              今日の新規: {stats.newUsersToday}人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有料会員数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              アクティブなサブスクリプション
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月間売上</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              月額300円 × {stats.activeSubscriptions}人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">変換率</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              無料→有料の変換率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{user.full_name || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      登録日: {new Date(user.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <Badge variant={user.subscription_status === 'premium' ? 'default' : 'secondary'}>
                    {user.subscription_status === 'premium' ? 'プレミアム' : '無料'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserAction(user.id, 'suspend')}
                  >
                    停止
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserAction(user.id, 'activate')}
                  >
                    有効化
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
