
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole, mockUsers } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AnimatedMathBackground from '@/components/AnimatedMathBackground';

const LoginPage: React.FC = () => {
  const { login, language } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Pre-fill with mock data for demo
    const user = Object.values(mockUsers).find(u => u.role === role);
    if (user) {
      setEmail(user.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      const user = Object.values(mockUsers).find(
        (u) => u.role === selectedRole && u.email === email
      );
      
      if (user) {
        login(user);
        toast({
          title: `${t('welcome', language)}, ${user.name}!`,
          description: language === 'en' 
            ? 'You have successfully logged in.'
            : 'Você entrou com sucesso.',
        });
        navigate(from, { replace: true });
      } else {
        toast({
          title: language === 'en' ? 'Error' : 'Erro',
          description: language === 'en'
            ? 'Invalid credentials. Please try again.'
            : 'Credenciais inválidas. Por favor, tente novamente.',
          variant: "destructive",
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  const roleCards: { role: UserRole; icon: string }[] = [
    { role: 'student', icon: '👨‍🎓' },
    { role: 'parent', icon: '👪' },
    { role: 'tutor', icon: '👩‍🏫' },
    { role: 'admin', icon: '👨‍💼' },
    { role: 'service', icon: '🛠️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tutor-primary/5 to-tutor-secondary/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedMathBackground count={15} opacity="opacity-5" />
      </div>
      
      <div className="w-full max-w-md z-10">
        <Card className="border-tutor-accent/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center gradient-text">
              {t('login', language)}
            </CardTitle>
            <CardDescription className="text-center">
              {selectedRole
                ? `${t('loginAs', language)} ${t(selectedRole, language)}`
                : t('selectRole', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {roleCards.map(({ role, icon }) => (
                  <Button
                    key={role}
                    variant="outline"
                    className={`flex flex-col h-24 items-center justify-center gap-2 hover:bg-tutor-primary/10`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm">{t(role, language)}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email', language)}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{t('password', language)}</Label>
                    <a
                      href="#"
                      className="text-sm text-tutor-primary hover:underline"
                    >
                      {t('forgotPassword', language)}
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-tutor-primary hover:bg-tutor-primary/90"
                  disabled={loading}
                >
                  {loading
                    ? language === 'en'
                      ? 'Logging in...'
                      : 'Entrando...'
                    : t('login', language)}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {selectedRole && (
              <Button
                variant="outline"
                onClick={() => setSelectedRole(null)}
                className="w-full"
              >
                {language === 'en' ? 'Change Role' : 'Mudar Papel'}
              </Button>
            )}
            <p className="text-center text-sm text-muted-foreground">
              {language === 'en'
                ? "Don't have an account? "
                : "Não tem uma conta? "}
              <a
                href="/signup"
                className="text-tutor-primary hover:underline"
              >
                {t('signup', language)}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
