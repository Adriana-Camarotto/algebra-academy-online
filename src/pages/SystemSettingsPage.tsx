import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Bell,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, hasRole } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const SystemSettingsPage: React.FC = () => {
  const { user, language } = useAuthStore();
  const { loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // System settings state
  const [settings, setSettings] = useState({
    siteName: "Algebra Academy Online",
    siteDescription: "Plataforma de ensino de matemática online",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    backupFrequency: "daily",
    sessionTimeout: "24",
    maxFileSize: "10",
    supportEmail: "support@algebraacademy.com",
    timezone: "America/Sao_Paulo",
  });

  const [saving, setSaving] = useState(false);

  // Check admin permissions
  useEffect(() => {
    if (loading) return;

    if (!user || !hasRole(user, "admin")) {
      toast({
        title: language === "en" ? "Access Denied" : "Acesso Negado",
        description:
          language === "en"
            ? "You do not have permission to access system settings"
            : "Você não tem permissão para acessar as configurações do sistema",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast, language, loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would typically save to your backend/database
      // For now, we'll simulate a save operation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: language === "en" ? "Settings Saved" : "Configurações Salvas",
        description:
          language === "en"
            ? "System settings have been updated successfully"
            : "As configurações do sistema foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to save settings"
            : "Falha ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">🔧 Carregando configurações do sistema...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">🚫 Acesso negado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {language === "en"
              ? "Back to Admin Panel"
              : "Voltar ao Painel Admin"}
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#2F4858" }}>
              {language === "en"
                ? "System Settings"
                : "Configurações do Sistema"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Configure system parameters and general settings"
                : "Configure parâmetros do sistema e configurações gerais"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving
            ? language === "en"
              ? "Saving..."
              : "Salvando..."
            : language === "en"
            ? "Save Changes"
            : "Salvar Alterações"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} />
              {language === "en" ? "General Settings" : "Configurações Gerais"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Basic system configuration and site information"
                : "Configuração básica do sistema e informações do site"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">
                {language === "en" ? "Site Name" : "Nome do Site"}
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">
                {language === "en" ? "Site Description" : "Descrição do Site"}
              </Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">
                {language === "en" ? "Support Email" : "Email de Suporte"}
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  handleInputChange("supportEmail", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="timezone">
                {language === "en"
                  ? "System Timezone"
                  : "Fuso Horário do Sistema"}
              </Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              {language === "en"
                ? "System Behavior"
                : "Comportamento do Sistema"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Control system functionality and access"
                : "Controle a funcionalidade e acesso do sistema"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "en"
                    ? "Maintenance Mode"
                    : "Modo de Manutenção"}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Temporarily disable site access"
                    : "Desabilitar temporariamente o acesso ao site"}
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  handleInputChange("maintenanceMode", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "en"
                    ? "User Registration"
                    : "Registro de Usuários"}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Allow new users to register"
                    : "Permitir que novos usuários se registrem"}
                </p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) =>
                  handleInputChange("registrationEnabled", checked)
                }
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">
                {language === "en"
                  ? "Session Timeout (hours)"
                  : "Timeout de Sessão (horas)"}
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  handleInputChange("sessionTimeout", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="maxFileSize">
                {language === "en"
                  ? "Max File Size (MB)"
                  : "Tamanho Máximo de Arquivo (MB)"}
              </Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) =>
                  handleInputChange("maxFileSize", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              {language === "en" ? "Notifications" : "Notificações"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Configure notification preferences"
                : "Configure preferências de notificação"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "en"
                    ? "Email Notifications"
                    : "Notificações por Email"}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Send system notifications via email"
                    : "Enviar notificações do sistema por email"}
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleInputChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "en"
                    ? "SMS Notifications"
                    : "Notificações por SMS"}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Send critical alerts via SMS"
                    : "Enviar alertas críticos por SMS"}
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  handleInputChange("smsNotifications", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup & Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={20} />
              {language === "en"
                ? "Backup & Maintenance"
                : "Backup e Manutenção"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Configure automated backup and maintenance tasks"
                : "Configure backup automático e tarefas de manutenção"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backupFrequency">
                {language === "en"
                  ? "Backup Frequency"
                  : "Frequência de Backup"}
              </Label>
              <select
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.backupFrequency}
                onChange={(e) =>
                  handleInputChange("backupFrequency", e.target.value)
                }
              >
                <option value="hourly">
                  {language === "en" ? "Hourly" : "Por Hora"}
                </option>
                <option value="daily">
                  {language === "en" ? "Daily" : "Diário"}
                </option>
                <option value="weekly">
                  {language === "en" ? "Weekly" : "Semanal"}
                </option>
                <option value="monthly">
                  {language === "en" ? "Monthly" : "Mensal"}
                </option>
              </select>
            </div>
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                {language === "en"
                  ? "Run Manual Backup"
                  : "Executar Backup Manual"}
              </Button>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                {language === "en"
                  ? "System Health Check"
                  : "Verificação de Saúde do Sistema"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
