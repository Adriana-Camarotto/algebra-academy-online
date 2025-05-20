
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, hasRole } from '@/lib/auth';

const AdminPanelPage: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin on component mount
  useEffect(() => {
    if (!user || !hasRole(user, 'admin')) {
      toast({
        title: language === 'en' ? 'Access Denied' : 'Acesso Negado',
        description: language === 'en' 
          ? 'You do not have permission to access the admin panel' 
          : 'Você não tem permissão para acessar o painel de administração',
        variant: 'destructive'
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast, language]);

  const handleLogout = () => {
    logout();
    toast({
      title: language === 'en' ? 'Logged out' : 'Sessão encerrada',
      description: language === 'en' 
        ? 'You have been successfully logged out' 
        : 'Você foi desconectado com sucesso',
    });
    navigate('/');
  };

  if (!user || !hasRole(user, 'admin')) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Admin Panel' : 'Painel de Administração'}
        </h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          {language === 'en' ? 'Sign Out' : 'Sair'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'User Management' : 'Gerenciamento de Usuários'}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'View and manage all user accounts.' 
              : 'Visualize e gerencie todas as contas de usuários.'}
          </p>
          <Button className="w-full">
            {language === 'en' ? 'Manage Users' : 'Gerenciar Usuários'}
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'System Settings' : 'Configurações do Sistema'}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'Configure system parameters and settings.' 
              : 'Configure parâmetros e configurações do sistema.'}
          </p>
          <Button className="w-full">
            {language === 'en' ? 'System Settings' : 'Configurações do Sistema'}
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Security' : 'Segurança'}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {language === 'en' 
              ? 'Manage security settings and permissions.' 
              : 'Gerencie configurações de segurança e permissões.'}
          </p>
          <Button className="w-full">
            {language === 'en' ? 'Security Settings' : 'Configurações de Segurança'}
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'System Overview' : 'Visão Geral do Sistema'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Total Users' : 'Total de Usuários'}
            </p>
            <p className="text-2xl font-bold">124</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Active Sessions' : 'Sessões Ativas'}
            </p>
            <p className="text-2xl font-bold">37</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Pending Issues' : 'Problemas Pendentes'}
            </p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'System Status' : 'Status do Sistema'}
            </p>
            <p className="text-2xl font-bold text-green-600">
              {language === 'en' ? 'Online' : 'Online'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
