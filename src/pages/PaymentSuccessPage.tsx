
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const { language } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    // In a real app, you would fetch the booking details using the session_id
    // For now, we'll show a generic success message
    if (sessionId) {
      console.log('Payment session ID:', sessionId);
    }
  }, [sessionId]);

  const handleGoToDashboard = () => {
    navigate('/student');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-600">
                  {language === 'en' ? 'Payment Successful!' : 'Pagamento Realizado com Sucesso!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-600">
                  {language === 'en' 
                    ? 'Your lesson has been booked and payment processed successfully.' 
                    : 'Sua aula foi agendada e o pagamento processado com sucesso.'}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {language === 'en' ? 'What happens next?' : 'O que acontece agora?'}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-primary" />
                      <span>
                        {language === 'en' 
                          ? 'You will receive a confirmation email with your lesson details.' 
                          : 'Você receberá um e-mail de confirmação com os detalhes da sua aula.'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-primary" />
                      <span>
                        {language === 'en' 
                          ? 'Your tutor will contact you 24 hours before the lesson.' 
                          : 'Seu tutor entrará em contato 24 horas antes da aula.'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-1 text-primary" />
                      <span>
                        {language === 'en' 
                          ? 'You can manage your bookings in the student dashboard.' 
                          : 'Você pode gerenciar seus agendamentos no painel do estudante.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleGoToDashboard} className="flex-1 sm:flex-none">
                    {language === 'en' ? 'Go to Dashboard' : 'Ir para o Painel'}
                  </Button>
                  <Button onClick={handleGoHome} variant="outline" className="flex-1 sm:flex-none">
                    {language === 'en' ? 'Back to Home' : 'Voltar ao Início'}
                  </Button>
                </div>

                {sessionId && (
                  <p className="text-xs text-gray-400">
                    {language === 'en' ? 'Reference:' : 'Referência:'} {sessionId}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
