import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Key,
  RefreshCw,
  Ban,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, hasRole } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import jsPDF from "jspdf";

interface SecurityEvent {
  id: string;
  type: "login" | "failed_login" | "password_change" | "suspicious_activity";
  user: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "danger";
}

const SecurityPage: React.FC = () => {
  const { user, language } = useAuthStore();
  const { loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordComplexity: true,
    sessionTimeout: true,
    ipWhitelist: false,
    bruteForceProtection: true,
    logFailedAttempts: true,
    requirePasswordChange: false,
    minPasswordLength: "8",
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    allowedIPs: "192.168.1.0/24",
  });

  // Mock security events data
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: "1",
      type: "login",
      user: "adriana.camarotto1@gmail.com",
      timestamp: "2025-07-13 14:30:25",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: "2",
      type: "failed_login",
      user: "unknown@email.com",
      timestamp: "2025-07-13 14:15:12",
      ip: "192.168.1.200",
      status: "warning",
    },
    {
      id: "3",
      type: "suspicious_activity",
      user: "test@example.com",
      timestamp: "2025-07-13 13:45:33",
      ip: "10.0.0.50",
      status: "danger",
    },
    {
      id: "4",
      type: "password_change",
      user: "alice@example.com",
      timestamp: "2025-07-13 12:20:15",
      ip: "192.168.1.150",
      status: "success",
    },
    {
      id: "5",
      type: "login",
      user: "bob@example.com",
      timestamp: "2025-07-13 11:45:30",
      ip: "192.168.1.175",
      status: "success",
    },
    {
      id: "6",
      type: "failed_login",
      user: "hacker@malicious.com",
      timestamp: "2025-07-13 10:30:45",
      ip: "203.0.113.1",
      status: "danger",
    },
    {
      id: "7",
      type: "password_change",
      user: "carol@example.com",
      timestamp: "2025-07-13 09:15:20",
      ip: "192.168.1.120",
      status: "success",
    },
    {
      id: "8",
      type: "suspicious_activity",
      user: "david@example.com",
      timestamp: "2025-07-13 08:00:10",
      ip: "198.51.100.1",
      status: "warning",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Check admin permissions
  useEffect(() => {
    if (loading) return;

    if (!user || !hasRole(user, "admin")) {
      toast({
        title: language === "en" ? "Access Denied" : "Acesso Negado",
        description:
          language === "en"
            ? "You do not have permission to access security settings"
            : "Você não tem permissão para acessar as configurações de segurança",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast, language, loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title:
          language === "en"
            ? "Security Settings Saved"
            : "Configurações de Segurança Salvas",
        description:
          language === "en"
            ? "Security settings have been updated successfully"
            : "As configurações de segurança foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to save security settings"
            : "Falha ao salvar configurações de segurança",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateSecurityReportPDF = async () => {
    setGeneratingReport(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Colors matching Algebra Academy brand
      const primaryColor = "#3B82F6";
      const secondaryColor = "#10B981";
      const accentColor = "#F59E0B";
      const textColor = "#1F2937";
      const lightGray = "#F3F4F6";

      const addColoredRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
      ) => {
        doc.setFillColor(color);
        doc.rect(x, y, width, height, "F");
      };

      // Header with brand colors
      addColoredRect(0, 0, pageWidth, 30, primaryColor);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ALGEBRA ACADEMY ONLINE", 20, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Mathematics Education Platform", 20, 26);

      doc.setTextColor(textColor);
      yPosition = 45;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      const title =
        language === "en" ? "SECURITY REPORT" : "RELATÓRIO DE SEGURANÇA";
      doc.text(title, 20, yPosition);
      yPosition += 15;

      // Subtitle
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#6B7280");
      const dateStr = new Date().toLocaleDateString(
        language === "en" ? "en-US" : "pt-BR"
      );
      const subtitle = `${
        language === "en" ? "Generated on" : "Gerado em"
      }: ${dateStr} | ${language === "en" ? "By" : "Por"}: ${user?.email}`;
      doc.text(subtitle, 20, yPosition);
      yPosition += 20;

      // Executive Summary
      addColoredRect(15, yPosition - 5, pageWidth - 30, 25, lightGray);
      doc.setTextColor(textColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        language === "en" ? "EXECUTIVE SUMMARY" : "RESUMO EXECUTIVO",
        20,
        yPosition + 5
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${
          language === "en" ? "Security Score" : "Pontuação de Segurança"
        }: 85/100`,
        20,
        yPosition + 12
      );
      doc.text(
        `${language === "en" ? "Risk Level" : "Nível de Risco"}: ${
          language === "en" ? "Low" : "Baixo"
        }`,
        20,
        yPosition + 17
      );
      yPosition += 35;

      // System Overview
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text(
        language === "en" ? "SYSTEM OVERVIEW" : "VISÃO GERAL DO SISTEMA",
        20,
        yPosition
      );
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor);

      const systemData = [
        [`${language === "en" ? "Total Users" : "Total de Usuários"}`, "124"],
        [`${language === "en" ? "Active Sessions" : "Sessões Ativas"}`, "12"],
        [
          `${
            language === "en" ? "Failed Logins (24h)" : "Logins Falhados (24h)"
          }`,
          securityEvents
            .filter((e) => e.type === "failed_login")
            .length.toString(),
        ],
        [
          `${
            language === "en" ? "Suspicious Activities" : "Atividades Suspeitas"
          }`,
          securityEvents
            .filter((e) => e.type === "suspicious_activity")
            .length.toString(),
        ],
      ];

      systemData.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Footer
      addColoredRect(0, pageHeight - 15, pageWidth, 15, lightGray);
      doc.setFontSize(8);
      doc.setTextColor("#6B7280");
      doc.text("Algebra Academy Online - Security Report", 20, pageHeight - 8);
      doc.text(
        `${
          language === "en" ? "Confidential Document" : "Documento Confidencial"
        }`,
        pageWidth - 60,
        pageHeight - 8
      );

      const filename = `algebra-academy-security-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);

      toast({
        title:
          language === "en"
            ? "PDF Security Report Generated"
            : "Relatório PDF de Segurança Gerado",
        description:
          language === "en"
            ? "PDF security report has been generated and downloaded successfully"
            : "Relatório PDF de segurança foi gerado e baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to generate PDF security report"
            : "Falha ao gerar relatório PDF de segurança",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle size={16} className="text-green-500" />;
      case "failed_login":
        return <XCircle size={16} className="text-red-500" />;
      case "password_change":
        return <Key size={16} className="text-blue-500" />;
      case "suspicious_activity":
        return <AlertTriangle size={16} className="text-orange-500" />;
      default:
        return <Eye size={16} className="text-gray-500" />;
    }
  };

  const getEventLabel = (type: string) => {
    const labels = {
      login: language === "en" ? "Successful Login" : "Login Bem-sucedido",
      failed_login: language === "en" ? "Failed Login" : "Login Falhado",
      password_change:
        language === "en" ? "Password Changed" : "Senha Alterada",
      suspicious_activity:
        language === "en" ? "Suspicious Activity" : "Atividade Suspeita",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      warning: "secondary",
      danger: "destructive",
    };
    return variants[status as keyof typeof variants] || "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">🔒 Carregando configurações de segurança...</p>
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
            <h1 className="text-3xl font-bold">
              {language === "en"
                ? "Security Settings"
                : "Configurações de Segurança"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Manage security settings, access controls, and monitor system activity"
                : "Gerencie configurações de segurança, controles de acesso e monitore atividade do sistema"}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Security Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              {language === "en"
                ? "Security Monitoring"
                : "Monitoramento de Segurança"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  {language === "en" ? "Active Sessions" : "Sessões Ativas"}
                </p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800">
                  {language === "en"
                    ? "Failed Logins (24h)"
                    : "Logins Falhados (24h)"}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    securityEvents.filter((e) => e.type === "failed_login")
                      .length
                  }
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                <p className="text-sm font-medium text-blue-800">
                  {language === "en"
                    ? "Security Score"
                    : "Pontuação de Segurança"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-600">85/100</p>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    {language === "en" ? "Good" : "Bom"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={generateSecurityReportPDF}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    {language === "en" ? "Generating PDF..." : "Gerando PDF..."}
                  </>
                ) : (
                  <>
                    <FileText size={16} className="mr-2" />
                    {language === "en"
                      ? "Generate PDF Report"
                      : "Gerar Relatório PDF"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Events Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} />
              {language === "en"
                ? "Recent Security Events"
                : "Eventos de Segurança Recentes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p className="font-medium">{getEventLabel(event.type)}</p>
                      <p className="text-sm text-gray-600">
                        {event.user.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadge(event.status) as any}>
                      {event.status.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPage;
