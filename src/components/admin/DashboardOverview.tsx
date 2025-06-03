
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Heart, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalUsers: number;
  totalDiaryEntries: number;
  totalFamilies: number;
  recentActivity: number;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDiaryEntries: 0,
    totalFamilies: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total diary entries
      const { count: entriesCount } = await supabase
        .from('diary_entries')
        .select('*', { count: 'exact', head: true });

      // Get total families (unique parent-child relationships)
      const { count: familiesCount } = await supabase
        .from('family_relationships')
        .select('*', { count: 'exact', head: true });

      // Get recent activity (entries from last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('diary_entries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalUsers: usersCount || 0,
        totalDiaryEntries: entriesCount || 0,
        totalFamilies: familiesCount || 0,
        recentActivity: recentCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Diary Entries",
      value: stats.totalDiaryEntries,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Family Connections",
      value: stats.totalFamilies,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Recent Activity (7d)",
      value: stats.recentActivity,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Database</span>
                <span className="text-green-600 text-sm font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Authentication</span>
                <span className="text-green-600 text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Storage</span>
                <span className="text-green-600 text-sm font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                View Recent Users
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                Export Data
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                System Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
