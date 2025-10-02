import emailjs from "@emailjs/browser";

// ⚠️  CONFIGURAÇÃO NECESSÁRIA PARA ENVIO DE EMAILS ⚠️
//
// PASSO 1: Vá para https://www.emailjs.com/ e crie uma conta (30 segundos)
// PASSO 2: Configure Gmail como serviço e copie o Service ID
// PASSO 3: Crie um template de email e copie o Template ID
// PASSO 4: Vá em Account → General e copie a Public Key
// PASSO 5: Substitua as 3 linhas abaixo com suas chaves reais:

const EMAILJS_SERVICE_ID = "service_pc2v1fn"; // ✅ Service ID configurado
const EMAILJS_TEMPLATE_ID = "template_ydnrx5f"; // ✅ Template ID configurado
const EMAILJS_PUBLIC_KEY = "O9zWKO11K-u5pvf0w"; // ✅ Public Key configurada

// 📋 Guia completo: CONFIGURE_EMAILJS_NOW.md

// Check if EmailJS is configured
const isConfigured = () => {
  return (
    EMAILJS_SERVICE_ID !== "SEU_SERVICE_ID_AQUI" &&
    EMAILJS_TEMPLATE_ID !== "SEU_TEMPLATE_ID_AQUI" &&
    EMAILJS_PUBLIC_KEY !== "SUA_PUBLIC_KEY_AQUI"
  );
};

// Initialize EmailJS only if configured
if (isConfigured()) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  to_name: string;
  to_email: string;
  user_role: string;
  login_url: string;
  from_name?: string;
}

export const sendWelcomeEmail = async (
  params: EmailParams
): Promise<boolean> => {
  try {
    // Check if EmailJS is configured
    if (!isConfigured()) {
      console.log("⚠️ EmailJS not configured. Using fallback method.");
      console.log("� Configure EmailJS following EMAIL_CONFIG_RAPIDA.md");
      return false;
    }

    console.log("�📧 Sending welcome email to:", params.to_email);

    const templateParams = {
      to_name: params.to_name,
      to_email: params.to_email,
      user_role: params.user_role,
      login_url: params.login_url,
      from_name: params.from_name || "Algebra Academy",
      message: `Olá ${params.to_name},

Sua conta foi criada na Algebra Academy!

Para acessar a plataforma:
1. Visite: ${params.login_url}
2. Clique em "Registrar"
3. Use seu email: ${params.to_email}
4. Crie uma senha segura

Seu papel: ${params.user_role}

Bem-vindo à Algebra Academy!`,
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log("✅ Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);

    // Check for specific EmailJS errors
    if (error instanceof Error) {
      if (error.message.includes("Public Key is invalid")) {
        console.log("🔧 Fix: Update EMAILJS_PUBLIC_KEY in emailService.ts");
        console.log(
          "📍 Get it from: https://dashboard.emailjs.com/admin/account"
        );
      } else if (error.message.includes("Service ID")) {
        console.log("🔧 Fix: Update EMAILJS_SERVICE_ID in emailService.ts");
        console.log("📍 Get it from: https://dashboard.emailjs.com/admin");
      } else if (error.message.includes("Template ID")) {
        console.log("🔧 Fix: Update EMAILJS_TEMPLATE_ID in emailService.ts");
        console.log(
          "📍 Get it from: https://dashboard.emailjs.com/admin/templates"
        );
      }
    }

    return false;
  }
};

// Alternative: Gmail SMTP configuration (if you prefer this approach)
export const sendEmailWithGmail = async (
  params: EmailParams
): Promise<boolean> => {
  try {
    // This would require a backend service
    // For now, we'll use EmailJS which works client-side
    return await sendWelcomeEmail(params);
  } catch (error) {
    console.error("Failed to send email with Gmail:", error);
    return false;
  }
};
