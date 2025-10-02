import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, hasRole } from '@/lib/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import jsPDF from 'jspdf';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'password_change' | 'suspicious_activity';
  user: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warning' | 'danger';
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
    minPasswordLength: '8',
    maxLoginAttempts: '5',
    lockoutDuration: '30',
    allowedIPs: '192.168.1.0/24'
  });

  // Mock security events data
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      user: 'adriana.camarotto1@gmail.com',
      timestamp: '2025-07-13 14:30:25',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      type: 'failed_login',
      user: 'unknown@email.com',
      timestamp: '2025-07-13 14:15:12',
      ip: '192.168.1.200',
      status: 'warning'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      user: 'test@example.com',
      timestamp: '2025-07-13 13:45:33',
      ip: '10.0.0.50',
      status: 'danger'
    },
    {
      id: '4',
      type: 'password_change',
      user: 'alice@example.com',
      timestamp: '2025-07-13 12:20:15',
      ip: '192.168.1.150',
      status: 'success'
    },
    {
      id: '5',
      type: 'login',
      user: 'bob@example.com',
      timestamp: '2025-07-13 11:45:30',
      ip: '192.168.1.175',
      status: 'success'
    },
    {
      id: '6',
      type: 'failed_login',
      user: 'hacker@malicious.com',
      timestamp: '2025-07-13 10:30:45',
      ip: '203.0.113.1',
      status: 'danger'
    },
    {
      id: '7',
      type: 'password_change',
      user: 'carol@example.com',
      timestamp: '2025-07-13 09:15:20',
      ip: '192.168.1.120',
      status: 'success'
    },
    {
      id: '8',
      type: 'suspicious_activity',
      user: 'david@example.com',
      timestamp: '2025-07-13 08:00:10',
      ip: '198.51.100.1',
      status: 'warning'
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Check admin permissions
  useEffect(() => {
    if (loading) return;
    
    if (!user || !hasRole(user, 'admin')) {
      toast({
        title: language === 'en' ? 'Access Denied' : 'Acesso Negado',
        description: language === 'en' 
          ? 'You do not have permission to access security settings' 
          : 'Você não tem permissão para acessar as configurações de segurança',
        variant: 'destructive'
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast, language, loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would typically save to your backend/database
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: language === 'en' ? 'Security Settings Saved' : 'Configurações de Segurança Salvas',
        description: language === 'en' 
          ? 'Security settings have been updated successfully' 
          : 'As configurações de segurança foram atualizadas com sucesso',
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to save security settings' 
          : 'Falha ao salvar configurações de segurança',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateSecurityReportPDF = async () => {
    setGeneratingReport(true);
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Colors matching Algebra Academy brand
      const primaryColor = '#3B82F6'; // Blue
      const secondaryColor = '#10B981'; // Green
      const accentColor = '#F59E0B'; // Orange
      const textColor = '#1F2937'; // Dark gray
      const lightGray = '#F3F4F6';

      // Helper function to add colored rectangle
      const addColoredRect = (x: number, y: number, width: number, height: number, color: string) => {
        doc.setFillColor(color);
        doc.rect(x, y, width, height, 'F');
      };

      // Header with brand colors
      addColoredRect(0, 0, pageWidth, 30, primaryColor);
      
      // Company logo area (simulated with text)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('ALGEBRA ACADEMY ONLINE', 20, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Mathematics Education Platform', 20, 26);

      // Reset text color
      doc.setTextColor(textColor);
      yPosition = 45;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const title = language === 'en' ? 'SECURITY REPORT' : 'RELATÓRIO DE SEGURANÇA';
      doc.text(title, 20, yPosition);
      yPosition += 15;

      // Subtitle with date and user
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#6B7280');
      const dateStr = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR');
      const subtitle = `${language === 'en' ? 'Generated on' : 'Gerado em'}: ${dateStr} | ${language === 'en' ? 'By' : 'Por'}: ${user?.email}`;
      doc.text(subtitle, 20, yPosition);
      yPosition += 20;

      // Executive Summary Box
      addColoredRect(15, yPosition - 5, pageWidth - 30, 25, lightGray);
      doc.setTextColor(textColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'en' ? 'EXECUTIVE SUMMARY' : 'RESUMO EXECUTIVO', 20, yPosition + 5);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${language === 'en' ? 'Security Score' : 'Pontuação de Segurança'}: 85/100`, 20, yPosition + 12);
      doc.text(`${language === 'en' ? 'Risk Level' : 'Nível de Risco'}: ${language === 'en' ? 'Low' : 'Baixo'}`, 20, yPosition + 17);
      yPosition += 35;

      // System Overview
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text(language === 'en' ? 'SYSTEM OVERVIEW' : 'VISÃO GERAL DO SISTEMA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);
      
      const systemData = [
        [`${language === 'en' ? 'Total Users' : 'Total de Usuários'}`, '124'],
        [`${language === 'en' ? 'Active Sessions' : 'Sessões Ativas'}`, '12'],
        [`${language === 'en' ? 'Failed Logins (24h)' : 'Logins Falhados (24h)'}`, securityEvents.filter(e => e.type === 'failed_login').length.toString()],
        [`${language === 'en' ? 'Suspicious Activities' : 'Atividades Suspeitas'}`, securityEvents.filter(e => e.type === 'suspicious_activity').length.toString()]
      ];

      systemData.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Security Configuration
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(language === 'en' ? 'SECURITY CONFIGURATION' : 'CONFIGURAÇÃO DE SEGURANÇA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      const securityConfig = [
        [`${language === 'en' ? 'Two-Factor Authentication' : 'Autenticação de Dois Fatores'}`, securitySettings.twoFactorAuth ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Password Complexity' : 'Complexidade de Senha'}`, securitySettings.passwordComplexity ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Session Timeout' : 'Timeout de Sessão'}`, securitySettings.sessionTimeout ? (language === 'en' ? 'Enabled' : 'Habilitado') : (language === 'en' ? 'Disabled' : 'Desabilitado')],
        [`${language === 'en' ? 'Brute Force Protection' : 'Proteção contra Força Bruta'}`, securitySettings.bruteForceProtection ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Min Password Length' : 'Comprimento Mínimo da Senha'}`, `${securitySettings.minPasswordLength} ${language === 'en' ? 'characters' : 'caracteres'}`]
      ];

      securityConfig.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Recent Security Events
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor);
      doc.text(language === 'en' ? 'RECENT SECURITY EVENTS' : 'EVENTOS DE SEGURANÇA RECENTES', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      // Table headers
      const headers = [
        language === 'en' ? 'Type' : 'Tipo',
        language === 'en' ? 'User' : 'Usuário', 
        language === 'en' ? 'IP Address' : 'Endereço IP',
        language === 'en' ? 'Status' : 'Status'
      ];

      // Draw table header
      addColoredRect(20, yPosition - 3, 150, 8, lightGray);
      headers.forEach((header, index) => {
        doc.text(header, 25 + (index * 35), yPosition + 2);
      });
      yPosition += 10;

      // Draw table rows (limit to first 8 events to fit on page)
      securityEvents.slice(0, 8).forEach((event, index) => {
        const eventLabel = getEventLabel(event.type);
        const eventData = [
          eventLabel.substring(0, 12) + (eventLabel.length > 12 ? '...' : ''),
          event.user.substring(0, 15) + (event.user.length > 15 ? '...' : ''),
          event.ip,
          event.status.toUpperCase()
        ];

        eventData.forEach((data, colIndex) => {
          doc.text(data, 25 + (colIndex * 35), yPosition);
        });
        yPosition += 5;
      });
      yPosition += 15;

      // Recommendations
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text(language === 'en' ? 'SECURITY RECOMMENDATIONS' : 'RECOMENDAÇÕES DE SEGURANÇA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      const recommendations = [
        language === 'en' 
          ? 'Enable Two-Factor Authentication for all admin accounts'
          : 'Habilitar Autenticação de Dois Fatores para todas as contas de administrador',
        language === 'en'
          ? 'Review and update password complexity requirements'
          : 'Revisar e atualizar requisitos de complexidade de senha',
        language === 'en'
          ? 'Implement IP whitelist for enhanced security'
          : 'Implementar lista branca de IPs para segurança aprimorada',
        language === 'en'
          ? 'Regular security audits and monitoring'
          : 'Auditorias de segurança regulares e monitoramento'
      ];

      recommendations.forEach((rec, index) => {
        doc.text(`${index + 1}. ${rec}`, 25, yPosition);
        yPosition += 5;
      });

      // Footer
      addColoredRect(0, pageHeight - 15, pageWidth, 15, lightGray);
      doc.setFontSize(8);
      doc.setTextColor('#6B7280');
      doc.text('Algebra Academy Online - Security Report', 20, pageHeight - 8);
      doc.text(`${language === 'en' ? 'Confidential Document' : 'Documento Confidencial'}`, pageWidth - 60, pageHeight - 8);

      // Save the PDF
      const filename = `algebra-academy-security-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast({
        title: language === 'en' ? 'PDF Security Report Generated' : 'Relatório PDF de Segurança Gerado',
        description: language === 'en' 
          ? 'PDF security report has been generated and downloaded successfully' 
          : 'Relatório PDF de segurança foi gerado e baixado com sucesso',
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to generate PDF security report' 
          : 'Falha ao gerar relatório PDF de segurança',
        variant: 'destructive'
      });
    } finally {
      setGeneratingReport(false);
    }
  };
    setGeneratingReport(true);
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Colors matching Algebra Academy brand
      const primaryColor = '#3B82F6'; // Blue
      const secondaryColor = '#10B981'; // Green
      const accentColor = '#F59E0B'; // Orange
      const textColor = '#1F2937'; // Dark gray
      const lightGray = '#F3F4F6';

      // Helper function to add colored rectangle
      const addColoredRect = (x: number, y: number, width: number, height: number, color: string) => {
        doc.setFillColor(color);
        doc.rect(x, y, width, height, 'F');
      };

      // Header with brand colors
      addColoredRect(0, 0, pageWidth, 30, primaryColor);
      
      // Company logo area (simulated with text)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('ALGEBRA ACADEMY ONLINE', 20, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Mathematics Education Platform', 20, 26);

      // Reset text color
      doc.setTextColor(textColor);
      yPosition = 45;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const title = language === 'en' ? 'SECURITY REPORT' : 'RELATÓRIO DE SEGURANÇA';
      doc.text(title, 20, yPosition);
      yPosition += 15;

      // Subtitle with date and user
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#6B7280');
      const dateStr = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR');
      const subtitle = `${language === 'en' ? 'Generated on' : 'Gerado em'}: ${dateStr} | ${language === 'en' ? 'By' : 'Por'}: ${user?.email}`;
      doc.text(subtitle, 20, yPosition);
      yPosition += 20;

      // Executive Summary Box
      addColoredRect(15, yPosition - 5, pageWidth - 30, 25, lightGray);
      doc.setTextColor(textColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'en' ? 'EXECUTIVE SUMMARY' : 'RESUMO EXECUTIVO', 20, yPosition + 5);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${language === 'en' ? 'Security Score' : 'Pontuação de Segurança'}: 85/100`, 20, yPosition + 12);
      doc.text(`${language === 'en' ? 'Risk Level' : 'Nível de Risco'}: ${language === 'en' ? 'Low' : 'Baixo'}`, 20, yPosition + 17);
      yPosition += 35;

      // System Overview
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text(language === 'en' ? 'SYSTEM OVERVIEW' : 'VISÃO GERAL DO SISTEMA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);
      
      const systemData = [
        [`${language === 'en' ? 'Total Users' : 'Total de Usuários'}`, '124'],
        [`${language === 'en' ? 'Active Sessions' : 'Sessões Ativas'}`, '12'],
        [`${language === 'en' ? 'Failed Logins (24h)' : 'Logins Falhados (24h)'}`, securityEvents.filter(e => e.type === 'failed_login').length.toString()],
        [`${language === 'en' ? 'Suspicious Activities' : 'Atividades Suspeitas'}`, securityEvents.filter(e => e.type === 'suspicious_activity').length.toString()]
      ];

      systemData.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Security Configuration
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(language === 'en' ? 'SECURITY CONFIGURATION' : 'CONFIGURAÇÃO DE SEGURANÇA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      const securityConfig = [
        [`${language === 'en' ? 'Two-Factor Authentication' : 'Autenticação de Dois Fatores'}`, securitySettings.twoFactorAuth ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Password Complexity' : 'Complexidade de Senha'}`, securitySettings.passwordComplexity ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Session Timeout' : 'Timeout de Sessão'}`, securitySettings.sessionTimeout ? (language === 'en' ? 'Enabled' : 'Habilitado') : (language === 'en' ? 'Disabled' : 'Desabilitado')],
        [`${language === 'en' ? 'Brute Force Protection' : 'Proteção contra Força Bruta'}`, securitySettings.bruteForceProtection ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')],
        [`${language === 'en' ? 'Min Password Length' : 'Comprimento Mínimo da Senha'}`, `${securitySettings.minPasswordLength} ${language === 'en' ? 'characters' : 'caracteres'}`]
      ];

      securityConfig.forEach(([label, value]) => {
        doc.text(`• ${label}: ${value}`, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Recent Security Events
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor);
      doc.text(language === 'en' ? 'RECENT SECURITY EVENTS' : 'EVENTOS DE SEGURANÇA RECENTES', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      // Table headers
      const headers = [
        language === 'en' ? 'Type' : 'Tipo',
        language === 'en' ? 'User' : 'Usuário', 
        language === 'en' ? 'IP Address' : 'Endereço IP',
        language === 'en' ? 'Status' : 'Status'
      ];

      // Draw table header
      addColoredRect(20, yPosition - 3, 150, 8, lightGray);
      headers.forEach((header, index) => {
        doc.text(header, 25 + (index * 35), yPosition + 2);
      });
      yPosition += 10;

      // Draw table rows (limit to first 8 events to fit on page)
      securityEvents.slice(0, 8).forEach((event, index) => {
        const eventLabel = getEventLabel(event.type);
        const eventData = [
          eventLabel.substring(0, 12) + (eventLabel.length > 12 ? '...' : ''),
          event.user.substring(0, 15) + (event.user.length > 15 ? '...' : ''),
          event.ip,
          event.status.toUpperCase()
        ];

        eventData.forEach((data, colIndex) => {
          doc.text(data, 25 + (colIndex * 35), yPosition);
        });
        yPosition += 5;
      });
      yPosition += 15;

      // Recommendations
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text(language === 'en' ? 'SECURITY RECOMMENDATIONS' : 'RECOMENDAÇÕES DE SEGURANÇA', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);

      const recommendations = [
        language === 'en' 
          ? 'Enable Two-Factor Authentication for all admin accounts'
          : 'Habilitar Autenticação de Dois Fatores para todas as contas de administrador',
        language === 'en'
          ? 'Review and update password complexity requirements'
          : 'Revisar e atualizar requisitos de complexidade de senha',
        language === 'en'
          ? 'Implement IP whitelist for enhanced security'
          : 'Implementar lista branca de IPs para segurança aprimorada',
        language === 'en'
          ? 'Regular security audits and monitoring'
          : 'Auditorias de segurança regulares e monitoramento'
      ];

      recommendations.forEach((rec, index) => {
        doc.text(`${index + 1}. ${rec}`, 25, yPosition);
        yPosition += 5;
      });

      // Footer
      addColoredRect(0, pageHeight - 15, pageWidth, 15, lightGray);
      doc.setFontSize(8);
      doc.setTextColor('#6B7280');
      doc.text('Algebra Academy Online - Security Report', 20, pageHeight - 8);
      doc.text(`${language === 'en' ? 'Confidential Document' : 'Documento Confidencial'}`, pageWidth - 60, pageHeight - 8);

      // Save the PDF
      const filename = `algebra-academy-security-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast({
        title: language === 'en' ? 'PDF Security Report Generated' : 'Relatório PDF de Segurança Gerado',
        description: language === 'en' 
          ? 'PDF security report has been generated and downloaded successfully' 
          : 'Relatório PDF de segurança foi gerado e baixado com sucesso',
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to generate PDF security report' 
          : 'Falha ao gerar relatório PDF de segurança',
        variant: 'destructive'
      });
    } finally {
      setGeneratingReport(false);
    }
  };
    setGeneratingReport(true);
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate comprehensive security report
      const reportData = {
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email,
        systemInfo: {
          totalUsers: 124,
          activeSessions: 12,
          failedLogins24h: 3,
          suspiciousActivities: 1
        },
        securitySettings: securitySettings,
        recentEvents: securityEvents,
        recommendations: [
          language === 'en' 
            ? 'Enable Two-Factor Authentication for all admin accounts'
            : 'Habilitar Autenticação de Dois Fatores para todas as contas de administrador',
          language === 'en'
            ? 'Review and update password complexity requirements'
            : 'Revisar e atualizar requisitos de complexidade de senha',
          language === 'en'
            ? 'Implement IP whitelist for enhanced security'
            : 'Implementar lista branca de IPs para segurança aprimorada',
          language === 'en'
            ? 'Regular security audits and monitoring'
            : 'Auditorias de segurança regulares e monitoramento'
        ],
        metrics: {
          securityScore: 85,
          complianceLevel: 'High',
          riskLevel: 'Low'
        }
      };

      // Create downloadable report
      const reportContent = generateReportContent(reportData);
      downloadReport(reportContent, 'security-report');
      
      toast({
        title: language === 'en' ? 'Security Report Generated' : 'Relatório de Segurança Gerado',
        description: language === 'en' 
          ? 'Security report has been generated and downloaded successfully' 
          : 'Relatório de segurança foi gerado e baixado com sucesso',
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to generate security report' 
          : 'Falha ao gerar relatório de segurança',
        variant: 'destructive'
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateReportContent = (data: any) => {
    const title = language === 'en' ? 'SECURITY REPORT' : 'RELATÓRIO DE SEGURANÇA';
    const dateStr = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR');
    
    return `
${title}
${'='.repeat(title.length)}

${language === 'en' ? 'Generated on' : 'Gerado em'}: ${dateStr}
${language === 'en' ? 'Generated by' : 'Gerado por'}: ${data.generatedBy}

${language === 'en' ? 'SYSTEM OVERVIEW' : 'VISÃO GERAL DO SISTEMA'}
${'-'.repeat(20)}
${language === 'en' ? 'Total Users' : 'Total de Usuários'}: ${data.systemInfo.totalUsers}
${language === 'en' ? 'Active Sessions' : 'Sessões Ativas'}: ${data.systemInfo.activeSessions}
${language === 'en' ? 'Failed Logins (24h)' : 'Logins Falhados (24h)'}: ${data.systemInfo.failedLogins24h}
${language === 'en' ? 'Suspicious Activities' : 'Atividades Suspeitas'}: ${data.systemInfo.suspiciousActivities}

${language === 'en' ? 'SECURITY METRICS' : 'MÉTRICAS DE SEGURANÇA'}
${'-'.repeat(20)}
${language === 'en' ? 'Security Score' : 'Pontuação de Segurança'}: ${data.metrics.securityScore}/100
${language === 'en' ? 'Compliance Level' : 'Nível de Conformidade'}: ${data.metrics.complianceLevel}
${language === 'en' ? 'Risk Level' : 'Nível de Risco'}: ${data.metrics.riskLevel}

${language === 'en' ? 'CURRENT SECURITY SETTINGS' : 'CONFIGURAÇÕES DE SEGURANÇA ATUAIS'}
${'-'.repeat(30)}
${language === 'en' ? 'Two-Factor Authentication' : 'Autenticação de Dois Fatores'}: ${data.securitySettings.twoFactorAuth ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')}
${language === 'en' ? 'Password Complexity' : 'Complexidade de Senha'}: ${data.securitySettings.passwordComplexity ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')}
${language === 'en' ? 'Session Timeout' : 'Timeout de Sessão'}: ${data.securitySettings.sessionTimeout ? (language === 'en' ? 'Enabled' : 'Habilitado') : (language === 'en' ? 'Disabled' : 'Desabilitado')}
${language === 'en' ? 'IP Whitelist' : 'Lista Branca de IPs'}: ${data.securitySettings.ipWhitelist ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')}
${language === 'en' ? 'Brute Force Protection' : 'Proteção contra Força Bruta'}: ${data.securitySettings.bruteForceProtection ? (language === 'en' ? 'Enabled' : 'Habilitada') : (language === 'en' ? 'Disabled' : 'Desabilitada')}
${language === 'en' ? 'Min Password Length' : 'Comprimento Mínimo da Senha'}: ${data.securitySettings.minPasswordLength} ${language === 'en' ? 'characters' : 'caracteres'}
${language === 'en' ? 'Max Login Attempts' : 'Máximo de Tentativas de Login'}: ${data.securitySettings.maxLoginAttempts}
${language === 'en' ? 'Lockout Duration' : 'Duração do Bloqueio'}: ${data.securitySettings.lockoutDuration} ${language === 'en' ? 'minutes' : 'minutos'}

${language === 'en' ? 'RECENT SECURITY EVENTS' : 'EVENTOS DE SEGURANÇA RECENTES'}
${'-'.repeat(25)}
${data.recentEvents.map((event: SecurityEvent) => 
  `${event.timestamp} - ${getEventLabel(event.type)} - ${event.user} (${event.ip}) - ${event.status.toUpperCase()}`
).join('\n')}

${language === 'en' ? 'SECURITY RECOMMENDATIONS' : 'RECOMENDAÇÕES DE SEGURANÇA'}
${'-'.repeat(25)}
${data.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

${language === 'en' ? 'COMPLIANCE STATUS' : 'STATUS DE CONFORMIDADE'}
${'-'.repeat(20)}
✓ ${language === 'en' ? 'Password policies implemented' : 'Políticas de senha implementadas'}
✓ ${language === 'en' ? 'Failed login monitoring active' : 'Monitoramento de logins falhados ativo'}
✓ ${language === 'en' ? 'Session management configured' : 'Gerenciamento de sessão configurado'}
${data.securitySettings.twoFactorAuth ? '✓' : '✗'} ${language === 'en' ? 'Two-factor authentication' : 'Autenticação de dois fatores'}
${data.securitySettings.ipWhitelist ? '✓' : '✗'} ${language === 'en' ? 'IP access control' : 'Controle de acesso por IP'}

${language === 'en' ? 'REPORT END' : 'FIM DO RELATÓRIO'}
${'-'.repeat(15)}
${language === 'en' ? 'This report was automatically generated by Algebra Academy Online Security System' : 'Este relatório foi gerado automaticamente pelo Sistema de Segurança da Algebra Academy Online'}
`;
  };

  const downloadReport = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportSecurityLogs = async () => {
    try {
      // Generate detailed security logs
      const logsData = {
        exportedAt: new Date().toISOString(),
        exportedBy: user?.email,
        events: securityEvents.map(event => ({
          timestamp: event.timestamp,
          event_type: event.type,
          user_email: event.user,
          ip_address: event.ip,
          status: event.status,
          details: getEventLabel(event.type)
        }))
      };

      // Create CSV format for logs
      const csvContent = [
        ['Timestamp', 'Event Type', 'User Email', 'IP Address', 'Status', 'Details'].join(','),
        ...logsData.events.map(event => [
          event.timestamp,
          event.event_type,
          event.user_email,
          event.ip_address,
          event.status,
          `"${event.details}"`
        ].join(','))
      ].join('\n');

      // Download CSV file
      const element = document.createElement('a');
      const file = new Blob([csvContent], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: language === 'en' ? 'Security Logs Exported' : 'Logs de Segurança Exportados',
        description: language === 'en' 
          ? 'Security logs have been exported successfully' 
          : 'Logs de segurança foram exportados com sucesso',
      });
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to export security logs' 
          : 'Falha ao exportar logs de segurança',
        variant: 'destructive'
      });
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed_login':
        return <XCircle size={16} className="text-red-500" />;
      case 'password_change':
        return <Key size={16} className="text-blue-500" />;
      case 'suspicious_activity':
        return <AlertTriangle size={16} className="text-orange-500" />;
      default:
        return <Eye size={16} className="text-gray-500" />;
    }
  };

  const getEventLabel = (type: string) => {
    const labels = {
      login: language === 'en' ? 'Successful Login' : 'Login Bem-sucedido',
      failed_login: language === 'en' ? 'Failed Login' : 'Login Falhado',
      password_change: language === 'en' ? 'Password Changed' : 'Senha Alterada',
      suspicious_activity: language === 'en' ? 'Suspicious Activity' : 'Atividade Suspeita'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      danger: 'destructive'
    };
    return variants[status as keyof typeof variants] || 'default';
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

  if (!user || !hasRole(user, 'admin')) {
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
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {language === 'en' ? 'Back to Admin Panel' : 'Voltar ao Painel Admin'}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Security Settings' : 'Configurações de Segurança'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Manage security settings, access controls, and monitor system activity'
                : 'Gerencie configurações de segurança, controles de acesso e monitore atividade do sistema'
              }
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
            ? (language === 'en' ? 'Saving...' : 'Salvando...')
            : (language === 'en' ? 'Save Changes' : 'Salvar Alterações')
          }
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              {language === 'en' ? 'Authentication' : 'Autenticação'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Configure authentication and access control settings'
                : 'Configure configurações de autenticação e controle de acesso'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Two-Factor Authentication' : 'Autenticação de Dois Fatores'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Require 2FA for all admin accounts'
                    : 'Exigir 2FA para todas as contas administrativas'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Password Complexity' : 'Complexidade de Senha'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Enforce strong password requirements'
                    : 'Aplicar requisitos de senha forte'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.passwordComplexity}
                onCheckedChange={(checked) => handleInputChange('passwordComplexity', checked)}
              />
            </div>
            <div>
              <Label htmlFor="minPasswordLength">
                {language === 'en' ? 'Minimum Password Length' : 'Comprimento Mínimo da Senha'}
              </Label>
              <Input
                id="minPasswordLength"
                type="number"
                value={securitySettings.minPasswordLength}
                onChange={(e) => handleInputChange('minPasswordLength', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Require Password Change' : 'Exigir Mudança de Senha'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Force password change on next login'
                    : 'Forçar mudança de senha no próximo login'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.requirePasswordChange}
                onCheckedChange={(checked) => handleInputChange('requirePasswordChange', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Session & Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              {language === 'en' ? 'Session & Access Control' : 'Controle de Sessão e Acesso'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Manage session timeouts and access restrictions'
                : 'Gerencie timeouts de sessão e restrições de acesso'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Automatic Session Timeout' : 'Timeout Automático de Sessão'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Automatically log out inactive users'
                    : 'Desconectar automaticamente usuários inativos'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.sessionTimeout}
                onCheckedChange={(checked) => handleInputChange('sessionTimeout', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'IP Whitelist' : 'Lista Branca de IPs'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Restrict access to specific IP addresses'
                    : 'Restringir acesso a endereços IP específicos'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked) => handleInputChange('ipWhitelist', checked)}
              />
            </div>
            {securitySettings.ipWhitelist && (
              <div>
                <Label htmlFor="allowedIPs">
                  {language === 'en' ? 'Allowed IP Ranges' : 'Faixas de IP Permitidas'}
                </Label>
                <Input
                  id="allowedIPs"
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                  value={securitySettings.allowedIPs}
                  onChange={(e) => handleInputChange('allowedIPs', e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brute Force Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban size={20} />
              {language === 'en' ? 'Brute Force Protection' : 'Proteção contra Força Bruta'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Configure protection against brute force attacks'
                : 'Configure proteção contra ataques de força bruta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Enable Protection' : 'Habilitar Proteção'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Block suspicious login attempts'
                    : 'Bloquear tentativas de login suspeitas'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.bruteForceProtection}
                onCheckedChange={(checked) => handleInputChange('bruteForceProtection', checked)}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">
                {language === 'en' ? 'Max Login Attempts' : 'Máximo de Tentativas de Login'}
              </Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lockoutDuration">
                {language === 'en' ? 'Lockout Duration (minutes)' : 'Duração do Bloqueio (minutos)'}
              </Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={securitySettings.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === 'en' ? 'Log Failed Attempts' : 'Registrar Tentativas Falhadas'}
                </Label>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Keep detailed logs of failed login attempts'
                    : 'Manter logs detalhados de tentativas de login falhadas'
                  }
                </p>
              </div>
              <Switch
                checked={securitySettings.logFailedAttempts}
                onCheckedChange={(checked) => handleInputChange('logFailedAttempts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              {language === 'en' ? 'Security Monitoring' : 'Monitoramento de Segurança'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Monitor system security and track events'
                : 'Monitore a segurança do sistema e rastreie eventos'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  {language === 'en' ? 'Active Sessions' : 'Sessões Ativas'}
                </p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800">
                  {language === 'en' ? 'Failed Logins (24h)' : 'Logins Falhados (24h)'}
                </p>
                <p className="text-2xl font-bold text-red-600">{securityEvents.filter(e => e.type === 'failed_login').length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                <p className="text-sm font-medium text-blue-800">
                  {language === 'en' ? 'Security Score' : 'Pontuação de Segurança'}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-600">85/100</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {language === 'en' ? 'Good' : 'Bom'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={generateSecurityReport}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    {language === 'en' ? 'Generating...' : 'Gerando...'}
                  </>
                ) : (
                  <>
                    {language === 'en' ? 'Generate Security Report (TXT)' : 'Gerar Relatório de Segurança (TXT)'}
                  </>
                )}
              </Button>
              <Button 
                variant="default" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={generateSecurityReportPDF}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    {language === 'en' ? 'Generating PDF...' : 'Gerando PDF...'}
                  </>
                ) : (
                  <>
                    <FileText size={16} className="mr-2" />
                    {language === 'en' ? 'Generate PDF Report' : 'Gerar Relatório PDF'}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={exportSecurityLogs}
              >
                {language === 'en' ? 'Export Security Logs (CSV)' : 'Exportar Logs de Segurança (CSV)'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            {language === 'en' ? 'Recent Security Events' : 'Eventos de Segurança Recentes'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Monitor recent security-related activities'
              : 'Monitore atividades recentes relacionadas à segurança'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{getEventLabel(event.type)}</p>
                    <p className="text-sm text-gray-600">
                      {event.user} • {event.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadge(event.status) as any}>
                    {event.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Create detailed events view
                const detailedEvents = securityEvents.map(event => ({
                  ...event,
                  details: getEventLabel(event.type),
                  formattedTime: new Date(event.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'pt-BR')
                }));
                
                // Generate detailed events report
                const eventsContent = `
${language === 'en' ? 'DETAILED SECURITY EVENTS' : 'EVENTOS DE SEGURANÇA DETALHADOS'}
${'='.repeat(30)}

${detailedEvents.map(event => `
${language === 'en' ? 'Event ID' : 'ID do Evento'}: ${event.id}
${language === 'en' ? 'Type' : 'Tipo'}: ${event.details}
${language === 'en' ? 'User' : 'Usuário'}: ${event.user}
${language === 'en' ? 'IP Address' : 'Endereço IP'}: ${event.ip}
${language === 'en' ? 'Status' : 'Status'}: ${event.status.toUpperCase()}
${language === 'en' ? 'Timestamp' : 'Data/Hora'}: ${event.formattedTime}
${'-'.repeat(50)}
`).join('\n')}

${language === 'en' ? 'Total Events' : 'Total de Eventos'}: ${detailedEvents.length}
${language === 'en' ? 'Generated' : 'Gerado'}: ${new Date().toLocaleString(language === 'en' ? 'en-US' : 'pt-BR')}
`;
                
                downloadReport(eventsContent, 'detailed-security-events');
                
                toast({
                  title: language === 'en' ? 'Events Export Complete' : 'Exportação de Eventos Concluída',
                  description: language === 'en' 
                    ? 'Detailed security events have been exported' 
                    : 'Eventos de segurança detalhados foram exportados',
                });
              }}
            >
              {language === 'en' ? 'View All Security Events' : 'Ver Todos os Eventos de Segurança'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
