
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore, hasRole } from '@/lib/auth';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import StudentSidebar from '@/components/student/StudentSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const StudentDashboardLayout = () => {
  const { user, isAuthenticated, language } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated || (user && !hasRole(user, ['student', 'parent']))) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (user && !hasRole(user, ['student', 'parent']))) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            
            <div className="flex-1" />
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="flex items-center gap-3">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium hidden md:inline">{user?.name}</span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboardLayout;
