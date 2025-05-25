
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Calendar, CalendarIcon, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface BookingWizardProps {
  onComplete?: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  const { language } = useAuthStore();
  const { toast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Services data
  const services = [
    {
      id: 'individual',
      name: language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      description: language === 'en' 
        ? 'One-on-one personalized math tutoring sessions' 
        : 'Sessões de tutoria de matemática personalizada individual',
      price: '$60',
      duration: '60 min',
      icon: <Clock className="h-6 w-6" />
    },
    {
      id: 'group',
      name: language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      description: language === 'en' 
        ? 'Small group math tutoring sessions (2-4 students)' 
        : 'Sessões de tutoria de matemática em pequenos grupos (2-4 alunos)',
      price: '$40',
      duration: '90 min',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      id: 'exam-prep',
      name: language === 'en' ? 'Exam Preparation' : 'Preparação para Exames',
      description: language === 'en' 
        ? 'Intensive exam preparation sessions' 
        : 'Sessões intensivas de preparação para exames',
      price: '$80',
      duration: '90 min',
      icon: <CreditCard className="h-6 w-6" />
    }
  ];

  // Mock data for available time slots
  const availableSlots = {
    'monday': ['9:00', '10:00', '14:00', '15:00'],
    'tuesday': ['11:00', '13:00', '16:00'],
    'wednesday': ['9:00', '12:00', '17:00'],
    'thursday': ['10:00', '14:00', '16:00'],
    'friday': ['9:00', '11:00', '15:00'],
  };

  // Mock booked slots
  const bookedSlots = {
    '2025-01-27': { 'monday': ['9:00', '14:00'] },
    '2025-01-28': { 'tuesday': ['11:00'] },
    '2025-01-29': { 'wednesday': ['12:00'] },
    '2025-01-30': { 'thursday': ['10:00'] },
    '2025-01-31': { 'friday': ['15:00'] },
  };

  const daysTranslation = {
    'monday': language === 'en' ? 'Monday' : 'Segunda',
    'tuesday': language === 'en' ? 'Tuesday' : 'Terça',
    'wednesday': language === 'en' ? 'Wednesday' : 'Quarta',
    'thursday': language === 'en' ? 'Thursday' : 'Quinta',
    'friday': language === 'en' ? 'Friday' : 'Sexta',
  };

  const dayMap = {
    1: 'monday',
    2: 'tuesday', 
    3: 'wednesday',
    4: 'thursday',
    5: 'friday'
  };

  // Get weekday from date
  const getWeekdayFromDate = (date: Date): string | null => {
    const dayOfWeek = date.getDay();
    return dayMap[dayOfWeek] || null;
  };

  // Auto-select day when date changes
  useEffect(() => {
    if (selectedDate) {
      const weekday = getWeekdayFromDate(selectedDate);
      if (weekday && availableSlots[weekday]) {
        setSelectedDay(weekday);
        setSelectedTime(null);
      } else {
        setSelectedDay(null);
        setSelectedTime(null);
      }
    }
  }, [selectedDate]);

  // Filter calendar to show only available weekdays
  const isDateAvailable = (date: Date): boolean => {
    const weekday = getWeekdayFromDate(date);
    return weekday ? !!availableSlots[weekday] : false;
  };

  // Check if time slot is available (not booked)
  const isTimeSlotAvailable = (day: string, time: string, date: Date): boolean => {
    if (!date) return true;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayBookings = bookedSlots[dateStr];
    
    if (!dayBookings || !dayBookings[day]) return true;
    
    return !dayBookings[day].includes(time);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate && selectedDay && isTimeSlotAvailable(selectedDay, time, selectedDate)) {
      setSelectedTime(time);
    }
  };

  const handleTabChange = (day: string) => {
    setSelectedDay(day);
    setSelectedTime(null);
    
    if (selectedDate) {
      const selectedWeekday = getWeekdayFromDate(selectedDate);
      if (selectedWeekday !== day) {
        setSelectedDate(undefined);
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const weekday = getWeekdayFromDate(date);
      if (!weekday || !availableSlots[weekday]) {
        toast({
          title: language === 'en' ? 'Day Not Available' : 'Dia Não Disponível',
          description: language === 'en' 
            ? 'This day is not available for lessons. Please select a weekday (Monday-Friday).' 
            : 'Este dia não está disponível para aulas. Por favor, selecione um dia da semana (Segunda-Sexta).',
          variant: "destructive",
        });
        setSelectedDate(undefined);
        return;
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      toast({
        title: language === 'en' ? 'Service Required' : 'Serviço Obrigatório',
        description: language === 'en' 
          ? 'Please select a service to continue.' 
          : 'Por favor, selecione um serviço para continuar.',
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && (!selectedDay || !selectedTime || !selectedDate)) {
      toast({
        title: language === 'en' ? 'Incomplete Selection' : 'Seleção Incompleta',
        description: language === 'en' 
          ? 'Please select a date, day and time for your lesson.' 
          : 'Por favor, selecione uma data, dia e horário para sua aula.',
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!termsAccepted) {
      toast({
        title: language === 'en' ? 'Terms Required' : 'Termos Obrigatórios',
        description: language === 'en' 
          ? 'Please accept the terms and conditions to proceed.' 
          : 'Por favor, aceite os termos e condições para prosseguir.',
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: 6000, // $60.00 in cents
          currency: 'usd',
          product_name: selectedServiceData?.name || 'Math Tutoring Lesson',
          booking_details: {
            service: selectedService,
            date: format(selectedDate!, 'yyyy-MM-dd'),
            day: selectedDay,
            time: selectedTime,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
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

  const steps = [
    { number: 1, title: language === 'en' ? 'Choose Service' : 'Escolher Serviço' },
    { number: 2, title: language === 'en' ? 'Date & Time' : 'Data e Horário' },
    { number: 3, title: language === 'en' ? 'Payment' : 'Pagamento' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= step.number
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {step.number}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium",
                currentStep >= step.number ? "text-primary" : "text-gray-500"
              )}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 h-0.5 mx-4",
                  currentStep > step.number ? "bg-primary" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Choose Your Service' : 'Escolha Seu Serviço'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Select the type of tutoring service you need' 
                  : 'Selecione o tipo de serviço de tutoria que você precisa'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                      selectedService === service.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-primary mt-1">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{service.price}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? 'per session' : 'por sessão'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep} disabled={!selectedService}>
                {language === 'en' ? 'Continue' : 'Continuar'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Select Date and Time' : 'Selecionar Data e Horário'}
              </CardTitle>
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
                      onSelect={handleDateSelect}
                      disabled={(date) => 
                        date < new Date() || 
                        !isDateAvailable(date)
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Available Time Slots' : 'Horários Disponíveis'}
                </label>
                <Tabs value={selectedDay || "monday"} onValueChange={handleTabChange}>
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
                        {slots.map(slot => {
                          const isAvailable = selectedDate ? isTimeSlotAvailable(day, slot, selectedDate) : true;
                          const isSelected = selectedTime === slot && selectedDay === day;
                          
                          return (
                            <Button 
                              key={slot} 
                              variant={isSelected ? "default" : "outline"}
                              className={cn(
                                "relative",
                                isSelected && "bg-primary text-white",
                                !isAvailable && "opacity-50 cursor-not-allowed",
                                isAvailable && !isSelected && "hover:bg-primary hover:text-white transition-colors"
                              )}
                              onClick={() => handleTimeSelect(slot)}
                              disabled={!isAvailable}
                            >
                              {slot}
                              {!isAvailable && (
                                <span className="absolute inset-0 flex items-center justify-center text-xs">
                                  {language === 'en' ? 'Booked' : 'Reservado'}
                                </span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                {language === 'en' ? 'Back' : 'Voltar'}
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedDay || !selectedTime || !selectedDate}>
                {language === 'en' ? 'Continue' : 'Continuar'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Terms & Payment */}
        {currentStep === 3 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Booking Summary' : 'Resumo da Reserva'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Service' : 'Serviço'}:
                  </p>
                  <p className="font-medium">
                    {services.find(s => s.id === selectedService)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Duration' : 'Duração'}:
                  </p>
                  <p className="font-medium">{services.find(s => s.id === selectedService)?.duration}</p>
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
                  <p className="font-medium">{services.find(s => s.id === selectedService)?.price}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Terms & Payment' : 'Termos e Pagamento'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    {language === 'en' ? 'Refunds & Cancellations Policy' : 'Política de Reembolsos e Cancelamentos'}
                  </h4>
                  <div className="text-xs text-gray-600 space-y-2">
                    <p>
                      {language === 'en' 
                        ? 'Please note that refunds are not available.'
                        : 'Por favor, note que reembolsos não estão disponíveis.'}
                    </p>
                    <p>
                      {language === 'en'
                        ? 'If for any reason you are unable to attend the class then you must contact us before the class start time for the option to have it rescheduled to either of the 2 following weeks.'
                        : 'Se por qualquer motivo você não puder comparecer à aula, deve nos contatar antes do horário de início da aula para ter a opção de reagendá-la para qualquer uma das 2 semanas seguintes.'}
                    </p>
                    <p>
                      {language === 'en'
                        ? 'Only one rescheduling of an individual class pass is permitted and we will only reschedule a class like for like.'
                        : 'Apenas um reagendamento de uma aula individual é permitido e só reagendaremos uma aula igual por igual.'}
                    </p>
                    <p>
                      {language === 'en'
                        ? 'Workshops and special sessions cannot be rescheduled due to the nature of the event.'
                        : 'Workshops e sessões especiais não podem ser reagendados devido à natureza do evento.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-xs leading-relaxed">
                    {language === 'en'
                      ? 'I have read and agree to the terms above *'
                      : 'Li e concordo com os termos acima *'}
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  {language === 'en' ? 'Back' : 'Voltar'}
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={!termsAccepted || isProcessing}
                >
                  {isProcessing 
                    ? (language === 'en' ? 'Processing...' : 'Processando...') 
                    : (language === 'en' ? 'Confirm Booking & Pay' : 'Confirmar Agendamento e Pagar')
                  }
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingWizard;
