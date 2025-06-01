
import React, { useState, useEffect } from 'react';
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
import { Trash2, Calendar, Clock, DollarSign, Repeat, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  service_type: string;
  lesson_type: string;
  lesson_date: string;
  lesson_time: string;
  lesson_day: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  can_cancel_until: string;
  created_at: string;
  student_email?: string;
}

const StudentBookingsPage = () => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings from database
  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('lesson_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: language === 'en' ? 'Error' : 'Erro',
          description: language === 'en' 
            ? 'Failed to load bookings' 
            : 'Falha ao carregar agendamentos',
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched bookings:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get service name translation
  const getServiceName = (serviceType: string) => {
    const serviceNames = {
      'individual': language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      'group': language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      'exam-prep': language === 'en' ? 'Exam Preparation' : 'Preparação para Exames'
    };
    return serviceNames[serviceType] || serviceType;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'payment_failed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return language === 'en' ? 'Scheduled' : 'Agendada';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'Cancelada';
      case 'completed':
        return language === 'en' ? 'Completed' : 'Concluída';
      case 'payment_failed':
        return language === 'en' ? 'Payment Failed' : 'Falha no Pagamento';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
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
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'Cancelado';
      case 'failed':
        return language === 'en' ? 'Failed' : 'Falhou';
      default:
        return status;
    }
  };

  // Check if booking can be cancelled
  const canCancelBooking = (booking: Booking) => {
    if (booking.status !== 'scheduled') return false;
    const now = new Date();
    const canCancelUntil = new Date(booking.can_cancel_until);
    return now <= canCancelUntil;
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-booking', {
        body: { booking_id: bookingId }
      });

      if (error) {
        console.error('Cancellation error:', error);
        toast({
          title: language === 'en' ? 'Cancellation Failed' : 'Falha no Cancelamento',
          description: error.message || (language === 'en' 
            ? 'Failed to cancel booking' 
            : 'Falha ao cancelar agendamento'),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: language === 'en' ? 'Booking Cancelled' : 'Agendamento Cancelado',
        description: data.message || (language === 'en' 
          ? 'Booking cancelled successfully' 
          : 'Agendamento cancelado com sucesso'),
      });

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' 
          ? 'An error occurred while cancelling the booking' 
          : 'Ocorreu um erro ao cancelar o agendamento',
        variant: "destructive",
      });
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.lesson_date) >= new Date() && booking.status === 'scheduled'
  );
  
  const pastBookings = bookings.filter(booking => 
    new Date(booking.lesson_date) < new Date() || booking.status !== 'scheduled'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{language === 'en' ? 'Loading bookings...' : 'Carregando agendamentos...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
        <Button onClick={fetchBookings} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {language === 'en' ? 'Refresh' : 'Atualizar'}
        </Button>
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
              ? 'Your scheduled lessons'
              : 'Suas aulas agendadas'}
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
                    <TableHead>{language === 'en' ? 'Date' : 'Data'}</TableHead>
                    <TableHead>{language === 'en' ? 'Time' : 'Horário'}</TableHead>
                    <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'en' ? 'Payment' : 'Pagamento'}</TableHead>
                    <TableHead>{language === 'en' ? 'Amount' : 'Valor'}</TableHead>
                    <TableHead>{language === 'en' ? 'Actions' : 'Ações'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {getServiceName(booking.service_type)}
                      </TableCell>
                      <TableCell>{formatDate(booking.lesson_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.lesson_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                          {getPaymentStatusText(booking.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          £{(booking.amount / 100).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {canCancelBooking(booking) && (
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
                                  {language === 'en'
                                    ? 'Are you sure you want to cancel this lesson? The payment will not be processed if you cancel more than 24 hours before the lesson.'
                                    : 'Tem certeza de que deseja cancelar esta aula? O pagamento não será processado se você cancelar com mais de 24 horas de antecedência.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {language === 'en' ? 'Keep Lesson' : 'Manter Aula'}
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleCancelBooking(booking.id)}
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
                ? 'Your completed and cancelled lessons'
                : 'Suas aulas concluídas e canceladas'}
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
                    <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'en' ? 'Payment' : 'Pagamento'}</TableHead>
                    <TableHead>{language === 'en' ? 'Amount' : 'Valor'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {getServiceName(booking.service_type)}
                      </TableCell>
                      <TableCell>{formatDate(booking.lesson_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.lesson_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                          {getPaymentStatusText(booking.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          £{(booking.amount / 100).toFixed(2)}
                        </div>
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
              {language === 'en' ? 'Completed/Cancelled' : 'Concluídas/Canceladas'}
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
