# 🚀 CONFIGURAR EMAILJS AGORA - 3 MINUTOS

## ❌ **Problema Atual:**

O usuário não está recebendo emails porque o EmailJS não está configurado.

## ✅ **Solução Rápida:**

### 1️⃣ **Criar Conta EmailJS** (30 segundos)

```
🔗 https://www.emailjs.com/
```

- Clique "Sign Up"
- Use Google/GitHub (mais rápido)

### 2️⃣ **Adicionar Serviço Gmail** (1 minuto)

1. Dashboard → "Add New Service"
2. Escolha "Gmail"
3. Conecte sua conta Google
4. **IMPORTANTE**: Copie o Service ID (ex: `service_1a2b3c4`)

### 3️⃣ **Criar Template de Email** (1 minuto)

1. Vá em "Email Templates" → "Create New Template"
2. **Subject:** `Bem-vindo à Algebra Academy - {{to_name}}`
3. **Body:** Cole exatamente isto:

```
Olá {{to_name}},

Sua conta foi criada na Algebra Academy!

Para acessar a plataforma:
1. Visite: {{login_url}}
2. Clique em "Registrar"
3. Use seu email: {{to_email}}
4. Crie uma senha segura

Seu papel: {{user_role}}

Bem-vindo à Algebra Academy!

Atenciosamente,
{{from_name}}
```

4. **IMPORTANTE**: Copie o Template ID (ex: `template_9x8y7z6`)

### 4️⃣ **Pegar Public Key** (30 segundos)

1. Vá em "Account" → "General"
2. **IMPORTANTE**: Copie a Public Key (ex: `AbC123XyZ789`)

### 5️⃣ **Configurar no Código** (30 segundos)

Edite o arquivo `src/lib/emailService.ts` e substitua estas 3 linhas:

```typescript
// ANTES (não funciona):
const EMAILJS_SERVICE_ID = "SEU_SERVICE_ID_AQUI";
const EMAILJS_TEMPLATE_ID = "SEU_TEMPLATE_ID_AQUI";
const EMAILJS_PUBLIC_KEY = "SUA_PUBLIC_KEY_AQUI";

// DEPOIS (funcionará):
const EMAILJS_SERVICE_ID = "service_1a2b3c4"; // ← Seu Service ID aqui
const EMAILJS_TEMPLATE_ID = "template_9x8y7z6"; // ← Seu Template ID aqui
const EMAILJS_PUBLIC_KEY = "AbC123XyZ789"; // ← Sua Public Key aqui
```

### 6️⃣ **Testar** (30 segundos)

1. Salve o arquivo
2. Vá para User Management
3. Clique "**Testar Email**"
4. ✅ **Verifique seu email!**

---

## 📊 **Status Atual:**

- ❌ EmailJS não configurado
- ✅ Sistema de fallback funcionando (copia para clipboard)
- ✅ Interface pronta

## 🎯 **Depois da configuração:**

- ✅ Emails enviados automaticamente
- ✅ Usuários recebem instruções por email
- ✅ Sistema totalmente automático

**Tempo total: 3 minutos máximo! 🚀**

## 🆘 **Precisa de ajuda?**

Se tiver dúvidas em qualquer passo, me chame!
