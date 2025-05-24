
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const BookingPage: React.FC = () => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for available time slots
  const availableSlots = {
    'monday': ['9:00', '10:00', '14:00', '15:00'],
    'tuesday': ['11:00', '13:00', '16:00'],
    'wednesday': ['9:00', '12:00', '17:00'],
    'thursday': ['10:00', '14:00', '16:00'],
    'friday': ['9:00', '11:00', '15:00'],
  };

  const daysTranslation = {
    'monday': language === 'en' ? 'Monday' : 'Segunda',
    'tuesday': language === 'en' ? 'Tuesday' : 'Terça',
    'wednesday': language === 'en' ? 'Wednesday' : 'Quarta',
    'thursday': language === 'en' ? 'Thursday' : 'Quinta',
    'friday': language === 'en' ? 'Friday' : 'Sexta',
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleTabChange = (day: string) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDay || !selectedTime || !selectedDate) {
      toast({
        title: language === 'en' ? 'Incomplete Selection' : 'Seleção Incompleta',
        description: language === 'en' 
          ? 'Please select a date, day and time for your lesson.' 
          : 'Por favor, selecione uma data, dia e horário para sua aula.',
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: 6000, // $60.00 in cents
          currency: 'usd',
          product_name: language === 'en' ? 'Math Tutoring Lesson' : 'Aula de Tutoria de Matemática',
          booking_details: {
            date: format(selectedDate, 'yyyy-MM-dd'),
            day: selectedDay,
            time: selectedTime,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: language === 'en' ? 'Redirecting to Payment' : 'Redirecionando para Pagamento',
          description: language === 'en' 
            ? 'Please complete your payment in the new tab.' 
            : 'Por favor, complete seu pagamento na nova aba.',
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: language === 'en' ? 'Payment Error' : 'Erro no Pagamento',
        description: language === 'en' 
          ? 'There was an error processing your payment. Please try again.' 
          : 'Houve um erro ao processar seu pagamento. Tente novamente.',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'en' ? 'Book a Lesson' : 'Agendar uma Aula'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'en' 
                ? 'Select a date, day and time slot that works for you.' 
                : 'Selecione uma data, dia e horário que funcione para você.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>
                    {language === 'en' ? 'Select Date and Time' : 'Selecionar Data e Horário'}
                  </CardTitle>
                </div>
                <CardDescription>
                  {language === 'en' 
                    ? 'Choose your preferred date, day and time' 
                    : 'Escolha sua data, dia e horário preferido'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'en' ? 'Select Date' : 'Selecionar Data'}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>{language === 'en' ? 'Pick a date' : 'Escolha uma data'}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Day and Time Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'en' ? 'Available Time Slots' : 'Horários Disponíveis'}
                  </label>
                  <Tabs defaultValue="monday" onValueChange={handleTabChange}>
                    <TabsList className="grid grid-cols-5">
                      {Object.keys(availableSlots).map(day => (
                        <TabsTrigger key={day} value={day}>
                          {daysTranslation[day]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {Object.entries(availableSlots).map(([day, slots]) => (
                      <TabsContent key={day} value={day} className="mt-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {slots.map(slot => (
                            <Button 
                              key={slot} 
                              variant={selectedTime === slot && selectedDay === day ? "default" : "outline"}
                              className={selectedTime === slot && selectedDay === day 
                                ? "bg-primary text-white" 
                                : "hover:bg-primary hover:text-white transition-colors"}
                              onClick={() => handleTimeSelect(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Booking Summary' : 'Resumo da Reserva'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Session Type' : 'Tipo de Sessão'}:
                  </p>
                  <p className="font-medium">
                    {language === 'en' ? 'One-on-One Tutoring' : 'Tutoria Individual'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Duration' : 'Duração'}:
                  </p>
                  <p className="font-medium">60 {language === 'en' ? 'minutes' : 'minutos'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Date' : 'Data'}:
                  </p>
                  <p className="font-medium">
                    {selectedDate ? format(selectedDate, 'PPP') : (language === 'en' ? 'Not selected' : 'Não selecionado')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Day' : 'Dia'}:
                  </p>
                  <p className="font-medium">
                    {selectedDay ? daysTranslation[selectedDay] : language === 'en' ? 'Not selected' : 'Não selecionado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Time' : 'Horário'}:
                  </p>
                  <p className="font-medium">
                    {selectedTime || (language === 'en' ? 'Not selected' : 'Não selecionado')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Price' : 'Preço'}:
                  </p>
                  <p className="font-medium">$60.00</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={!selectedDay || !selectedTime || !selectedDate || isProcessing}
                  onClick={handleConfirmBooking}
                >
                  {isProcessing 
                    ? (language === 'en' ? 'Processing...' : 'Processando...') 
                    : (language === 'en' ? 'Confirm Booking & Pay' : 'Confirmar Agendamento e Pagar')
                  }
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
