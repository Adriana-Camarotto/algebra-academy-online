import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { Language } from "@/lib/i18n";

interface LoginFormProps {
  role: UserRole;
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  language: Language;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  role,
  onSubmit,
  loading,
  language,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email", language)}</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{t("password", language)}</Label>
          <a href="#" className="text-sm text-tutor-primary hover:underline">
            {t("forgotPassword", language)}
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
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
            ? "Logging in..."
            : "Entrando..."
          : t("login", language)}
      </Button>

      {role === "admin" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-center text-red-700">
            {language === "en"
              ? "You're logging in as an administrator"
              : "Você está entrando como administrador"}
          </p>
        </div>
      )}
    </form>
  );
};
