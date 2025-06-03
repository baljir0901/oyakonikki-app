
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { DashboardOverview } from "./DashboardOverview";
import { UserManagement } from "./UserManagement";
import { DataManagement } from "./DataManagement";
import { AdminSettings } from "./AdminSettings";
import { ActivityLogs } from "./ActivityLogs";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminDashboardProps {
  adminUser: AdminUser;
}

export const AdminDashboard = ({ adminUser }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "data":
        return <DataManagement />;
      case "logs":
        return <ActivityLogs />;
      case "settings":
        return <AdminSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <AdminHeader 
          adminUser={adminUser} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
