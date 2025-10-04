# Algebra Academy Online - Environment Setup

## Required Environment Variables

For security, all API keys must be configured as environment variables, never hardcoded in files.

### Frontend Environment Variables (.env.local)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Supabase Edge Functions Environment Variables
Configure in Supabase Dashboard > Project Settings > Edge Functions:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## How to Get Your Stripe Keys:
1. Create account at https://stripe.com
2. Go to Developers > API Keys
3. Copy your keys (use test keys for development)
   Vá em: Developers > API keys
   Copie:
   Publishable key (começa com pk*test*...)
   Secret key (começa com sk*test*...)
2. Atualizar o arquivo .env.local:
   .env.local+4-2
3. Atualizar a chave no Supabase Dashboard:
   Acesse: Supabase Dashboard
   Vá em: Settings > Edge Functions > Environment Variables
   Encontre: STRIPE*SECRET_KEY
   Atualize com sua chave real (começando com sk_test*...)
4. Como obter as chaves do Stripe:
   Se você ainda não tem conta no Stripe:
   Vá para: https://dashboard.stripe.com/register
   Crie sua conta (gratuita)
   Preencha informações básicas
   Acesse: Developers > API keys
   Se você já tem conta:
   Faça login: https://dashboard.stripe.com/login
   Vá em: Developers > API keys
   Copie as chaves de teste
5. Exemplo de chaves válidas:
   📋 Próximos passos:
   Obtenha suas chaves reais do Stripe Dashboard
   Atualize o arquivo .env.local
   Atualize a variável no Supabase Dashboard
   Reinicie o servidor: npm run dev
   Teste novamente o booking
   💡 Dica importante:
   Teste gratuito: As chaves de teste do Stripe são 100% gratuitas
   Não cobra cartão: Pagamentos de teste não geram cobrança real
   Ilimitado: Você pode fazer quantos testes quiser
   Obtenha suas chaves reais do Stripe e atualize os arquivos. Depois me informe quando estiver pronto para testar! 🚀
