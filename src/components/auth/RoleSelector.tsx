import React from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { Language } from "@/lib/i18n";
import {
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  Settings,
  Crown,
} from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  language: Language;
}

const roleCards: {
  role: UserRole;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  description: string;
}[] = [
  {
    role: "student",
    icon: GraduationCap,
    color: "bg-blue-50 border-blue-200 hover:border-tutor-primary",
    gradient: "from-blue-500 to-tutor-primary",
    description: "Learn and grow",
  },
  {
    role: "parent",
    icon: Users,
    color: "bg-green-50 border-green-200 hover:border-tutor-accent",
    gradient: "from-green-500 to-tutor-accent",
    description: "Support your child",
  },
  {
    role: "tutor",
    icon: BookOpen,
    color: "bg-orange-50 border-orange-200 hover:border-tutor-secondary",
    gradient: "from-orange-500 to-tutor-secondary",
    description: "Teach and inspire",
  },
  {
    role: "admin",
    icon: Crown,
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    gradient: "from-purple-500 to-pink-500",
    description: "Manage platform",
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onRoleSelect,
  language,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {language === "en" ? "Select Your Role" : "Seleccione o Seu Papel"}
        </h3>
        <p className="text-sm text-gray-600">
          {language === "en"
            ? "Choose the option that best describes you"
            : "Escolha a opção que melhor o descreve"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {roleCards.map(({ role, icon: Icon, color, gradient, description }) => (
          <Button
            key={role}
            variant="outline"
            className={`relative flex items-center justify-start h-16 p-4 hover:shadow-md transition-all duration-200 ${color} group`}
            onClick={() => onRoleSelect(role)}
          >
            {role === "admin" && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                <Shield className="h-3 w-3 inline mr-1" />
                Admin
              </div>
            )}

            <div
              className={`bg-gradient-to-br ${gradient} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">
                {t(role, language)}
              </div>
              <div className="text-sm text-gray-500">
                {language === "en"
                  ? description
                  : role === "student"
                  ? "Aprender e crescer"
                  : role === "parent"
                  ? "Apoiar o seu filho"
                  : role === "tutor"
                  ? "Ensinar e inspirar"
                  : role === "admin"
                  ? "Gerir plataforma"
                  : "Fornecer serviços"}
              </div>
            </div>

            <div className="text-tutor-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              →
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
