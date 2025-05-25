
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { 
  Home, 
  User, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const StudentSidebar: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: language === 'en' ? 'Dashboard' : 'Painel',
      href: '/student',
      active: location.pathname === '/student'
    },
    {
      icon: Calendar,
      label: language === 'en' ? 'My Bookings' : 'Meus Agendamentos',
      href: '/student/bookings',
      active: location.pathname === '/student/bookings'
    },
    {
      icon: BookOpen,
      label: language === 'en' ? 'Lesson History' : 'Histórico de Aulas',
      href: '/student/history',
      active: location.pathname === '/student/history'
    },
    {
      icon: TrendingUp,
      label: language === 'en' ? 'Progress' : 'Progresso',
      href: '/student/progress',
      active: location.pathname === '/student/progress'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r">
      {/* User Profile Section */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Student' : 'Estudante'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {language === 'en' ? 'Sign Out' : 'Sair'}
        </Button>
      </div>
    </div>
  );
};

export default StudentSidebar;
