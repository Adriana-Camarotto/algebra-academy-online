
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Calendar, Clock, DollarSign, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentBookingsPage = () => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  
  // Mock lesson bookings data
  const [bookings, setBookings] = useState([
    {
      id: '1',
      service: language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      lessonType: 'recurring',
      date: '2025-01-30',
      time: '14:00',
      paymentStatus: 'paid',
      nextPayment: '2025-02-06',
      canCancel: true,
    },
    {
      id: '2',
      service: language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      lessonType: 'single',
      date: '2025-02-03',
      time: '16:00',
      paymentStatus: 'paid',
      nextPayment: null,
      canCancel: true,
    },
    {
      id: '3',
      service: language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      lessonType: 'single',
      date: '2025-02-10',
      time: '10:00',
      paymentStatus: 'pending',
      nextPayment: null,
      canCancel: true,
    },
    {
      id: '4',
      service: language === 'en' ? 'Exam Preparation' : 'Preparação para Exames',
      lessonType: 'single',
      date: '2025-01-25',
      time: '15:00',
      paymentStatus: 'paid',
      nextPayment: null,
      canCancel: false, // Past lesson
    },
  ]);

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return language === 'en' ? 'Paid' : 'Pago';
      case 'pending':
        return language === 'en' ? 'Pending' : 'Pendente';
      case 'failed':
        return language === 'en' ? 'Failed' : 'Falhou';
      default:
        return status;
    }
  };

  const handleCancelBooking = (bookingId: string, lessonType: string) => {
    // In a real app, this would make an API call to cancel the booking
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    
    const message = lessonType === 'recurring' 
      ? (language === 'en' 
          ? 'Recurring lesson cancelled. Future payments have been stopped.' 
          : 'Aula recorrente cancelada. Pagamentos futuros foram interrompidos.')
      : (language === 'en' 
          ? 'Lesson cancelled successfully.' 
          : 'Aula cancelada com sucesso.');

    toast({
      title: language === 'en' ? 'Booking Cancelled' : 'Agendamento Cancelado',
      description: message,
    });
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) >= new Date() || booking.lessonType === 'recurring'
  );
  
  const pastBookings = bookings.filter(booking => 
    new Date(booking.date) < new Date() && booking.lessonType !== 'recurring'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'My Bookings' : 'Meus Agendamentos'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'en' 
            ? 'Manage your scheduled lessons and view payment status'
            : 'Gerencie suas aulas agendadas e visualize o status de pagamento'}
        </p>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === 'en' ? 'Upcoming Lessons' : 'Próximas Aulas'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Your scheduled lessons and recurring bookings'
              : 'Suas aulas agendadas e reservas recorrentes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'No upcoming lessons scheduled' 
                  : 'Nenhuma aula agendada'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Service' : 'Serviço'}</TableHead>
                    <TableHead>{language === 'en' ? 'Type' : 'Tipo'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'Data'}</TableHead>
                    <TableHead>{language === 'en' ? 'Time' : 'Horário'}</TableHead>
                    <TableHead>{language === 'en' ? 'Payment' : 'Pagamento'}</TableHead>
                    <TableHead>{language === 'en' ? 'Next Payment' : 'Próximo Pagamento'}</TableHead>
                    <TableHead>{language === 'en' ? 'Actions' : 'Ações'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.service}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {booking.lessonType === 'recurring' && (
                            <Repeat className="h-4 w-4 text-blue-600" />
                          )}
                          {booking.lessonType === 'recurring' 
                            ? (language === 'en' ? 'Recurring' : 'Recorrente')
                            : (language === 'en' ? 'Single' : 'Única')}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.nextPayment ? (
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-4 w-4" />
                            {formatDate(booking.nextPayment)}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {booking.canCancel && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {language === 'en' ? 'Cancel Lesson' : 'Cancelar Aula'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {booking.lessonType === 'recurring' ? (
                                    language === 'en' 
                                      ? 'This will cancel your recurring lesson and stop all future payments. This action cannot be undone.'
                                      : 'Isso cancelará sua aula recorrente e interromperá todos os pagamentos futuros. Esta ação não pode ser desfeita.'
                                  ) : (
                                    language === 'en'
                                      ? 'Are you sure you want to cancel this lesson? This action cannot be undone.'
                                      : 'Tem certeza de que deseja cancelar esta aula? Esta ação não pode ser desfeita.'
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {language === 'en' ? 'Keep Lesson' : 'Manter Aula'}
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleCancelBooking(booking.id, booking.lessonType)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {language === 'en' ? 'Cancel Lesson' : 'Cancelar Aula'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Past Lessons' : 'Aulas Anteriores'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Your completed lessons'
                : 'Suas aulas concluídas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Service' : 'Serviço'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'Data'}</TableHead>
                    <TableHead>{language === 'en' ? 'Time' : 'Horário'}</TableHead>
                    <TableHead>{language === 'en' ? 'Payment' : 'Pagamento'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.service}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Total Bookings' : 'Total de Agendamentos'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Upcoming' : 'Próximas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Completed' : 'Concluídas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pastBookings.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentBookingsPage;
