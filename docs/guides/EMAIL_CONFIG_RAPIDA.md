# 📧 Configuração Rápida do EmailJS

## ✅ O que foi implementado:

- **Envio automático de email** quando um novo usuário é criado
- **Email de boas-vindas** com instruções de registro
- **Fallback para clipboard** se o email falhar
- **Botão de teste** para verificar se o email está funcionando

## 🚀 Configuração (5 minutos):

### 1. Criar conta EmailJS (GRATUITO)

- Acesse: https://www.emailjs.com/
- Clique em "Sign Up"
- Use sua conta Google/GitHub

### 2. Configurar Gmail

- No dashboard EmailJS: "Add New Service"
- Escolha "Gmail"
- Conecte sua conta Gmail
- **Copie o Service ID** (ex: `service_abc123`)

### 3. Criar Template

- Vá em "Email Templates" → "Create New Template"
- Cole este conteúdo:

**Subject:** `Bem-vindo à Algebra Academy - {{to_name}}`

**Body:**

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

- **Copie o Template ID** (ex: `template_xyz789`)

### 4. Pegar Public Key

- Vá em "Account" → "General"
- **Copie a Public Key** (ex: `abcdefghijk123`)

### 5. Atualizar configuração

Edite o arquivo `src/lib/emailService.ts`:

```typescript
const EMAILJS_SERVICE_ID = "seu_service_id"; // Cole aqui
const EMAILJS_TEMPLATE_ID = "seu_template_id"; // Cole aqui
const EMAILJS_PUBLIC_KEY = "sua_public_key"; // Cole aqui
```

## 🧪 Testar

1. Va para User Management
2. Clique no botão "**Testar Email**"
3. Verifique se recebeu o email

## 📊 Limitações da conta gratuita:

- **200 emails/mês** (suficiente para começar)
- Sem custos adicionais

## ✨ Funcionamento:

1. **Criar usuário** → Email enviado automaticamente
2. **Email falha** → Instruções copiadas para clipboard
3. **Botão Mail** → Reenviar instruções para usuários existentes

**Pronto! Agora os emails são enviados automaticamente! 🎉**
