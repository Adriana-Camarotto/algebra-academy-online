
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardPage: React.FC = () => {
  const { user, logout, language } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Dashboard' : 'Painel de Controle'}
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

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar && (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'en' ? 'Recent Activity' : 'Atividade Recente'}
          </h3>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'No recent activity to show.' 
              : 'Nenhuma atividade recente para mostrar.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
