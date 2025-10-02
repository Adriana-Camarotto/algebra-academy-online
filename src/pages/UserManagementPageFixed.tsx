import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  UserPlus,
  Pencil,
  Trash2,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useAuthStore, User, UserRole } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserManagementPage: React.FC = () => {
  const { user, language } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for users list
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
  });

  // Load users from Supabase
  const loadUsers = async () => {
    try {
      console.log("🔄 Loading users from Supabase...");

      const { data: supabaseUsers, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error loading users:", error);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? "Failed to load users from database"
              : "Falha ao carregar usuários do banco de dados",
          variant: "destructive",
        });
        return;
      }

      console.log(
        `✅ Loaded ${supabaseUsers?.length || 0} users from Supabase`
      );

      // Transform Supabase users to match our User interface
      const transformedUsers: User[] = (supabaseUsers || []).map((user) => ({
        id: user.id,
        name: user.name || user.email || "Unknown User",
        email: user.email || "",
        role: (user.role as UserRole) || "student",
        avatar:
          user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name || user.email || "U"
          )}&background=random&color=fff`,
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to load users"
            : "Falha ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  // Navigation
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Debug function to check current user status
  const checkUserStatus = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("🔍 Current session:", session);
      console.log("🔍 Current user from auth store:", user);

      if (session?.user) {
        console.log("🔍 User metadata:", session.user.user_metadata);
        console.log("🔍 App metadata:", session.user.app_metadata);

        // Check user in database
        const { data: dbUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        console.log("🔍 User in database:", dbUser);
        console.log("🔍 Database error:", error);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  // Handle send instructions
  const handleSendInstructions = async (user: User) => {
    const instructions =
      language === "en"
        ? `Hello ${user.name},

Your account profile exists at Algebra Academy!

To access the platform:
1. Visit: ${window.location.origin}
2. Click "Sign Up" (if you haven't registered yet)
3. Use your email: ${user.email}
4. Create a secure password

Your role: ${user.role}

If you already have an account, simply log in with your email and password.

Welcome to Algebra Academy!`
        : `Olá ${user.name},

Seu perfil de conta existe na Algebra Academy!

Para acessar a plataforma:
1. Visite: ${window.location.origin}
2. Clique em "Registrar" (se ainda não se registrou)
3. Use seu email: ${user.email}
4. Crie uma senha segura

Seu papel: ${user.role}

Se já possui uma conta, simplesmente faça login com seu email e senha.

Bem-vindo à Algebra Academy!`;

    try {
      await navigator.clipboard.writeText(instructions);
      toast({
        title:
          language === "en" ? "Instructions Copied" : "Instruções Copiadas",
        description:
          language === "en"
            ? `Instructions for ${user.name} copied to clipboard. You can now send them via email or WhatsApp.`
            : `Instruções para ${user.name} copiadas. Você pode enviá-las por email ou WhatsApp agora.`,
        duration: 5000,
      });
    } catch (e) {
      console.log("Could not copy to clipboard:", e);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Could not copy to clipboard"
            : "Não foi possível copiar para área de transferência",
        variant: "destructive",
      });
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Please fill all required fields"
            : "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🔄 Creating user profile in database...");

      // Generate a unique ID for the new user
      const newUserId = crypto.randomUUID();

      // Create user profile directly in our users table
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: newUserId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.name
          )}&background=random&color=fff`,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating user profile:", error);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? `Failed to create user: ${error.message}`
              : `Falha ao criar usuário: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("✅ User profile created successfully");

      // Transform and add to local state
      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar,
      };

      setUsers([newUser, ...users]);

      toast({
        title: language === "en" ? "Success" : "Sucesso",
        description:
          language === "en"
            ? `User ${formData.name} created successfully! They can now sign up with this email: ${formData.email}`
            : `Usuário ${formData.name} criado com sucesso! Ele pode se registrar com este email: ${formData.email}`,
        duration: 8000,
      });

      // Copy registration instructions to clipboard
      const instructions =
        language === "en"
          ? `Hello ${formData.name},

Your account has been created at Algebra Academy!

To access the platform:
1. Visit: ${window.location.origin}
2. Click "Sign Up"
3. Use your email: ${formData.email}
4. Create a secure password

Your role: ${formData.role}

Welcome to Algebra Academy!`
          : `Olá ${formData.name},

Sua conta foi criada na Algebra Academy!

Para acessar a plataforma:
1. Visite: ${window.location.origin}
2. Clique em "Registrar"
3. Use seu email: ${formData.email}
4. Crie uma senha segura

Seu papel: ${formData.role}

Bem-vindo à Algebra Academy!`;

      try {
        await navigator.clipboard.writeText(instructions);
        toast({
          title:
            language === "en" ? "Instructions Copied" : "Instruções Copiadas",
          description:
            language === "en"
              ? "Registration instructions have been copied to clipboard. You can now send them to the user."
              : "As instruções de registro foram copiadas. Você pode enviá-las ao usuário agora.",
          duration: 5000,
        });
      } catch (e) {
        console.log("Could not copy to clipboard:", e);
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        role: "student",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to add user"
            : "Falha ao adicionar usuário",
        variant: "destructive",
      });
    }
  };

  // Handle edit user
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !formData.name || !formData.email || !formData.role) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Please fill all required fields"
            : "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update user in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.name
          )}&background=random&color=fff`,
        })
        .eq("id", selectedUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? "Failed to update user in database"
              : "Falha ao atualizar usuário no banco de dados",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      const updatedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar,
      };

      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );

      toast({
        title: language === "en" ? "Success" : "Sucesso",
        description:
          language === "en"
            ? "User updated successfully"
            : "Usuário atualizado com sucesso",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to update user"
            : "Falha ao atualizar usuário",
        variant: "destructive",
      });
    }
  };

  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Delete user from Supabase
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", selectedUser.id);

      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? "Failed to delete user from database"
              : "Falha ao excluir usuário do banco de dados",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setUsers(users.filter((u) => u.id !== selectedUser.id));

      toast({
        title: language === "en" ? "Success" : "Sucesso",
        description:
          language === "en"
            ? "User deleted successfully"
            : "Usuário excluído com sucesso",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to delete user"
            : "Falha ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  // Translate role names
  const translateRole = (role: UserRole) => {
    const roleTranslations: Record<UserRole, { en: string; pt: string }> = {
      student: { en: "Student", pt: "Estudante" },
      parent: { en: "Parent", pt: "Pai/Responsável" },
      tutor: { en: "Tutor", pt: "Tutor" },
      admin: { en: "Administrator", pt: "Administrador" },
      service: { en: "Service", pt: "Serviço" },
    };

    return roleTranslations[role][language === "en" ? "en" : "pt"];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="animate-spin" size={20} />
            <span>
              {language === "en"
                ? "Loading users..."
                : "Carregando usuários..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">
          {language === "en" ? "User Management" : "Gerenciamento de Usuários"}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {language === "en" ? "Users List" : "Lista de Usuários"}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={checkUserStatus}
              className="flex items-center gap-2"
            >
              🔍 Debug Status
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {language === "en" ? "Refresh" : "Atualizar"}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={18} />
                  {language === "en" ? "Add User" : "Adicionar Usuário"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {language === "en"
                      ? "Add New User"
                      : "Adicionar Novo Usuário"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    {language === "en"
                      ? "Create a user profile. Registration instructions will be automatically copied to clipboard so you can send them to the user via email or WhatsApp."
                      : "Crie um perfil de usuário. As instruções de registro serão automaticamente copiadas para você enviar ao usuário por email ou WhatsApp."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {language === "en" ? "Name" : "Nome"}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      {language === "en" ? "Role" : "Papel"}
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value as UserRole })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          {language === "en" ? "Student" : "Estudante"}
                        </SelectItem>
                        <SelectItem value="parent">
                          {language === "en" ? "Parent" : "Pai/Responsável"}
                        </SelectItem>
                        <SelectItem value="tutor">
                          {language === "en" ? "Tutor" : "Tutor"}
                        </SelectItem>
                        <SelectItem value="admin">
                          {language === "en"
                            ? "Administrator"
                            : "Administrador"}
                        </SelectItem>
                        <SelectItem value="service">
                          {language === "en" ? "Service" : "Serviço"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddUser}>
                    {language === "en" ? "Add User" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableCaption>
            {language === "en"
              ? "List of all registered users"
              : "Lista de todos os usuários registrados"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "en" ? "User" : "Usuário"}</TableHead>
              <TableHead>{language === "en" ? "Email" : "Email"}</TableHead>
              <TableHead>{language === "en" ? "Role" : "Papel"}</TableHead>
              <TableHead className="text-right">
                {language === "en" ? "Actions" : "Ações"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {translateRole(user.role)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendInstructions(user)}
                      title={
                        language === "en"
                          ? "Copy registration instructions"
                          : "Copiar instruções de registro"
                      }
                    >
                      <Mail size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Edit User" : "Editar Usuário"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                {language === "en" ? "Name" : "Nome"}
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                {language === "en" ? "Role" : "Papel"}
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as UserRole })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    {language === "en" ? "Student" : "Estudante"}
                  </SelectItem>
                  <SelectItem value="parent">
                    {language === "en" ? "Parent" : "Pai/Responsável"}
                  </SelectItem>
                  <SelectItem value="tutor">
                    {language === "en" ? "Tutor" : "Tutor"}
                  </SelectItem>
                  <SelectItem value="admin">
                    {language === "en" ? "Administrator" : "Administrador"}
                  </SelectItem>
                  <SelectItem value="service">
                    {language === "en" ? "Service" : "Serviço"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              {language === "en" ? "Update User" : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Delete User" : "Excluir Usuário"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? `Are you sure you want to delete ${selectedUser?.name}?`
                : `Tem certeza que deseja excluir ${selectedUser?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {language === "en" ? "Delete" : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
