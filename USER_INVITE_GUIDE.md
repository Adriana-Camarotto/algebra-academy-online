# 👥 Gerenciamento de Usuários - Guia de Convites

## 🎯 Como funciona o sistema de convites

### 📧 **Processo de criação de usuários:**

1. **Admin cria o usuário**

   - Preenche nome, email e papel (role) do usuário
   - Sistema cria conta de autenticação no Supabase
   - Sistema cria perfil de usuário na tabela `users`

2. **Email de convite é enviado**

   - Usuário recebe email automático do Supabase
   - Email contém link único e seguro para ativação
   - Link tem validade limitada (24-48h por padrão)

3. **Usuário aceita o convite**
   - Clica no link do email de convite
   - É redirecionado para página de configuração de senha
   - Define sua própria senha segura
   - Conta fica ativa e pronta para uso

### 🔐 **Vantagens do sistema de convites:**

✅ **Segurança**: Usuário define própria senha
✅ **Profissional**: Processo oficial e automatizado  
✅ **Controle**: Admin controla quem pode acessar
✅ **Auditoria**: Histórico completo de criação de contas
✅ **Flexibilidade**: Usuário pode aceitar quando quiser

### 📋 **Papéis de usuário disponíveis:**

- **👨‍🎓 Student (Estudante)**: Acesso a aulas e materiais
- **👨‍👩‍👧‍👦 Parent (Pai/Responsável)**: Acompanha progresso dos filhos
- **👨‍🏫 Tutor**: Ministra aulas e gerencia conteúdo
- **⚙️ Admin (Administrador)**: Acesso completo ao sistema
- **🔧 Service (Serviço)**: Contas de integração e automação

### 🛠️ **Configurações do Supabase necessárias:**

Para que o sistema de convites funcione, certifique-se de:

1. **Email templates configurados** no Supabase Dashboard
2. **SMTP configurado** para envio de emails
3. **Redirect URLs** configuradas corretamente
4. **RLS policies** permitindo admin criar usuários

### 🔧 **Troubleshooting:**

**Email não chegou?**

- Verificar pasta de spam/lixo eletrônico
- Confirmar configurações SMTP no Supabase
- Verificar se email está correto

**Link expirado?**

- Admin pode reenviar convite
- Verificar configurações de validade no Supabase

**Erro de permissão?**

- Verificar se usuário atual tem role 'admin'
- Confirmar RLS policies estão corretas

### 📞 **Suporte:**

Em caso de problemas com convites de usuário, contate a equipe técnica com:

- Email do usuário que deveria receber convite
- Horário da tentativa de criação
- Mensagem de erro (se houver)
- Role do admin que tentou criar o usuário
