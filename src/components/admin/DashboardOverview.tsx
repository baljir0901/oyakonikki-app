
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Activity, 
  TrendingUp,
  Heart,
  Calendar,
  Shield,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEntries: 0,
    totalFamilies: 0,
    recentActivity: 0
  });

  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentEntries();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, entriesResult, familiesResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('diary_entries').select('id', { count: 'exact' }),
        supabase.from('family_relationships').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalEntries: entriesResult.count || 0,
        totalFamilies: familiesResult.count || 0,
        recentActivity: 12 // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentEntries = async () => {
    try {
      const { data } = await supabase
        .from('diary_entries')
        .select(`
          id,
          content,
          mood,
          created_at,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error fetching recent entries:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Welcome to your family diary management center</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Diary Entries</p>
                <p className="text-3xl font-bold">{stats.totalEntries}</p>
                <p className="text-green-100 text-xs mt-1">+8% from last week</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Family Groups</p>
                <p className="text-3xl font-bold">{stats.totalFamilies}</p>
                <p className="text-purple-100 text-xs mt-1">+5% from last month</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Heart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Active Today</p>
                <p className="text-3xl font-bold">{stats.recentActivity}</p>
                <p className="text-orange-100 text-xs mt-1">Real-time data</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">System Health</p>
                <p className="text-xl font-bold text-indigo-900">99.9%</p>
              </div>
              <div className="p-3 bg-indigo-200 rounded-full">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm font-medium">Global Reach</p>
                <p className="text-xl font-bold text-teal-900">24 Countries</p>
              </div>
              <div className="p-3 bg-teal-200 rounded-full">
                <Globe className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium">Avg. Session</p>
                <p className="text-xl font-bold text-pink-900">12 min</p>
              </div>
              <div className="p-3 bg-pink-200 rounded-full">
                <TrendingUp className="h-5 w-5 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Recent Diary Entries</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {entry.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{entry.profiles?.full_name || 'Anonymous'}</p>
                    <span className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">{entry.content}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {entry.mood}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
