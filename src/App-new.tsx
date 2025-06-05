import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // Check if admin domain
      if (window.location.hostname === 'admin-oyakonikki.netlify.app') {
        setUserType('parent');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const isAdminDomain = window.location.hostname === 'admin-oyakonikki.netlify.app';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {isAdminDomain ? (
              <>
                <Route 
                  path="/" 
                  element={
                    isAuthenticated ? (
                      <AdminDashboard />
                    ) : (
                      <AuthForm 
                        setIsAuthenticated={setIsAuthenticated}
                        setUserType={setUserType}
                        userType={userType}
                      />
                    )
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <AuthForm 
                      setIsAuthenticated={setIsAuthenticated}
                      setUserType={setUserType}
                      userType={userType}
                    />
                  } 
                />
              </>
            ) : (
              <Route path="/" element={<Index />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
