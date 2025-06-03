
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  const { adminUser, loading, checkSession } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin />;
  }

  return <AdminDashboard adminUser={adminUser} />;
};

export default Admin;
