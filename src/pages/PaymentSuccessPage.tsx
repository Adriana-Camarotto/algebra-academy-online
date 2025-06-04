
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccessPage = () => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const bookingId = queryParams.get('booking_id');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error) {
          console.error('Error loading booking details:', error);
          toast({
            title: language === 'en' ? 'Error' : 'Erro',
            description: language === 'en' 
              ? 'Failed to load booking details' 
              : 'Falha ao carregar detalhes do agendamento',
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setBooking(data);
          
          // Update booking status to confirm payment if needed
          if (data.payment_status === 'pending') {
            await supabase
              .from('bookings')
              .update({ payment_status: 'paid' })
              .eq('id', bookingId);
          }
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setLoading(false);
      }
    };

    getBookingDetails();
  }, [bookingId]);

  // Get service name
  const getServiceName = (serviceType: string) => {
    const services = {
      'individual': language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      'group': language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      'exam-prep': language === 'en' ? 'Exam Preparation' : 'Preparação para Exames'
    };
    return services[serviceType] || serviceType;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return language === 'en' 
      ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="mx-auto rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'en' ? 'Payment Successful!' : 'Pagamento Confirmado!'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Your tutoring session has been booked successfully.' 
                : 'Sua sessão de tutoria foi reservada com sucesso.'}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">
                {language === 'en' ? 'Loading booking details...' : 'Carregando detalhes do agendamento...'}
              </p>
            </div>
          ) : booking ? (
            <Card className="shadow-lg border-green-100">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl">
                  {language === 'en' ? 'Booking Details' : 'Detalhes do Agendamento'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' ? 'Your tutoring session information' : 'Informações da sua sessão de tutoria'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Service Type' : 'Tipo de Serviço'}
                  </p>
                  <p className="font-medium">{getServiceName(booking.service_type)}</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Date' : 'Data'}
                    </p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <p>{formatDate(booking.lesson_date)}</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Time' : 'Horário'}
                    </p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <p>{booking.lesson_time}</p>
                    </div>
                  </div>
                </div>

                {booking.student_email && (
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Student Email' : 'Email do Aluno'}
                    </p>
                    <p className="font-medium">{booking.student_email}</p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {language === 'en' ? 'Payment Status' : 'Status do Pagamento'}
                  </span>
                  <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                    {language === 'en' ? 'Paid' : 'Pago'}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p>
                    {language === 'en'
                      ? 'Payment will be processed 24 hours before your lesson. You can cancel up to 24 hours before the scheduled time.'
                      : 'O pagamento será processado 24 horas antes da sua aula. Você pode cancelar até 24 horas antes do horário agendado.'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 sm:flex-row bg-gray-50 py-4">
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link to="/student/bookings">
                    {language === 'en' ? 'View All Bookings' : 'Ver Todos os Agendamentos'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/">
                    {language === 'en' ? 'Return to Home' : 'Voltar para Início'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">
                  {language === 'en' 
                    ? 'Booking details not found. Your payment may have been processed successfully, but we couldn\'t find the corresponding booking.'
                    : 'Detalhes do agendamento não encontrados. Seu pagamento pode ter sido processado com sucesso, mas não conseguimos encontrar o agendamento correspondente.'}
                </p>
                <Button asChild className="mt-4">
                  <Link to="/student/bookings">
                    {language === 'en' ? 'View All Bookings' : 'Ver Todos os Agendamentos'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
