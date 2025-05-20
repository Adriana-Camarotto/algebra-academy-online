
import React from 'react';
import { useAuthStore, UserRole } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuthWrapper from './AuthWrapper';
import { Calendar, Book, ChevronDown, User } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, language } = useAuthStore();

  if (!user) {
    return null;
  }

  // Components for different roles
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'service':
        return <ServiceDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <AuthWrapper allowedRoles={['student', 'parent', 'tutor', 'admin', 'service']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard', language)}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-tutor-primary"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{t(user.role, language)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {renderDashboardContent()}
        </main>
      </div>
    </AuthWrapper>
  );
};

const StudentDashboard: React.FC = () => {
  const { language } = useAuthStore();

  const upcomingLessons = [
    {
      id: 1,
      subject: language === 'en' ? 'Calculus' : 'Cálculo',
      date: '2025-05-22',
      time: '15:00',
      duration: 60,
    },
    {
      id: 2,
      subject: language === 'en' ? 'Linear Algebra' : 'Álgebra Linear',
      date: '2025-05-25',
      time: '14:30',
      duration: 90,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-tutor-primary" />
              {t('upcomingLessons', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="border-l-4 border-tutor-primary pl-3 py-2">
                  <p className="font-medium">{lesson.subject}</p>
                  <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      {new Date(lesson.date).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'pt-BR',
                        { day: 'numeric', month: 'short' }
                      )}
                      , {lesson.time}
                    </span>
                    <span>{lesson.duration} min</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                {language === 'en' ? 'View All' : 'Ver Todos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Book className="h-5 w-5 mr-2 text-tutor-secondary" />
              {t('progress', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{language === 'en' ? 'Calculus' : 'Cálculo'}</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-tutor-secondary h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{language === 'en' ? 'Linear Algebra' : 'Álgebra Linear'}</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-tutor-secondary h-2 rounded-full"
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{language === 'en' ? 'Statistics' : 'Estatística'}</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-tutor-secondary h-2 rounded-full"
                    style={{ width: '90%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-tutor-accent" />
              {language === 'en' ? 'Quick Actions' : 'Ações Rápidas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full bg-tutor-primary">
                {language === 'en' ? 'Book a New Lesson' : 'Agendar Nova Aula'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'View Study Materials' : 'Ver Materiais de Estudo'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'Submit Homework' : 'Enviar Tarefa'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Recommended Resources' : 'Recursos Recomendados'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 hover:border-tutor-accent cursor-pointer">
                <h3 className="font-medium">
                  {language === 'en' ? `Resource ${i}` : `Recurso ${i}`}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {language === 'en'
                    ? 'Click to view this recommended learning material.'
                    : 'Clique para ver este material de aprendizado recomendado.'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ParentDashboard: React.FC = () => {
  const { language } = useAuthStore();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'en' ? 'Parent Dashboard' : 'Painel dos Pais'}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Children\'s Progress' : 'Progresso dos Filhos'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium">Alice</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language === 'en' ? 'Calculus' : 'Cálculo'}</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-tutor-secondary h-2 rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language === 'en' ? 'Statistics' : 'Estatística'}</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-tutor-secondary h-2 rounded-full"
                      style={{ width: '90%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Bob</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language === 'en' ? 'Algebra' : 'Álgebra'}</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-tutor-secondary h-2 rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language === 'en' ? 'Geometry' : 'Geometria'}</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-tutor-secondary h-2 rounded-full"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Upcoming Lessons' : 'Próximas Aulas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Alice - {language === 'en' ? 'Calculus' : 'Cálculo'}</p>
                <p className="text-sm text-gray-500">
                  {new Date('2025-05-22').toLocaleDateString(
                    language === 'en' ? 'en-US' : 'pt-BR',
                    { weekday: 'short', day: 'numeric', month: 'short' }
                  )}
                  , 15:00
                </p>
              </div>
              <Button variant="outline" size="sm">
                {language === 'en' ? 'Details' : 'Detalhes'}
              </Button>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Bob - {language === 'en' ? 'Geometry' : 'Geometria'}</p>
                <p className="text-sm text-gray-500">
                  {new Date('2025-05-24').toLocaleDateString(
                    language === 'en' ? 'en-US' : 'pt-BR',
                    { weekday: 'short', day: 'numeric', month: 'short' }
                  )}
                  , 16:30
                </p>
              </div>
              <Button variant="outline" size="sm">
                {language === 'en' ? 'Details' : 'Detalhes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Payment History' : 'Histórico de Pagamentos'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{language === 'en' ? 'May 2025' : 'Maio 2025'}</span>
                <span>$150.00</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'April 2025' : 'Abril 2025'}</span>
                <span>$150.00</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'March 2025' : 'Março 2025'}</span>
                <span>$120.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Contact Tutor' : 'Contatar Tutora'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                {language === 'en'
                  ? 'Have questions about your child\'s progress?'
                  : 'Tem perguntas sobre o progresso do seu filho?'}
              </p>
              <Button className="w-full">
                {language === 'en' ? 'Send Message' : 'Enviar Mensagem'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TutorDashboard: React.FC = () => {
  const { language } = useAuthStore();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'en' ? 'Tutor Dashboard' : 'Painel da Tutora'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Today\'s Schedule' : 'Agenda de Hoje'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-tutor-primary pl-3 py-1">
                <p className="font-medium">Alice - {language === 'en' ? 'Calculus' : 'Cálculo'}</p>
                <p className="text-sm text-gray-500">15:00 - 16:00</p>
              </div>
              <div className="border-l-4 border-tutor-primary pl-3 py-1">
                <p className="font-medium">João - {language === 'en' ? 'Algebra' : 'Álgebra'}</p>
                <p className="text-sm text-gray-500">16:30 - 17:30</p>
              </div>
              <div className="border-l-4 border-tutor-primary pl-3 py-1">
                <p className="font-medium">Carlos - {language === 'en' ? 'Statistics' : 'Estatística'}</p>
                <p className="text-sm text-gray-500">18:00 - 19:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Student Progress' : 'Progresso dos Alunos'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>Alice</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>João</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>Carlos</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Quick Actions' : 'Ações Rápidas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full bg-tutor-primary">
                {language === 'en' ? 'Create Lesson Plan' : 'Criar Plano de Aula'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'Record Attendance' : 'Registrar Presença'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'Send Homework' : 'Enviar Tarefa'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'en' ? 'Generate Report' : 'Gerar Relatório'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Upcoming Lessons' : 'Próximas Aulas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <p className="font-medium">Student {i}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(`2025-05-${20 + i}`).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'pt-BR',
                        { day: 'numeric', month: 'short' }
                      )}
                    </p>
                  </div>
                  <p className="text-sm mt-1">
                    {['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'][i % 5]}
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      {language === 'en' ? 'View Details' : 'Ver Detalhes'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { language } = useAuthStore();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'en' ? 'Admin Dashboard' : 'Painel do Administrador'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'User Management' : 'Gerenciamento de Usuários'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{language === 'en' ? 'Total Users' : 'Total de Usuários'}</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'Students' : 'Estudantes'}</span>
                <span>25</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'Parents' : 'Pais'}</span>
                <span>10</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'Tutors' : 'Tutores'}</span>
                <span>5</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'en' ? 'Service Providers' : 'Prestadores de Serviço'}</span>
                <span>2</span>
              </div>
              <Button className="w-full">
                {language === 'en' ? 'Manage Users' : 'Gerenciar Usuários'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Site Content' : 'Conteúdo do Site'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                {language === 'en' ? 'Homepage Content' : 'Conteúdo da Página Inicial'}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {language === 'en' ? 'Services' : 'Serviços'}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {language === 'en' ? 'Testimonials' : 'Depoimentos'}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {language === 'en' ? 'FAQ' : 'Perguntas Frequentes'}
              </Button>
              <Button className="w-full">
                {language === 'en' ? 'Edit Content' : 'Editar Conteúdo'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'System Notifications' : 'Notificações do Sistema'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-medium">
                  {language === 'en'
                    ? 'Payment System Maintenance'
                    : 'Manutenção no Sistema de Pagamento'}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Scheduled for May 25, 2025'
                    : 'Agendada para 25 de Maio, 2025'}
                </p>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="font-medium">
                  {language === 'en'
                    ? 'New User Registrations'
                    : 'Novos Registros de Usuários'}
                </p>
                <p className="text-sm text-gray-600">
                  5 {language === 'en' ? 'new users in last 24 hours' : 'novos usuários nas últimas 24 horas'}
                </p>
              </div>
              <Button className="w-full">
                {language === 'en' ? 'View All Notifications' : 'Ver Todas as Notificações'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Analytics' : 'Análises'}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-center text-gray-500">
              {language === 'en'
                ? 'Analytics visualization would go here'
                : 'Visualização de análises apareceria aqui'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Recent Activity' : 'Atividade Recente'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between pb-2 border-b">
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? `Activity ${i}` : `Atividade ${i}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'User' : 'Usuário'} {i}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(`2025-05-${20 - i}`).toLocaleDateString(
                      language === 'en' ? 'en-US' : 'pt-BR',
                      { day: 'numeric', month: 'short' }
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ServiceDashboard: React.FC = () => {
  const { language } = useAuthStore();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'en' ? 'Service Provider Dashboard' : 'Painel do Prestador de Serviço'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'My Services' : 'Meus Serviços'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">
                  {language === 'en' ? 'Website Maintenance' : 'Manutenção do Website'}
                </h3>
                <p className="text-sm mt-1">
                  {language === 'en'
                    ? 'Weekly updates and security checks'
                    : 'Atualizações semanais e verificações de segurança'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium">
                  {language === 'en' ? 'Technical Support' : 'Suporte Técnico'}
                </h3>
                <p className="text-sm mt-1">
                  {language === 'en'
                    ? 'On-call support for platform issues'
                    : 'Suporte sob demanda para problemas da plataforma'}
                </p>
              </div>
              <Button className="w-full">
                {language === 'en' ? 'Manage Services' : 'Gerenciar Serviços'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Open Tickets' : 'Tickets Abertos'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{language === 'en' ? 'Login Issue' : 'Problema de Login'}</p>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Reported by: Alice' : 'Reportado por: Alice'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {language === 'en' ? 'View' : 'Ver'}
                </Button>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">
                    {language === 'en' ? 'Payment Gateway Error' : 'Erro no Gateway de Pagamento'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Reported by: System' : 'Reportado por: Sistema'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {language === 'en' ? 'View' : 'Ver'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Statistics' : 'Estatísticas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{language === 'en' ? 'Total Hours' : 'Total de Horas'}</span>
                <span className="font-bold">120</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === 'en' ? 'Open Tickets' : 'Tickets Abertos'}</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === 'en' ? 'Completed Tasks' : 'Tarefas Concluídas'}</span>
                <span className="font-bold">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-tutor-secondary h-2 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className="text-sm text-center text-gray-500">
                {language === 'en' ? 'Monthly Goal: 65%' : 'Meta Mensal: 65%'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Recent Activity' : 'Atividade Recente'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex border-b pb-3">
                <div className="flex-1">
                  <p className="font-medium">
                    {language === 'en' ? `Task ${i}` : `Tarefa ${i}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'en'
                      ? `This is a description of task ${i}`
                      : `Esta é uma descrição da tarefa ${i}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(`2025-05-${20 - i}`).toLocaleDateString(
                      language === 'en' ? 'en-US' : 'pt-BR',
                      { day: 'numeric', month: 'short' }
                    )}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {language === 'en' ? 'Completed' : 'Concluída'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
