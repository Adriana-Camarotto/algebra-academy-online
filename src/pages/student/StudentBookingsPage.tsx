
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
import { format, isBefore } from 'date-fns';

interface Booking {
  id: string;
  service_type: string;
  lesson_type: string | null;
  lesson_date: string;
  lesson_time: string;
  lesson_day: string;
  payment_status: string;
  status: string;
  amount: number;
  currency: string;
  can_cancel_until: string;
  student_email: string | null;
  created_at: string;
}

const StudentBookingsPage = () => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Load bookings from database
  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('lesson_date', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        toast({
          title: language === 'en' ? 'Error' : 'Erro',
          description: language === 'en' 
            ? 'Failed to load bookings' 
            : 'Falha ao carregar agendamentos',
          variant: "destructive",
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? format(date, 'MMM dd, yyyy')
      : format(date, 'dd/MM/yyyy');
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const value = amount / 100; // Convert pence to pounds
    return new Intl.NumberFormat(language === 'en' ? 'en-GB' : 'pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value);
  };

  // Get service name
  const getServiceName = (serviceType: string) => {
    const services = {
      'individual': language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      'group': language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      'exam-prep': language === 'en' ? 'Exam Preparation' : 'Preparação para Exames'
    };
    return services[serviceType] || serviceType;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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
      default:
        return status;
    }
  };

  // Check if booking can be cancelled
  const canCancelBooking = (booking: Booking) => {
    if (booking.status !== 'scheduled') return false;
    const now = new Date();
    const cancelDeadline = new Date(booking.can_cancel_until);
    return isBefore(now, cancelDeadline);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelling(bookingId);
      
      const { data, error } = await supabase.functions.invoke('cancel-booking', {
        body: { booking_id: bookingId }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: language === 'en' ? 'Booking Cancelled' : 'Agendamento Cancelado',
        description: data.payment_refunded 
          ? (language === 'en' ? 'Lesson cancelled and payment refunded.' : 'Aula cancelada e pagamento reembolsado.')
          : (language === 'en' ? 'Lesson cancelled successfully.' : 'Aula cancelada com sucesso.'),
      });

      // Reload bookings
      await loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'scheduled' && new Date(booking.lesson_date) >= new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status !== 'scheduled' || new Date(booking.lesson_date) < new Date()
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'My Bookings' : 'Meus Agendamentos'}
          </h1>
          <Button onClick={loadBookings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Refresh' : 'Atualizar'}
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">
            {language === 'en' ? 'Loading bookings...' : 'Carregando agendamentos...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <Button onClick={loadBookings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
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
                        {booking.lesson_type === 'recurring' && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Repeat className="h-3 w-3" />
                            {language === 'en' ? 'Recurring' : 'Recorrente'}
                          </div>
                        )}
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
                          {formatCurrency(booking.amount, booking.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {canCancelBooking(booking) && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-re d-700"
                                disabled={cancelling === booking.id}
                              >
                                {cancelling === booking.id ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {language === 'en' ? 'Cancel Lesson' : 'Cancelar Aula'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {booking.lesson_type === 'recurring' ? (
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

      {/* Past/Cancelled Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Past & Cancelled Lessons' : 'Aulas Anteriores e Canceladas'}
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
                      <TableCell className="font-medium">{getServiceName(booking.service_type)}</TableCell>
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
                          {formatCurrency(booking.amount, booking.currency)}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Cancelled' : 'Canceladas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentBookingsPage;
