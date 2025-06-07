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

interface DebugInfo {
  sessionId?: string;
  bookingId?: string;
  step?: string;
  currentUser?: any;
  error?: string;
  sessionCheck?: any;
  authError?: string;
  publicFetchAttempt?: any;
  publicFetchError?: any;
  authenticatedUserId?: string;
  authStoreUser?: any;
  dbResponse?: any;
  queryUserId?: string;
  userIdMatch?: string | boolean;
  dbError?: any;
  bookingFound?: boolean;
  booking?: any;
  userMatch?: boolean;
  adminQuery?: any;
  adminQueryError?: any;
  unexpectedError?: any;
}

const PaymentSuccessPage = () => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const bookingId = queryParams.get('booking_id');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    const getBookingDetails = async () => {
      console.log('PaymentSuccess: Starting booking lookup', { sessionId, bookingId, user });
      setDebugInfo({ 
        sessionId: sessionId || undefined, 
        bookingId: bookingId || undefined, 
        step: 'starting', 
        currentUser: user 
      });

      if (!bookingId) {
        console.log('PaymentSuccess: No booking ID provided');
        setDebugInfo(prev => ({ ...prev, error: 'No booking ID provided' }));
        setLoading(false);
        return;
      }

      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('PaymentSuccess: Session check:', { session: session?.user, sessionError });
      setDebugInfo(prev => ({ ...prev, sessionCheck: { session: session?.user, sessionError } }));

      if (!session?.user) {
        console.log('PaymentSuccess: User not authenticated');
        setDebugInfo(prev => ({ ...prev, authError: 'User not authenticated' }));
        
        // Try to fetch without auth first to see if RLS is the issue
        try {
          console.log('PaymentSuccess: Attempting to fetch booking without auth context');
          const { data: publicData, error: publicError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .maybeSingle();
          
          setDebugInfo(prev => ({ 
            ...prev, 
            publicFetchAttempt: { data: publicData, error: publicError },
            step: 'public_fetch_attempted'
          }));
        } catch (error) {
          console.error('PaymentSuccess: Public fetch failed:', error);
          setDebugInfo(prev => ({ ...prev, publicFetchError: error }));
        }
        
        setLoading(false);
        return;
      }

      try {
        console.log('PaymentSuccess: Fetching booking with authenticated user:', session.user.id);
        setDebugInfo(prev => ({ 
          ...prev, 
          step: 'fetching_authenticated', 
          authenticatedUserId: session.user.id,
          authStoreUser: user
        }));

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .maybeSingle();

        console.log('PaymentSuccess: Database response:', { data, error });
        setDebugInfo(prev => ({ 
          ...prev, 
          dbResponse: { data, error }, 
          step: 'response_received',
          queryUserId: session.user.id,
          userIdMatch: data ? data.user_id === session.user.id : 'no_data_to_compare'
        }));

        if (error) {
          console.error('PaymentSuccess: Database error:', error);
          setDebugInfo(prev => ({ ...prev, dbError: error }));
          toast({
            title: language === 'en' ? 'Error' : 'Erro',
            description: language === 'en' 
              ? 'Failed to load booking details: ' + error.message
              : 'Falha ao carregar detalhes do agendamento: ' + error.message,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('PaymentSuccess: Booking found:', data);
          setBooking(data);
          setDebugInfo(prev => ({ 
            ...prev, 
            bookingFound: true, 
            booking: data,
            userMatch: data.user_id === session.user.id 
          }));
          
          // Update booking status to confirm payment if needed
          if (data.payment_status === 'pending') {
            console.log('PaymentSuccess: Updating payment status to paid');
            const { error: updateError } = await supabase
              .from('bookings')
              .update({ payment_status: 'paid' })
              .eq('id', bookingId);
            
            if (updateError) {
              console.error('PaymentSuccess: Error updating payment status:', updateError);
            } else {
              console.log('PaymentSuccess: Payment status updated successfully');
            }
          }
        } else {
          console.log('PaymentSuccess: No booking found with ID:', bookingId);
          setDebugInfo(prev => ({ ...prev, bookingFound: false }));
          
          // Additional debug: try to find any booking with this ID across all users (admin query)
          try {
            console.log('PaymentSuccess: Attempting admin query to find booking');
            const { data: adminData, error: adminError } = await supabase
              .rpc('get_booking_by_id', { booking_id: bookingId })
              .maybeSingle();
            
            setDebugInfo(prev => ({ 
              ...prev, 
              adminQuery: { data: adminData, error: adminError }
            }));
          } catch (adminError) {
            console.log('PaymentSuccess: Admin query not available:', adminError);
            setDebugInfo(prev => ({ ...prev, adminQueryError: adminError }));
          }
        }
      } catch (error) {
        console.error('PaymentSuccess: Unexpected error:', error);
        setDebugInfo(prev => ({ ...prev, unexpectedError: error }));
      } finally {
        setLoading(false);
      }
    };

    getBookingDetails();
  }, [bookingId, language, toast, user]);

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
              {bookingId && (
                <p className="mt-2 text-sm text-gray-400">
                  Booking ID: {bookingId}
                </p>
              )}
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
                <p className="text-gray-500 mb-4">
                  {language === 'en' 
                    ? 'Booking details not found. Your payment may have been processed successfully, but we couldn\'t find the corresponding booking.'
                    : 'Detalhes do agendamento não encontrados. Seu pagamento pode ter sido processado com sucesso, mas não conseguimos encontrar o agendamento correspondente.'}
                </p>
                
                {/* Enhanced Debug Information */}
                <details className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                  <summary className="cursor-pointer text-sm font-medium mb-2">
                    Debug Information (Click to expand)
                  </summary>
                  <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>

                <div className="space-y-4">
                  <Button asChild className="mr-4">
                    <Link to="/student/bookings">
                      {language === 'en' ? 'View All Bookings' : 'Ver Todos os Agendamentos'}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/booking">
                      {language === 'en' ? 'Book Another Lesson' : 'Agendar Outra Aula'}
                    </Link>
                  </Button>
                </div>
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
