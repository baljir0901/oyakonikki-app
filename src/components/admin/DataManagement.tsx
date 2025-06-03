
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, Download, Search, Filter, Trash2, Eye } from "lucide-react";

export const DataManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTable, setSelectedTable] = useState("diary_entries");

  // Query for diary entries
  const { data: diaryEntries, isLoading: diaryLoading } = useQuery({
    queryKey: ['admin-diary-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diary_entries')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `);
      
      if (error) {
        console.error('Error fetching diary entries:', error);
        return [];
      }
      return data || [];
    }
  });

  // Query for profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }
      return data || [];
    }
  });

  const filteredDiaryEntries = diaryEntries?.filter(entry =>
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredProfiles = profiles?.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportData = (type: string) => {
    const data = type === 'diary_entries' ? filteredDiaryEntries : filteredProfiles;
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${type}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Data Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage and export application data
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => exportData(selectedTable)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Data Explorer
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTable} onValueChange={setSelectedTable} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50">
              <TabsTrigger value="diary_entries" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Diary Entries
              </TabsTrigger>
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                User Profiles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diary_entries" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Diary Entries</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {filteredDiaryEntries.length} entries
                  </Badge>
                </div>
                
                {diaryLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading diary entries...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDiaryEntries.map((entry) => (
                      <Card key={entry.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{entry.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {entry.content?.substring(0, 100)}...
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Date: {new Date(entry.entry_date).toLocaleDateString()}</span>
                                <span>Type: {entry.entry_type}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="profiles" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Profiles</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {filteredProfiles.length} users
                  </Badge>
                </div>
                
                {profilesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading profiles...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredProfiles.map((profile) => (
                      <Card key={profile.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{profile.full_name || 'No name'}</h4>
                              <p className="text-sm text-muted-foreground">{profile.email}</p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Role: {profile.user_type}</span>
                                <span>Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
