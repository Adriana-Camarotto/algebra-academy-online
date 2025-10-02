import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/lib/auth";
import { Language } from "@/lib/i18n";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { z } from "zod";

interface SignupFormProps {
  role: UserRole;
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
  language: Language;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  role,
  onSubmit,
  loading,
  language,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const schema = z
      .object({
        name: z.string().min(2, {
          message:
            language === "en"
              ? "Name must be at least 2 characters"
              : "Nome deve ter pelo menos 2 caracteres",
        }),
        email: z.string().email({
          message:
            language === "en"
              ? "Please enter a valid email address"
              : "Por favor insira um email válido",
        }),
        password: z.string().min(8, {
          message:
            language === "en"
              ? "Password must be at least 8 characters"
              : "A senha deve ter pelo menos 8 caracteres",
        }),
        confirmPassword: z.string(),
        agreeToTerms: z.boolean().refine((val) => val === true, {
          message:
            language === "en"
              ? "You must agree to the terms and conditions"
              : "Você deve concordar com os termos e condições",
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message:
          language === "en"
            ? "Passwords do not match"
            : "As senhas não coincidem",
        path: ["confirmPassword"],
      });

    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
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
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData.email, formData.password, formData.name);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-900">
          {language === "en" ? "Full Name" : "Nome Completo"}
        </Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`pl-10 transition-colors ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-tutor-primary focus:ring-tutor-primary/20"
            }`}
            placeholder={
              language === "en"
                ? "Enter your full name"
                : "Insira o seu nome completo"
            }
            required
          />
          <User
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              errors.name ? "text-red-500" : "text-gray-400"
            }`}
          />
          {formData.name && !errors.name && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tutor-accent" />
          )}
        </div>
        {errors.name && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{errors.name}</p>
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
          {language === "en" ? "Email Address" : "Endereço de Email"}
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 transition-colors ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-tutor-primary focus:ring-tutor-primary/20"
            }`}
            placeholder={
              language === "en" ? "Enter your email" : "Insira o seu email"
            }
            required
          />
          <Mail
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              errors.email ? "text-red-500" : "text-gray-400"
            }`}
          />
          {formData.email &&
            !errors.email &&
            /\S+@\S+\.\S+/.test(formData.email) && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tutor-accent" />
            )}
        </div>
        {errors.email && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{errors.email}</p>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-900">
          {language === "en" ? "Password" : "Senha"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 pr-10 transition-colors ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-tutor-primary focus:ring-tutor-primary/20"
            }`}
            placeholder={
              language === "en"
                ? "Create a strong password"
                : "Crie uma senha forte"
            }
            required
          />
          <Lock
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              errors.password ? "text-red-500" : "text-gray-400"
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < passwordStrength
                      ? passwordStrength <= 2
                        ? "bg-red-500"
                        : passwordStrength <= 3
                        ? "bg-yellow-500"
                        : "bg-tutor-accent"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs ${
                passwordStrength <= 2
                  ? "text-red-600"
                  : passwordStrength <= 3
                  ? "text-yellow-600"
                  : "text-tutor-accent"
              }`}
            >
              {language === "en"
                ? passwordStrength <= 2
                  ? "Weak"
                  : passwordStrength <= 3
                  ? "Medium"
                  : "Strong"
                : passwordStrength <= 2
                ? "Fraca"
                : passwordStrength <= 3
                ? "Média"
                : "Forte"}
            </p>
          </div>
        )}

        {errors.password && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{errors.password}</p>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-900"
        >
          {language === "en" ? "Confirm Password" : "Confirmar Senha"}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`pl-10 pr-10 transition-colors ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : formData.confirmPassword &&
                  formData.password === formData.confirmPassword
                ? "border-tutor-accent focus:border-tutor-accent focus:ring-tutor-accent/20"
                : "border-gray-300 focus:border-tutor-primary focus:ring-tutor-primary/20"
            }`}
            placeholder={
              language === "en"
                ? "Confirm your password"
                : "Confirme a sua senha"
            }
            required
          />
          <Lock
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              errors.confirmPassword ? "text-red-500" : "text-gray-400"
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
          {formData.confirmPassword &&
            formData.password === formData.confirmPassword && (
              <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tutor-accent" />
            )}
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{errors.confirmPassword}</p>
          </div>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeToTerms: checked === true })
            }
            className="mt-1 data-[state=checked]:bg-tutor-primary data-[state=checked]:border-tutor-primary"
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm text-gray-700 leading-relaxed"
          >
            {language === "en" ? "I agree to the " : "Concordo com os "}
            <a
              href="/terms"
              className="text-tutor-primary hover:text-tutor-secondary underline"
            >
              {language === "en" ? "Terms of Service" : "Termos de Serviço"}
            </a>
            {language === "en" ? " and " : " e "}
            <a
              href="/privacy"
              className="text-tutor-primary hover:text-tutor-secondary underline"
            >
              {language === "en" ? "Privacy Policy" : "Política de Privacidade"}
            </a>
          </Label>
        </div>
        {errors.agreeToTerms && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{errors.agreeToTerms}</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full btn-primary text-white font-medium py-3 text-base hover:shadow-lg transition-all duration-200"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>
              {language === "en" ? "Creating Account..." : "Criando Conta..."}
            </span>
          </div>
        ) : language === "en" ? (
          "Create Account"
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  );
};
