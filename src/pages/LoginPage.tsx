import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AnimatedMathBackground from "@/components/AnimatedMathBackground";

const LoginPage: React.FC = () => {
  const { signInWithSupabase, language } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Get redirect path from location state or default to dashboard
  const getRedirectPath = () => {
    if (location.state?.from?.pathname) {
      return location.state.from.pathname;
    }
    return "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signInWithSupabase(email, password);

      if (error) {
        toast({
          title: language === "en" ? "Error" : "Erro",
          description: error,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (user) {
        toast({
          title: `${t("welcome", language)}, ${user.name}!`,
          description:
            language === "en"
              ? "You have successfully logged in."
              : "Você entrou com sucesso.",
        });

        // Navigate based on user role
        const redirectPath =
          user.role === "student"
            ? "/student"
            : user.role === "admin"
            ? "/admin"
            : user.role === "tutor"
            ? "/tutor"
            : getRedirectPath();

        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "An unexpected error occurred. Please try again."
            : "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tutor-primary/5 to-tutor-secondary/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedMathBackground count={15} opacity="opacity-5" />
      </div>

      <div className="w-full max-w-md z-10">
        <Card className="border-tutor-accent/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center gradient-text">
              {t("login", language)}
            </CardTitle>
            <CardDescription className="text-center">
              {language === "en"
                ? "Enter your email and password to continue"
                : "Digite seu email e senha para continuar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email", language)}</Label>
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
                  <Label htmlFor="password">{t("password", language)}</Label>
                  <a
                    href="#"
                    className="text-sm text-tutor-primary hover:underline"
                  >
                    {t("forgotPassword", language)}
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
                  ? language === "en"
                    ? "Signing in..."
                    : "Entrando..."
                  : t("login", language)}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              {language === "en"
                ? "Don't have an account? "
                : "Não tem uma conta? "}
              <a href="/signup" className="text-tutor-primary hover:underline">
                {t("signup", language)}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
