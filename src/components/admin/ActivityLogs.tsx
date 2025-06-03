
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Activity, RefreshCw, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  created_at: string;
  admin_users: {
    full_name: string;
    email: string;
  };
}

export const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select(`
          id,
          action,
          resource_type,
          resource_id,
          details,
          created_at,
          admin_users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.admin_users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadgeColor = (action: string) => {
    const colorMap: Record<string, string> = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-gray-100 text-gray-800',
      'create': 'bg-blue-100 text-blue-800',
      'update': 'bg-yellow-100 text-yellow-800',
      'delete': 'bg-red-100 text-red-800',
      'view': 'bg-purple-100 text-purple-800'
    };
    return colorMap[action.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const totalLogs = logs.length;
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.created_at);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-1">Monitor admin actions and system events</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Total Activities</p>
                <p className="text-2xl font-bold text-red-900">{totalLogs}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Today's Activities</p>
                <p className="text-2xl font-bold text-orange-900">{todayLogs}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium">Security Events</p>
                <p className="text-2xl font-bold text-pink-900">{logs.filter(l => l.action === 'login').length}</p>
              </div>
              <div className="p-3 bg-pink-200 rounded-full">
                <Shield className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-600" />
              <span>Admin Activity</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Admin User</TableHead>
                  <TableHead className="font-semibold text-gray-700">Action</TableHead>
                  <TableHead className="font-semibold text-gray-700">Resource</TableHead>
                  <TableHead className="font-semibold text-gray-700">Details</TableHead>
                  <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => (
                  <TableRow key={log.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {log.admin_users?.full_name 
                            ? log.admin_users.full_name.charAt(0).toUpperCase() 
                            : 'S'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {log.admin_users?.full_name || 'System'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getActionBadgeColor(log.action)} border-0 capitalize`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {log.resource_type}
                        {log.resource_id && `:${log.resource_id.substring(0, 8)}...`}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {log.details && (
                        <div className="truncate text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {JSON.stringify(log.details).substring(0, 50)}...
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
