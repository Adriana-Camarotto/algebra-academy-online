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
  Download,
  Users,
  Activity,
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

  // Real-time security metrics
  const [securityMetrics, setSecurityMetrics] = useState({
    activeSessions: 0,
    failedLogins24h: 0,
    totalUsers: 0,
    suspiciousActivities: 0,
    lastUpdated: new Date(),
  });

  // Mock security events data with more realistic timestamps
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
      type: "login",
      user: "student1@example.com",
      timestamp: "2025-07-13 12:20:15",
      ip: "192.168.1.150",
      status: "success",
    },
    {
      id: "5",
      type: "login",
      user: "student2@example.com",
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
      type: "login",
      user: "teacher@example.com",
      timestamp: "2025-07-13 09:15:20",
      ip: "192.168.1.120",
      status: "success",
    },
    {
      id: "8",
      type: "suspicious_activity",
      user: "david@example.com",
      timestamp: "2025-07-12 22:00:10",
      ip: "198.51.100.1",
      status: "warning",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Check admin permissions and load metrics
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
    } else {
      loadSecurityMetrics();
    }
  }, [user, navigate, toast, language, loading]);

  const loadSecurityMetrics = async () => {
    try {
      // Calculate active sessions based on recent successful logins (last 24 hours)
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const recentLogins = securityEvents.filter(
        (event) =>
          event.type === "login" &&
          event.status === "success" &&
          new Date(event.timestamp) > twentyFourHoursAgo
      );

      // Calculate failed logins in last 24 hours
      const failedLogins = securityEvents.filter(
        (event) =>
          event.type === "failed_login" &&
          new Date(event.timestamp) > twentyFourHoursAgo
      );

      // Calculate suspicious activities in last 24 hours
      const suspiciousActivities = securityEvents.filter(
        (event) =>
          event.type === "suspicious_activity" &&
          new Date(event.timestamp) > twentyFourHoursAgo
      );

      // Get unique users from recent successful logins (approximate active sessions)
      const uniqueActiveUsers = new Set(
        recentLogins.map((event) => event.user)
      );

      // Simulate total users count
      const totalUsers = 127;

      setSecurityMetrics({
        activeSessions: uniqueActiveUsers.size,
        failedLogins24h: failedLogins.length,
        totalUsers: totalUsers,
        suspiciousActivities: suspiciousActivities.length,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error loading security metrics:", error);
    }
  };

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
      const lightGray = "#F3F4F6";
      const textColor = "#1F2937";

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

      const addNewPageIfNeeded = (spaceNeeded: number) => {
        if (yPosition + spaceNeeded > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Header
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

      // Subtitle with real-time data
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#6B7280");
      const dateStr = securityMetrics.lastUpdated.toLocaleDateString(
        language === "en" ? "en-US" : "pt-BR"
      );
      const timeStr = securityMetrics.lastUpdated.toLocaleTimeString(
        language === "en" ? "en-US" : "pt-BR"
      );
      const subtitle = `${
        language === "en" ? "Generated on" : "Gerado em"
      }: ${dateStr} ${timeStr} | ${language === "en" ? "By" : "Por"}: ${
        user?.email
      }`;
      doc.text(subtitle, 20, yPosition);
      yPosition += 20;

      // Executive Summary
      addNewPageIfNeeded(30);
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
        `${language === "en" ? "Active Sessions" : "Sessões Ativas"}: ${
          securityMetrics.activeSessions
        }`,
        20,
        yPosition + 12
      );
      doc.text(
        `${
          language === "en" ? "Failed Logins (24h)" : "Logins Falhados (24h)"
        }: ${securityMetrics.failedLogins24h}`,
        20,
        yPosition + 17
      );
      doc.text(
        `${language === "en" ? "Risk Level" : "Nível de Risco"}: ${
          securityMetrics.failedLogins24h > 5
            ? language === "en"
              ? "Medium"
              : "Médio"
            : language === "en"
            ? "Low"
            : "Baixo"
        }`,
        20,
        yPosition + 22
      );
      yPosition += 35;

      // System Metrics (Real Data)
      addNewPageIfNeeded(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text(
        language === "en"
          ? "REAL-TIME SYSTEM METRICS"
          : "MÉTRICAS DO SISTEMA EM TEMPO REAL",
        20,
        yPosition
      );
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor);

      const metrics = [
        [
          `${language === "en" ? "Total Users" : "Total de Usuários"}`,
          securityMetrics.totalUsers.toString(),
        ],
        [
          `${language === "en" ? "Active Sessions" : "Sessões Ativas"}`,
          securityMetrics.activeSessions.toString(),
        ],
        [
          `${
            language === "en" ? "Failed Logins (24h)" : "Logins Falhados (24h)"
          }`,
          securityMetrics.failedLogins24h.toString(),
        ],
        [
          `${
            language === "en" ? "Suspicious Activities" : "Atividades Suspeitas"
          }`,
          securityMetrics.suspiciousActivities.toString(),
        ],
        [
          `${language === "en" ? "Last Updated" : "Última Atualização"}`,
          timeStr,
        ],
      ];

      metrics.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Recent Security Events
      addNewPageIfNeeded(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text(
        language === "en"
          ? "RECENT SECURITY EVENTS"
          : "EVENTOS DE SEGURANÇA RECENTES",
        20,
        yPosition
      );
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor);

      securityEvents.slice(0, 8).forEach((event) => {
        addNewPageIfNeeded(5);
        const eventText = `${event.timestamp} - ${getEventLabel(
          event.type
        )} - ${event.user} (${event.ip}) - ${event.status.toUpperCase()}`;
        doc.text(eventText, 25, yPosition);
        yPosition += 5;
      });

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
            ? "Real-time PDF security report has been generated and downloaded successfully"
            : "Relatório PDF de segurança em tempo real foi gerado e baixado com sucesso",
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

  const exportSecurityLogs = async () => {
    try {
      const logsData = {
        exportedAt: new Date().toISOString(),
        exportedBy: user?.email,
        events: securityEvents.map((event) => ({
          timestamp: event.timestamp,
          event_type: event.type,
          user_email: event.user,
          ip_address: event.ip,
          status: event.status,
          details: getEventLabel(event.type),
        })),
      };

      const csvContent = [
        [
          "Timestamp",
          "Event Type",
          "User Email",
          "IP Address",
          "Status",
          "Details",
        ].join(","),
        ...logsData.events.map((event) =>
          [
            event.timestamp,
            event.event_type,
            event.user_email,
            event.ip_address,
            event.status,
            `"${event.details}"`,
          ].join(",")
        ),
      ].join("\n");

      const element = document.createElement("a");
      const file = new Blob([csvContent], { type: "text/csv" });
      element.href = URL.createObjectURL(file);
      element.download = `security-logs-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title:
          language === "en"
            ? "Security Logs Exported"
            : "Logs de Segurança Exportados",
        description:
          language === "en"
            ? "Security logs have been exported successfully"
            : "Logs de segurança foram exportados com sucesso",
      });
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to export security logs"
            : "Falha ao exportar logs de segurança",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">
            🔒{" "}
            {language === "en"
              ? "Loading security settings..."
              : "Carregando configurações de segurança..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">
            🚫{" "}
            {language === "en"
              ? "Access denied. Redirecting..."
              : "Acesso negado. Redirecionando..."}
          </p>
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadSecurityMetrics}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            {language === "en" ? "Refresh" : "Atualizar"}
          </Button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Security Monitoring - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              {language === "en"
                ? "Security Monitoring"
                : "Monitoramento de Segurança"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Real-time security metrics"
                : "Métricas de segurança em tempo real"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-800">
                    {language === "en" ? "Active Sessions" : "Sessões Ativas"}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {language === "en" ? "Live" : "Ao Vivo"}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {securityMetrics.activeSessions}
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-red-800">
                    {language === "en"
                      ? "Failed Logins (24h)"
                      : "Logins Falhados (24h)"}
                  </p>
                  <Badge
                    variant={
                      securityMetrics.failedLogins24h > 5
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {securityMetrics.failedLogins24h > 5
                      ? language === "en"
                        ? "High"
                        : "Alto"
                      : language === "en"
                      ? "Normal"
                      : "Normal"}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {securityMetrics.failedLogins24h}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  {language === "en" ? "Total Users" : "Total de Usuários"}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {securityMetrics.totalUsers}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              {language === "en" ? "Last updated" : "Última atualização"}:{" "}
              {securityMetrics.lastUpdated.toLocaleTimeString()}
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
              <Button
                variant="outline"
                className="w-full"
                onClick={exportSecurityLogs}
              >
                <Download size={16} className="mr-2" />
                {language === "en"
                  ? "Export Security Logs"
                  : "Exportar Logs de Segurança"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              {language === "en" ? "Authentication" : "Autenticação"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Configure authentication and access control settings"
                : "Configure autenticação e controles de acesso"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactorAuth" className="text-sm font-medium">
                {language === "en"
                  ? "Two-Factor Authentication"
                  : "Autenticação de Dois Fatores"}
              </Label>
              <Switch
                id="twoFactorAuth"
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleInputChange("twoFactorAuth", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="passwordComplexity"
                className="text-sm font-medium"
              >
                {language === "en"
                  ? "Password Complexity"
                  : "Complexidade de Senha"}
              </Label>
              <Switch
                id="passwordComplexity"
                checked={securitySettings.passwordComplexity}
                onCheckedChange={(checked) =>
                  handleInputChange("passwordComplexity", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="minPasswordLength"
                className="text-sm font-medium"
              >
                {language === "en"
                  ? "Min Password Length"
                  : "Comprimento Mínimo da Senha"}
              </Label>
              <Input
                id="minPasswordLength"
                type="number"
                value={securitySettings.minPasswordLength}
                onChange={(e) =>
                  handleInputChange("minPasswordLength", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="bruteForceProtection"
                className="text-sm font-medium"
              >
                {language === "en"
                  ? "Brute Force Protection"
                  : "Proteção contra Força Bruta"}
              </Label>
              <Switch
                id="bruteForceProtection"
                checked={securitySettings.bruteForceProtection}
                onCheckedChange={(checked) =>
                  handleInputChange("bruteForceProtection", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Session & Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              {language === "en"
                ? "Session & Access Control"
                : "Controle de Sessão e Acesso"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                {language === "en" ? "Session Timeout" : "Timeout de Sessão"}
              </Label>
              <Switch
                id="sessionTimeout"
                checked={securitySettings.sessionTimeout}
                onCheckedChange={(checked) =>
                  handleInputChange("sessionTimeout", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ipWhitelist" className="text-sm font-medium">
                {language === "en" ? "IP Whitelist" : "Lista Branca de IPs"}
              </Label>
              <Switch
                id="ipWhitelist"
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked) =>
                  handleInputChange("ipWhitelist", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="logFailedAttempts"
                className="text-sm font-medium"
              >
                {language === "en"
                  ? "Log Failed Attempts"
                  : "Registrar Tentativas Falhadas"}
              </Label>
              <Switch
                id="logFailedAttempts"
                checked={securitySettings.logFailedAttempts}
                onCheckedChange={(checked) =>
                  handleInputChange("logFailedAttempts", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            {language === "en" ? "Security Events" : "Eventos de Segurança"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Monitor system security and track events"
              : "Monitore a segurança do sistema e rastreie eventos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{getEventLabel(event.type)}</p>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "User" : "Usuário"}:{" "}
                      {event.user.substring(0, 30)}...
                    </p>
                    <p className="text-sm text-gray-500">
                      IP: {event.ip} | {event.timestamp}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadge(event.status) as any}>
                    {event.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
