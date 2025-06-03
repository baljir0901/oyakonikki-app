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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, Trash2, Download, Database, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id: string;
  content: string;
  mood: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export const DataManagement = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select(`
          id,
          content,
          mood,
          created_at,
          user_id,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedData = data?.map(entry => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        created_at: entry.created_at,
        user_name: entry.profiles?.full_name || 'Unknown',
        user_email: entry.profiles?.email || 'Unknown'
      })) || [];
      
      setEntries(processedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch diary entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = entries.length;
  const recentEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate > weekAgo;
  }).length;

  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      'happy': '😊',
      'sad': '😢',
      'excited': '🤩',
      'calm': '😌',
      'angry': '😠',
      'neutral': '😐'
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      'happy': 'bg-yellow-100 text-yellow-800',
      'sad': 'bg-blue-100 text-blue-800',
      'excited': 'bg-purple-100 text-purple-800',
      'calm': 'bg-green-100 text-green-800',
      'angry': 'bg-red-100 text-red-800',
      'neutral': 'bg-gray-100 text-gray-800'
    };
    return colorMap[mood] || 'bg-gray-100 text-gray-800';
  };

  const exportData = (entries: DiaryEntry[]) => {
    const csvContent = entries.map(entry => {
      return [
        entry.user_name || 'Unknown',
        entry.mood,
        entry.content,
        new Date(entry.created_at).toLocaleDateString()
      ].join(',');
    }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diary_entries.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete diary entry",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Data Management
          </h1>
          <p className="text-gray-600 mt-1">Manage diary entries and user content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Total Entries</p>
                <p className="text-2xl font-bold text-indigo-900">{totalEntries}</p>
              </div>
              <div className="p-3 bg-indigo-200 rounded-full">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold text-emerald-900">{recentEntries}</p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-full">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Most Common Mood</p>
                <p className="text-2xl font-bold text-amber-900">
                  {Object.keys(moodCounts).length > 0 
                    ? Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0][0] 
                    : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-amber-200 rounded-full">
                <span className="text-2xl">😊</span>
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
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Diary Entries</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                  <TableHead className="font-semibold text-gray-700">Author</TableHead>
                  <TableHead className="font-semibold text-gray-700">Mood</TableHead>
                  <TableHead className="font-semibold text-gray-700">Content Preview</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry, index) => (
                  <TableRow key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {entry.user_name 
                            ? entry.user_name.charAt(0).toUpperCase() 
                            : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {entry.user_name || 'Unknown User'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getMoodColor(entry.mood)} border-0`}>
                        {getMoodEmoji(entry.mood)} {entry.mood}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-gray-600">
                        {entry.content?.substring(0, 100)}
                        {entry.content?.length > 100 && '...'}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-lg">
                          <DropdownMenuItem className="hover:bg-blue-50">
                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                            View Full Entry
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
