
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Activity, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar = ({ activeTab, setActiveTab, isOpen, onToggle }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'data', icon: Database, label: 'Data Management' },
    { id: 'logs', icon: Activity, label: 'Activity Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {isOpen && (
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${isOpen ? 'justify-start' : 'justify-center'} px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};
