import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Settings, Shield, Home, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, hasRole } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const AdminPanelPage: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const { loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin on component mount
  useEffect(() => {
    // Wait for loading to complete before checking permissions
    if (loading) return;

    console.log("👨‍💼 AdminPanelPage: Checking admin access for user:", user);

    if (!user || !hasRole(user, "admin")) {
      console.log("🚫 AdminPanelPage: Access denied, redirecting to dashboard");
      toast({
        title: language === "en" ? "Access Denied" : "Acesso Negado",
        description:
          language === "en"
            ? "You do not have permission to access the admin panel"
            : "Você não tem permissão para acessar o painel de administração",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      console.log("✅ AdminPanelPage: Admin access granted");
    }
  }, [user, navigate, toast, language, loading]);

  const handleLogout = () => {
    logout();
    toast({
      title: language === "en" ? "Logged out" : "Sessão encerrada",
      description:
        language === "en"
          ? "You have been successfully logged out"
          : "Você foi desconectado com sucesso",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">
            🔐 Verificando permissões de administrador...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">🚫 Acesso negado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  const handleUserManagement = () => {
    navigate("/admin/users");
  };

  const handleSystemSettings = () => {
    navigate("/admin/settings");
  };

  const handleSecurity = () => {
    navigate("/admin/security");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleBookings = () => {
    navigate("/admin/bookings");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#2F4858" }}>
          {language === "en" ? "Admin Panel" : "Painel de Administração"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="flex items-center gap-2"
            style={{ borderColor: "#2F4858", color: "#2F4858" }}
          >
            <Home size={18} />
            {language === "en" ? "Home" : "Início"}
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
            style={{ borderColor: "#F26419", color: "#F26419" }}
          >
            <LogOut size={18} />
            {language === "en" ? "Sign Out" : "Sair"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6" style={{ color: "#F26419" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#2F4858" }}>
              {language === "en"
                ? "Bookings Management"
                : "Gerenciamento de Agendamentos"}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "View and manage all student bookings and lessons."
              : "Visualize e gerencie todos os agendamentos e aulas dos alunos."}
          </p>
          <Button
            className="w-full"
            onClick={handleBookings}
            style={{ backgroundColor: "#F26419", color: "white" }}
          >
            {language === "en" ? "Manage Bookings" : "Gerenciar Agendamentos"}
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6" style={{ color: "#33658A" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#2F4858" }}>
              {language === "en"
                ? "User Management"
                : "Gerenciamento de Usuários"}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "View and manage all user accounts."
              : "Visualize e gerencie todas as contas de usuários."}
          </p>
          <Button
            className="w-full"
            onClick={handleUserManagement}
            style={{ backgroundColor: "#33658A", color: "white" }}
          >
            {language === "en" ? "Manage Users" : "Gerenciar Usuários"}
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6" style={{ color: "#F6AE2D" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#2F4858" }}>
              {language === "en"
                ? "System Settings"
                : "Configurações do Sistema"}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Configure system parameters and settings."
              : "Configure parâmetros e configurações do sistema."}
          </p>
          <Button
            className="w-full"
            onClick={handleSystemSettings}
            style={{ backgroundColor: "#F6AE2D", color: "white" }}
          >
            {language === "en" ? "System Settings" : "Configurações do Sistema"}
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6" style={{ color: "#86BBD8" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#2F4858" }}>
              {language === "en" ? "Security" : "Segurança"}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Manage security settings and permissions."
              : "Gerencie configurações de segurança e permissões."}
          </p>
          <Button
            className="w-full"
            onClick={handleSecurity}
            style={{ backgroundColor: "#86BBD8", color: "white" }}
          >
            {language === "en"
              ? "Security Settings"
              : "Configurações de Segurança"}
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#2F4858" }}>
          {language === "en" ? "System Overview" : "Visão Geral do Sistema"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="bg-white p-4 rounded-md border-2"
            style={{ borderColor: "#33658A" }}
          >
            <p className="text-sm text-gray-600">
              {language === "en" ? "Total Users" : "Total de Usuários"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "#33658A" }}>
              124
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-md border-2"
            style={{ borderColor: "#86BBD8" }}
          >
            <p className="text-sm text-gray-600">
              {language === "en" ? "Active Sessions" : "Sessões Ativas"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "#86BBD8" }}>
              37
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-md border-2"
            style={{ borderColor: "#F6AE2D" }}
          >
            <p className="text-sm text-gray-600">
              {language === "en" ? "Pending Issues" : "Problemas Pendentes"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "#F6AE2D" }}>
              8
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-md border-2"
            style={{ borderColor: "#F26419" }}
          >
            <p className="text-sm text-gray-600">
              {language === "en" ? "System Status" : "Status do Sistema"}
            </p>
            <p className="text-2xl font-bold" style={{ color: "#2F4858" }}>
              {language === "en" ? "Online" : "Online"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
