# Configuração do EmailJS para Envio Automático de Emails

## Passo 1: Criar Conta no EmailJS

1. Acesse https://www.emailjs.com/
2. Crie uma conta gratuita
3. Verifique seu email

## Passo 2: Configurar Serviço de Email

1. No dashboard do EmailJS, clique em "Add New Service"
2. Escolha seu provedor (Gmail, Outlook, etc.)
3. Conecte sua conta de email
4. Anote o **Service ID**

## Passo 3: Criar Template de Email

1. Vá para "Email Templates"
2. Clique em "Create New Template"
3. Use este template:

```
Subject: Bem-vindo à Algebra Academy - {{to_name}}

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

4. Anote o **Template ID**

## Passo 4: Configurar Chaves

1. Vá para "Account" > "General"
2. Anote sua **Public Key**

## Passo 5: Atualizar Configuração

Edite o arquivo `src/lib/emailService.ts` e substitua:

```typescript
const EMAILJS_SERVICE_ID = "seu_service_id_aqui";
const EMAILJS_TEMPLATE_ID = "seu_template_id_aqui";
const EMAILJS_PUBLIC_KEY = "sua_public_key_aqui";
```

## Limitações da Conta Gratuita

- 200 emails por mês
- Adequado para testes e uso inicial

## Alternativas

Se preferir usar Gmail SMTP diretamente, será necessário um backend (Node.js/Express) para segurança das credenciais.

## Teste

Após configurar, teste criando um usuário na página de User Management.
