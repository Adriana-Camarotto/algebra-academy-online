
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User } from 'lucide-react';

const SignupPage: React.FC = () => {
  const { login, language } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
  };

  const validateForm = () => {
    const schema = z.object({
      name: z.string().min(2, { message: language === 'en' ? 'Name is required' : 'Nome é obrigatório' }),
      email: z.string().email({ message: language === 'en' ? 'Invalid email address' : 'Email inválido' }),
      password: z.string().min(8, { 
        message: language === 'en' 
          ? 'Password must be at least 8 characters' 
          : 'A senha deve ter pelo menos 8 caracteres' 
      }),
      confirmPassword: z.string(),
      agreeToTerms: z.boolean().refine(val => val === true, {
        message: language === 'en' ? 'You must agree to the terms' : 'Você deve concordar com os termos'
      }),
    }).refine(data => data.password === data.confirmPassword, {
      message: language === 'en' ? 'Passwords do not match' : 'As senhas não coincidem',
      path: ['confirmPassword']
    });

    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole || !validateForm()) return;
    
    setLoading(true);
    
    // Simulate signup delay
    setTimeout(() => {
      // Generate a mock user ID
      const userId = `${selectedRole}${Date.now().toString().slice(-4)}`;
      
      // Create a new user
      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=4267ac&color=fff`,
      };
      
      // In a real app, we'd save this user to the database
      // For this demo, we'll just log in directly
      login(newUser);
      
      toast({
        title: language === 'en' ? 'Account created!' : 'Conta criada!',
        description: language === 'en' 
          ? 'You have successfully signed up.'
          : 'Você se registrou com sucesso.',
      });
      
      navigate('/dashboard');
      setLoading(false);
    }, 1500);
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
              {t('signup', language)}
            </CardTitle>
            <CardDescription className="text-center">
              {selectedRole
                ? `${language === 'en' ? 'Sign up as' : 'Registrar como'} ${t(selectedRole, language)}`
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
                  <Label htmlFor="name">{language === 'en' ? 'Full Name' : 'Nome Completo'}</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                      placeholder={language === 'en' ? 'John Doe' : 'João Silva'}
                      required
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  </div>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email', language)}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-destructive" : ""}
                    placeholder="name@example.com"
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password', language)}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "border-destructive" : ""}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === 'en' ? 'Confirm Password' : 'Confirmar Senha'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, agreeToTerms: checked === true})}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    {language === 'en' 
                      ? 'I agree to the Terms of Service and Privacy Policy'
                      : 'Concordo com os Termos de Serviço e Política de Privacidade'}
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-tutor-primary hover:bg-tutor-primary/90"
                  disabled={loading}
                >
                  {loading
                    ? language === 'en'
                      ? 'Creating account...'
                      : 'Criando conta...'
                    : t('signup', language)}
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
                ? "Already have an account? "
                : "Já tem uma conta? "}
              <a
                href="/login"
                className="text-tutor-primary hover:underline"
              >
                {t('login', language)}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
