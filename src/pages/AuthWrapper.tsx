
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole, hasRole } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface AuthWrapperProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, language } = useAuthStore();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !hasRole(user, allowedRoles)) {
      toast({
        title: t('unauthorized', language),
        description: language === 'en' 
          ? `You don't have permission to access this page.`
          : `Você não tem permissão para acessar esta página.`,
        variant: "destructive",
      });
    }
  }, [user, isAuthenticated, allowedRoles, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
