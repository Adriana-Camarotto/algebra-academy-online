import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAuthStore } from "@/lib/auth";
import AnimatedMathBackground from "@/components/AnimatedMathBackground";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const { language } = useAuthStore();
  const { signIn, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = async (email: string, password: string) => {
    console.log("🔥 USING NEW LOGIN VERSION - INSTANT LOGIN");
    setLoading(true);
    const { error } = await signIn(email, password);

    if (!error) {
      // Wait for the auth store to be updated before redirecting
      // Use a very fast polling approach
      let attempts = 0;
      const maxAttempts = 50; // Wait up to 2.5 seconds (50 * 50ms)

      const checkAuthAndRedirect = () => {
        const { user, isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated && user) {
          console.log("User authenticated, redirecting...", user);
          // Redirect based on actual user role from the store
          let redirectUrl = "/dashboard"; // default
          if (user.role === "student") {
            redirectUrl = "/student";
          } else if (user.role === "admin") {
            redirectUrl = "/admin";
          }
          console.log(`🎯 Redirecting ${user.role} to ${redirectUrl}`);
          window.location.href = redirectUrl;
          setLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkAuthAndRedirect, 50); // Check every 50ms (very fast)
        } else {
          console.warn("Timeout waiting for user authentication");
          // Fallback redirect using selected role
          let fallbackUrl = "/dashboard"; // default
          if (selectedRole === "student") {
            fallbackUrl = "/student";
          } else if (selectedRole === "admin") {
            fallbackUrl = "/admin";
          }
          console.log(
            `⚠️ Fallback redirect for ${selectedRole} to ${fallbackUrl}`
          );
          window.location.href = fallbackUrl;
          setLoading(false);
        }
      };

      // Start checking auth state
      checkAuthAndRedirect();
    } else {
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
              {selectedRole
                ? `${t("loginAs", language)} ${t(selectedRole, language)}`
                : t("selectRole", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <RoleSelector
                onRoleSelect={handleRoleSelect}
                language={language}
              />
            ) : (
              <LoginForm
                role={selectedRole}
                onSubmit={handleLogin}
                loading={loading || authLoading}
                language={language}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {selectedRole && (
              <Button
                variant="outline"
                onClick={() => setSelectedRole(null)}
                className="w-full"
              >
                {language === "en" ? "Change Role" : "Mudar Papel"}
              </Button>
            )}
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
