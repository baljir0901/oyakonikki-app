
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Shield } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminHeaderProps {
  adminUser: AdminUser;
  onToggleSidebar: () => void;
}

export const AdminHeader = ({ adminUser, onToggleSidebar }: AdminHeaderProps) => {
  const { adminLogout } = useAdminAuth();

  const handleLogout = async () => {
    await adminLogout();
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span className="capitalize">{adminUser.role.replace('_', ' ')}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {adminUser.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{adminUser.full_name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
