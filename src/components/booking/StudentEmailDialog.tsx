
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentEmailDialogProps {
  language: string;
  open: boolean;
  studentEmail: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const StudentEmailDialog: React.FC<StudentEmailDialogProps> = ({
  language,
  open,
  studentEmail,
  onEmailChange,
  onSubmit,
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Student Information' : 'Informações do Aluno'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {language === 'en'
              ? 'Since you are booking as a parent, please provide the student\'s email address. This must match the email the student used to register.'
              : 'Como você está fazendo a reserva como responsável, forneça o endereço de email do aluno. Este deve corresponder ao email que o aluno usou para se registrar.'}
          </p>
          <div>
            <Label htmlFor="student-email">
              {language === 'en' ? 'Student Email' : 'Email do Aluno'}
            </Label>
            <Input
              id="student-email"
              type="email"
              value={studentEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={language === 'en' ? 'student@example.com' : 'aluno@exemplo.com'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {language === 'en' ? 'Cancel' : 'Cancelar'}
          </Button>
          <Button onClick={onSubmit}>
            {language === 'en' ? 'Continue' : 'Continuar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentEmailDialog;
