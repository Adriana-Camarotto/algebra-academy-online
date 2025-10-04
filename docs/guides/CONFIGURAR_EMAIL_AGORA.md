# 🚀 CONFIGURAÇÃO EMAILJS - 2 MINUTOS

## ⚡ Passo a Passo Rápido:

### 1️⃣ **Criar Conta** (30 segundos)

- Acesse: https://www.emailjs.com/
- Clique "Sign Up" → Use Google/GitHub
- ✅ Pronto!

### 2️⃣ **Configurar Gmail** (1 minuto)

- Dashboard → "Add New Service"
- Escolha "Gmail"
- Conecte sua conta Gmail
- **COPIE o Service ID** (ex: `service_1a2b3c4`)

### 3️⃣ **Criar Template** (30 segundos)

- Vá em "Email Templates" → "Create New Template"
- **Subject:** `Bem-vindo à Algebra Academy - {{to_name}}`
- **Body:** Cole isto:

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

- **COPIE o Template ID** (ex: `template_9x8y7z6`)

### 4️⃣ **Pegar Public Key** (10 segundos)

- Vá em "Account" → "General"
- **COPIE a Public Key** (ex: `AbC123XyZ789`)

### 5️⃣ **Configurar no Código** (20 segundos)

Edite o arquivo `src/lib/emailService.ts` e substitua:

```typescript
const EMAILJS_SERVICE_ID = "service_1a2b3c4"; // ← Cole seu Service ID
const EMAILJS_TEMPLATE_ID = "template_9x8y7z6"; // ← Cole seu Template ID
const EMAILJS_PUBLIC_KEY = "AbC123XyZ789"; // ← Cole sua Public Key
```

## 🎯 **Testar:**

1. Salve o arquivo
2. Vá para User Management
3. Clique "**Testar Email**"
4. ✅ **Funcionou!**

---

## ❌ **Seu erro atual:**

```
The Public Key is invalid
```

## ✅ **Solução:**

Você precisa substituir `SUA_PUBLIC_KEY_AQUI` pela Public Key real do EmailJS.

**Tempo total: 2 minutos! 🚀**
