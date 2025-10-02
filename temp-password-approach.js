// ALTERNATIVE APPROACH: Create user with temporary password
// Use this if email invites don't work in your environment

const handleAddUserWithTempPassword = async () => {
  if (!formData.name || !formData.email || !formData.role) {
    toast({
      title: language === 'en' ? 'Error' : 'Erro',
      description: language === 'en' 
        ? 'Please fill all required fields' 
        : 'Por favor, preencha todos os campos obrigatórios',
      variant: 'destructive'
    });
    return;
  }

  try {
    console.log("🔄 Creating user account with temporary password...");
    
    // Generate temporary password
    const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;
    
    // Step 1: Create authentication account with temporary password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: formData.name,
        role: formData.role,
        temp_password: true, // Flag to force password change
      }
    });

    if (authError) {
      console.error("❌ Error creating auth account:", authError);
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'Failed to create user account. Make sure you have admin privileges.' 
          : 'Falha ao criar conta de usuário. Certifique-se de ter privilégios de admin.',
        variant: 'destructive'
      });
      return;
    }

    console.log("✅ Auth account created, user ID:", authData.user?.id);

    // Step 2: Create user profile in our users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating user profile:", error);
      toast({
        title: language === 'en' ? 'Warning' : 'Aviso',
        description: language === 'en' 
          ? 'User account created but profile setup failed. User can still login.' 
          : 'Conta criada mas configuração do perfil falhou. Usuário ainda pode fazer login.',
        variant: 'destructive'
      });
      return;
    }

    console.log("✅ User profile created successfully");

    // Show temporary password to admin
    toast({
      title: language === 'en' ? 'Success' : 'Sucesso',
      description: language === 'en' 
        ? `User created! Temporary password: ${tempPassword}` 
        : `Usuário criado! Senha temporária: ${tempPassword}`,
      duration: 10000, // Show for 10 seconds
    });

    // Optionally, copy to clipboard
    navigator.clipboard.writeText(tempPassword);

    // Transform and add to local state
    const newUser: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      avatar: data.avatar,
    };

    setUsers([newUser, ...users]);
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      role: 'student'
    });
    setIsAddDialogOpen(false);

  } catch (error) {
    console.error("Error adding user:", error);
    toast({
      title: language === 'en' ? 'Error' : 'Erro',
      description: language === 'en' 
        ? 'Failed to add user' 
        : 'Falha ao adicionar usuário',
      variant: 'destructive'
    });
  }
};
