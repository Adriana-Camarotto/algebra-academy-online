
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore, mockUsers, User, UserRole } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
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
  const [users, setUsers] = useState<User[]>(Object.values(mockUsers));
  
  // State for user form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student'
  });

  // Navigate back to admin panel
  const handleBack = () => {
    navigate('/admin');
  };

  // Handle input changes for user form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle role selection
  const handleRoleChange = (role: UserRole) => {
    setFormData({
      ...formData,
      role
    });
  };

  // Handle add user
  const handleAddUser = () => {
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

    // Create new user
    const newUser: User = {
      id: `user${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
    };

    // Add user to list
    setUsers([...users, newUser]);
    
    toast({
      title: language === 'en' ? 'Success' : 'Sucesso',
      description: language === 'en' 
        ? 'User added successfully' 
        : 'Usuário adicionado com sucesso',
    });

    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      role: 'student'
    });
    setIsAddDialogOpen(false);
  };

  // Handle edit user
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser || !formData.name || !formData.email || !formData.role) {
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? { 
            ...u, 
            name: formData.name!, 
            email: formData.email!, 
            role: formData.role as UserRole
          } 
        : u
    );
    
    setUsers(updatedUsers);
    
    toast({
      title: language === 'en' ? 'Success' : 'Sucesso',
      description: language === 'en' 
        ? 'User updated successfully' 
        : 'Usuário atualizado com sucesso',
    });
    
    setIsEditDialogOpen(false);
  };

  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(u => u.id !== selectedUser.id));
    
    toast({
      title: language === 'en' ? 'Success' : 'Sucesso',
      description: language === 'en' 
        ? 'User deleted successfully' 
        : 'Usuário excluído com sucesso',
    });
    
    setIsDeleteDialogOpen(false);
  };

  // Translate role names
  const translateRole = (role: UserRole) => {
    const roleTranslations: Record<UserRole, { en: string, pt: string }> = {
      student: { en: 'Student', pt: 'Estudante' },
      parent: { en: 'Parent', pt: 'Pai/Responsável' },
      tutor: { en: 'Tutor', pt: 'Tutor' },
      admin: { en: 'Administrator', pt: 'Administrador' },
      service: { en: 'Service', pt: 'Serviço' }
    };

    return roleTranslations[role][language === 'en' ? 'en' : 'pt'];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mr-4"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'User Management' : 'Gerenciamento de Usuários'}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Users List' : 'Lista de Usuários'}
          </h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus size={18} />
                {language === 'en' ? 'Add User' : 'Adicionar Usuário'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{language === 'en' ? 'Add New User' : 'Adicionar Novo Usuário'}</DialogTitle>
                <DialogDescription>
                  {language === 'en' 
                    ? 'Create a new user account with specific role.' 
                    : 'Crie uma nova conta de usuário com papel específico.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    {language === 'en' ? 'Name' : 'Nome'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {language === 'en' ? 'Email' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">
                    {language === 'en' ? 'Role' : 'Papel'}
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleRoleChange(value as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'Select a role' : 'Selecione um papel'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{language === 'en' ? 'Student' : 'Estudante'}</SelectItem>
                      <SelectItem value="parent">{language === 'en' ? 'Parent' : 'Pai/Responsável'}</SelectItem>
                      <SelectItem value="tutor">{language === 'en' ? 'Tutor' : 'Tutor'}</SelectItem>
                      <SelectItem value="admin">{language === 'en' ? 'Administrator' : 'Administrador'}</SelectItem>
                      <SelectItem value="service">{language === 'en' ? 'Service' : 'Serviço'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser}>
                  {language === 'en' ? 'Add User' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableCaption>
            {language === 'en' ? 'List of all registered users' : 'Lista de todos os usuários registrados'}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'en' ? 'User' : 'Usuário'}</TableHead>
              <TableHead>{language === 'en' ? 'Email' : 'Email'}</TableHead>
              <TableHead>{language === 'en' ? 'Role' : 'Papel'}</TableHead>
              <TableHead className="text-right">{language === 'en' ? 'Actions' : 'Ações'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{translateRole(user.role)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)}>
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
            <DialogTitle>{language === 'en' ? 'Edit User' : 'Editar Usuário'}</DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Update user information and role.' 
                : 'Atualize as informações e o papel do usuário.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                {language === 'en' ? 'Name' : 'Nome'}
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">
                {language === 'en' ? 'Email' : 'Email'}
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">
                {language === 'en' ? 'Role' : 'Papel'}
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select a role' : 'Selecione um papel'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{language === 'en' ? 'Student' : 'Estudante'}</SelectItem>
                  <SelectItem value="parent">{language === 'en' ? 'Parent' : 'Pai/Responsável'}</SelectItem>
                  <SelectItem value="tutor">{language === 'en' ? 'Tutor' : 'Tutor'}</SelectItem>
                  <SelectItem value="admin">{language === 'en' ? 'Administrator' : 'Administrador'}</SelectItem>
                  <SelectItem value="service">{language === 'en' ? 'Service' : 'Serviço'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              {language === 'en' ? 'Save Changes' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Confirm Deletion' : 'Confirmar Exclusão'}</DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? `Are you sure you want to delete ${selectedUser?.name}?` 
                : `Tem certeza que deseja excluir ${selectedUser?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {language === 'en' ? 'Delete' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
