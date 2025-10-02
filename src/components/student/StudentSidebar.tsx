import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import {
  Home,
  User,
  BookOpen,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const StudentSidebar: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: language === "en" ? "Dashboard" : "Painel",
      href: "/student",
      active: location.pathname === "/student",
    },
    {
      icon: Calendar,
      label: language === "en" ? "My Bookings" : "Meus Agendamentos",
      href: "/student/bookings",
      active: location.pathname === "/student/bookings",
    },
    {
      icon: BookOpen,
      label: language === "en" ? "Lesson History" : "Histórico de Aulas",
      href: "/student/history",
      active: location.pathname === "/student/history",
    },
    {
      icon: TrendingUp,
      label: language === "en" ? "Progress" : "Progresso",
      href: "/student/progress",
      active: location.pathname === "/student/progress",
    },
  ];

  return (
    <div
      className="w-64 shadow-lg border-r"
      style={{ backgroundColor: "#2F4858" }}
    >
      {/* User Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-white">{user?.name}</h3>
            <p className="text-sm text-white/70">
              {language === "en" ? "Student" : "Estudante"}
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
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
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
    </div>
  );
};

export default StudentSidebar;
