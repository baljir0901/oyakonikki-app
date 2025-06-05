import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { isAdminDomain } from '@/config/domains';

// Simple admin route guard without complex async logic
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminDomain()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main app routes
const mainRoutes = [
  {
    path: '/',
    element: <AuthForm setIsAuthenticated={() => {}} setUserType={() => {}} userType="parent" />
  },
  {
    path: '/login',
    element: <AuthForm setIsAuthenticated={() => {}} setUserType={() => {}} userType="parent" />
  }
];

// Admin routes
const adminRoutes = [
  {
    path: '/',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  },
  {
    path: '/login',
    element: <AuthForm setIsAuthenticated={() => {}} setUserType={() => {}} userType="parent" />
  }
];

// Create router based on domain
export const router = createBrowserRouter(
  isAdminDomain() ? adminRoutes : mainRoutes
);
