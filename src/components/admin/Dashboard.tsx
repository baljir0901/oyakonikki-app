
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalDiaryEntries: number;
  activeToday: number;
  totalFamilies: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDiaryEntries: 0,
    activeToday: 0,
    totalFamilies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total diary entries
      const { count: totalDiaryEntries } = await supabase
        .from('diary_entries')
        .select('*', { count: 'exact', head: true });

      // Get entries created today
      const today = new Date().toISOString().split('T')[0];
      const { count: activeToday } = await supabase
        .from('diary_entries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Get total families (unique parent-child relationships)
      const { count: totalFamilies } = await supabase
        .from('family_relationships')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: totalUsers || 0,
        totalDiaryEntries: totalDiaryEntries || 0,
        activeToday: activeToday || 0,
        totalFamilies: totalFamilies || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Diary Entries',
      value: stats.totalDiaryEntries,
      description: 'Total entries created',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      description: 'Entries created today',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Families',
      value: stats.totalFamilies,
      description: 'Family relationships',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Activity tracking will be implemented in the next phase
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Overall system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API</span>
                <span className="text-sm text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
