
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';

export const AdminDashboard = () => {
  return (
    <AdminLayout currentPage="dashboard">
      <Dashboard />
    </AdminLayout>
  );
};
