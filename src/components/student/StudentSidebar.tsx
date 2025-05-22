
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, hasRole } from '@/lib/auth';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard,
  Calendar,
  History,
  ChartBar,
  MessageSquare,
  FileText,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const StudentSidebar = () => {
  const { language } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: t('dashboard', language),
      icon: LayoutDashboard,
      path: '/student',
    },
    {
      title: t('myLessons', language),
      icon: Calendar,
      path: '/student/schedule',
    },
    {
      title: t('myLessons', language) + ' ' + t('history', language),
      icon: History,
      path: '/student/history',
    },
    {
      title: t('progress', language),
      icon: ChartBar,
      path: '/student/progress',
    },
    {
      title: t('feedback', language),
      icon: MessageSquare,
      path: '/student/feedback',
    },
    {
      title: t('resources', language),
      icon: FileText,
      path: '/student/resources',
    },
    {
      title: t('settings', language),
      icon: Settings,
      path: '/student/settings',
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {language === 'en' ? 'Student Portal' : 'Portal do Aluno'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild onClick={() => navigate(item.path)}>
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;
