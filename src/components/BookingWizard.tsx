
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Calendar, CalendarIcon, Clock, CreditCard, CheckCircle, Repeat, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface BookingWizardProps {
  onComplete?: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState<'single' | 'recurring' | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Parent booking state
  const [showStudentEmailDialog, setShowStudentEmailDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');

  // Mock data for group session availability (6 classes per session)
  const groupSessionSpots = {
    'monday-9:00': { available: 2, total: 4 },
    'monday-14:00': { available: 1, total: 4 },
    'tuesday-11:00': { available: 3, total: 4 },
    'wednesday-17:00': { available: 4, total: 4 },
    'thursday-16:00': { available: 0, total: 4 },
    'friday-15:00': { available: 2, total: 4 },
  };

  // Services data - updated durations to 60 minutes
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
        ? 'Small group math tutoring sessions (2-4 students) - 6 classes total' 
        : 'Sessões de tutoria de matemática em pequenos grupos (2-4 alunos) - 6 aulas no total',
      price: '$40',
      duration: '60 min',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'exam-prep',
      name: language === 'en' ? 'Exam Preparation' : 'Preparação para Exames',
      description: language === 'en' 
        ? 'Intensive exam preparation sessions' 
        : 'Sessões intensivas de preparação para exames',
      price: '$80',
      duration: '60 min',
      icon: <CreditCard className="h-6 w-6" />
    }
  ];

  // Available time slots
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
    '2025-02-03': { 'monday': ['10:00'] },
    '2025-02-04': { 'tuesday': ['13:00', '16:00'] },
    '2025-02-05': { 'wednesday': ['9:00'] },
    '2025-02-06': { 'thursday': ['14:00'] },
    '2025-02-07': { 'friday': ['11:00'] },
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

  // Check if date has any available slots
  const hasAvailableSlots = (date: Date): boolean => {
    const weekday = getWeekdayFromDate(date);
    if (!weekday || !availableSlots[weekday]) return false;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayBookings = bookedSlots[dateStr];
    
    if (!dayBookings || !dayBookings[weekday]) return true;
    
    return availableSlots[weekday].some(slot => !dayBookings[weekday].includes(slot));
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

  // Filter calendar to show only dates with available slots
  const isDateAvailable = (date: Date): boolean => {
    if (date < startOfDay(new Date())) return false;
    return hasAvailableSlots(date);
  };

  // Check if time slot is available
  const isTimeSlotAvailable = (day: string, time: string, date: Date): boolean => {
    if (!date) return true;
    
    // For group sessions, check if there are available spots
    if (selectedService === 'group') {
      const slotKey = `${day}-${time}`;
      const spotInfo = groupSessionSpots[slotKey];
      if (spotInfo && spotInfo.available === 0) return false;
    }
    
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
    if (!date) {
      setSelectedDate(undefined);
      return;
    }

    if (!isDateAvailable(date)) {
      toast({
        title: language === 'en' ? 'Date Not Available' : 'Data Não Disponível',
        description: language === 'en' 
          ? 'This date has no available time slots. Please select a different date.' 
          : 'Esta data não tem horários disponíveis. Por favor, selecione uma data diferente.',
        variant: "destructive",
      });
      return;
    }

    setSelectedDate(date);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setLessonType(null);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!selectedService || (selectedService === 'individual' && !lessonType))) {
      toast({
        title: language === 'en' ? 'Selection Required' : 'Seleção Obrigatória',
        description: language === 'en' 
          ? 'Please select a service and lesson type to continue.' 
          : 'Por favor, selecione um serviço e tipo de aula para continuar.',
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

    // Check if user is a parent and needs to provide student email
    if (user?.role === 'parent') {
      setShowStudentEmailDialog(true);
      return;
    }

    await processBooking();
  };

  const handleStudentEmailSubmit = async () => {
    if (!studentEmail.trim()) {
      toast({
        title: language === 'en' ? 'Email Required' : 'Email Obrigatório',
        description: language === 'en' 
          ? 'Please enter the student\'s email address.' 
          : 'Por favor, insira o endereço de email do aluno.',
        variant: "destructive",
      });
      return;
    }

    setShowStudentEmailDialog(false);
    await processBooking(studentEmail);
  };

  const processBooking = async (studentEmailForParent?: string) => {
    setIsProcessing(true);

    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      const baseAmount = selectedService === 'individual' ? 6000 : selectedService === 'group' ? 4000 : 8000;
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: baseAmount,
          currency: 'usd',
          product_name: selectedServiceData?.name || 'Math Tutoring Lesson',
          booking_details: {
            service: selectedService,
            lesson_type: lessonType,
            date: format(selectedDate!, 'yyyy-MM-dd'),
            day: selectedDay,
            time: selectedTime,
            student_email: studentEmailForParent,
            booked_by_parent: !!studentEmailForParent,
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
                  <div key={service.id}>
                    <div
                      onClick={() => handleServiceSelect(service.id)}
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

                    {/* Lesson Type Selection for Individual Tutoring */}
                    {selectedService === 'individual' && service.id === 'individual' && (
                      <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Repeat className="h-4 w-4" />
                          {language === 'en' ? 'Lesson Type' : 'Tipo de Aula'}
                        </h4>
                        <div className="space-y-2">
                          <div
                            onClick={() => setLessonType('single')}
                            className={cn(
                              "p-3 border rounded cursor-pointer transition-all",
                              lessonType === 'single'
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="font-medium">
                              {language === 'en' ? 'Single Lesson' : 'Aula Única'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {language === 'en' 
                                ? 'One-time lesson with immediate payment' 
                                : 'Aula única com pagamento imediato'}
                            </div>
                          </div>
                          <div
                            onClick={() => setLessonType('recurring')}
                            className={cn(
                              "p-3 border rounded cursor-pointer transition-all",
                              lessonType === 'recurring'
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="font-medium">
                              {language === 'en' ? 'Recurring Lessons' : 'Aulas Recorrentes'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {language === 'en' 
                                ? 'Weekly lessons on the same day and time. First payment now, subsequent payments automatic.' 
                                : 'Aulas semanais no mesmo dia e horário. Primeiro pagamento agora, pagamentos seguintes automáticos.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleNextStep} 
                disabled={!selectedService || (selectedService === 'individual' && !lessonType)}
              >
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
                  ? 'Choose your preferred date and time. Only dates with available slots are shown.' 
                  : 'Escolha sua data e horário preferido. Apenas datas com horários disponíveis são mostradas.'}
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
                      disabled={(date) => !isDateAvailable(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      modifiers={{
                        available: (date) => isDateAvailable(date)
                      }}
                      modifiersStyles={{
                        available: { 
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          borderColor: 'rgb(34, 197, 94)',
                          color: 'rgb(34, 197, 94)'
                        }
                      }}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {slots.map(slot => {
                          const isAvailable = selectedDate ? isTimeSlotAvailable(day, slot, selectedDate) : true;
                          const isSelected = selectedTime === slot && selectedDay === day;
                          const slotKey = `${day}-${slot}`;
                          const spotInfo = selectedService === 'group' ? groupSessionSpots[slotKey] : null;
                          
                          return (
                            <div key={slot} className="relative">
                              <Button 
                                variant={isSelected ? "default" : "outline"}
                                className={cn(
                                  "w-full h-auto p-3 flex flex-col items-center gap-1",
                                  isSelected && "bg-primary text-white",
                                  !isAvailable && "opacity-50 cursor-not-allowed bg-red-100 text-red-600 border-red-200",
                                  isAvailable && !isSelected && "hover:bg-primary hover:text-white transition-colors"
                                )}
                                onClick={() => handleTimeSelect(slot)}
                                disabled={!isAvailable}
                              >
                                <span className="font-medium">{slot}</span>
                                {selectedService === 'group' && spotInfo && (
                                  <span className={cn(
                                    "text-xs",
                                    spotInfo.available === 0 ? "text-red-600" : "text-green-600"
                                  )}>
                                    {spotInfo.available}/{spotInfo.total} {language === 'en' ? 'spots' : 'vagas'}
                                  </span>
                                )}
                                {!isAvailable && (
                                  <span className="text-xs">
                                    {language === 'en' ? 'Booked' : 'Reservado'}
                                  </span>
                                )}
                              </Button>
                            </div>
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
                  {selectedService === 'group' && (
                    <p className="text-xs text-blue-600">
                      {language === 'en' ? '6 classes total, 60 minutes each' : '6 aulas no total, 60 minutos cada'}
                    </p>
                  )}
                </div>
                {selectedService === 'individual' && lessonType && (
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Lesson Type' : 'Tipo de Aula'}:
                    </p>
                    <p className="font-medium">
                      {lessonType === 'single' 
                        ? (language === 'en' ? 'Single Lesson' : 'Aula Única')
                        : (language === 'en' ? 'Recurring Lessons' : 'Aulas Recorrentes')}
                    </p>
                  </div>
                )}
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
                  {lessonType === 'recurring' && (
                    <p className="text-xs text-amber-600">
                      {language === 'en' 
                        ? 'First payment now, then weekly automatically'
                        : 'Primeiro pagamento agora, depois semanalmente automaticamente'}
                    </p>
                  )}
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

      {/* Student Email Dialog for Parents */}
      <Dialog open={showStudentEmailDialog} onOpenChange={setShowStudentEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Student Information' : 'Informações do Aluno'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {language === 'en'
                ? 'Since you are booking as a parent, please provide the student\'s email address. This must match the email the student used to register.'
                : 'Como você está fazendo a reserva como responsável, forneça o endereço de email do aluno. Este deve corresponder ao email que o aluno usou para se registrar.'}
            </p>
            <div>
              <Label htmlFor="student-email">
                {language === 'en' ? 'Student Email' : 'Email do Aluno'}
              </Label>
              <Input
                id="student-email"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder={language === 'en' ? 'student@example.com' : 'aluno@exemplo.com'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudentEmailDialog(false)}>
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </Button>
            <Button onClick={handleStudentEmailSubmit}>
              {language === 'en' ? 'Continue' : 'Continuar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingWizard;
