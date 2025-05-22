
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const BookingPage: React.FC = () => {
  const { language } = useAuthStore();

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
                ? 'Select a day and time slot that works for you.' 
                : 'Selecione um dia e horário que funcione para você.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>
                    {language === 'en' ? 'Available Time Slots' : 'Horários Disponíveis'}
                  </CardTitle>
                </div>
                <CardDescription>
                  {language === 'en' 
                    ? 'Choose your preferred day and time' 
                    : 'Escolha seu dia e horário preferido'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monday">
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
                            variant="outline" 
                            className="hover:bg-primary hover:text-white transition-colors"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
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
                    {language === 'en' ? 'Price' : 'Preço'}:
                  </p>
                  <p className="font-medium">$60.00</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled className="w-full">
                  {language === 'en' ? 'Confirm Booking' : 'Confirmar Agendamento'}
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
