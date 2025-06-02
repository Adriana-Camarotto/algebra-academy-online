import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { Clock, CreditCard, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBookingLogic } from '@/hooks/useBookingLogic';
import ProgressSteps from './booking/ProgressSteps';
import ServiceSelection from './booking/ServiceSelection';
import DateTimeSelection from './booking/DateTimeSelection';
import BookingSummary from './booking/BookingSummary';
import StudentEmailDialog from './booking/StudentEmailDialog';

interface BookingWizardProps {
  onComplete?: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete }) => {
  const { language, user } = useAuthStore();
  
  const {
    currentStep,
    selectedService,
    lessonType,
    selectedDay,
    selectedTime,
    selectedDate,
    termsAccepted,
    isProcessing,
    showStudentEmailDialog,
    studentEmail,
    groupSessionSpots,
    availableSlots,
    setCurrentStep,
    setSelectedService,
    setLessonType,
    setSelectedTime,
    setSelectedDate,
    setTermsAccepted,
    setShowStudentEmailDialog,
    setStudentEmail,
    isDateAvailable,
    isTimeSlotAvailable,
    handleConfirmBooking,
    handleStudentEmailSubmit,
    toast
  } = useBookingLogic(language, user);

  // Services data
  const services = [
    {
      id: 'individual',
      name: language === 'en' ? 'Individual Tutoring' : 'Tutoria Individual',
      description: language === 'en' 
        ? 'One-on-one personalized math tutoring sessions' 
        : 'Sessões de tutoria de matemática personalizada individual',
      price: '£0.01',
      duration: '60 min',
      icon: <Clock className="h-6 w-6" />
    },
    {
      id: 'group',
      name: language === 'en' ? 'Group Sessions' : 'Sessões em Grupo',
      description: language === 'en' 
        ? 'Small group math tutoring sessions (2-4 students) - 6 classes total' 
        : 'Sessões de tutoria de matemática em pequenos grupos (2-4 alunos) - 6 aulas no total',
      price: '£0.01',
      duration: '60 min',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'exam-prep',
      name: language === 'en' ? 'Exam Preparation' : 'Preparação para Exames',
      description: language === 'en' 
        ? 'Intensive exam preparation sessions' 
        : 'Sessões intensivas de preparação para exames',
      price: '£0.01',
      duration: '60 min',
      icon: <CreditCard className="h-6 w-6" />
    }
  ];

  const daysTranslation = {
    'monday': language === 'en' ? 'Monday' : 'Segunda',
    'tuesday': language === 'en' ? 'Tuesday' : 'Terça',
    'wednesday': language === 'en' ? 'Wednesday' : 'Quarta',
    'thursday': language === 'en' ? 'Thursday' : 'Quinta',
    'friday': language === 'en' ? 'Friday' : 'Sexta',
  };

  const steps = [
    { number: 1, title: language === 'en' ? 'Choose Service' : 'Escolher Serviço' },
    { number: 2, title: language === 'en' ? 'Date & Time' : 'Data e Horário' },
    { number: 3, title: language === 'en' ? 'Payment' : 'Pagamento' }
  ];

  const handleTimeSelect = (time: string) => {
    if (selectedDate && selectedDay && isTimeSlotAvailable(selectedDay, time, selectedDate)) {
      setSelectedTime(time);
    }
  };

  const handleTabChange = (day: string) => {
    setSelectedTime(null);
    
    if (selectedDate) {
      const dayMap = {
        1: 'monday',
        2: 'tuesday', 
        3: 'wednesday',
        4: 'thursday',
        5: 'friday'
      };
      
      const selectedWeekday = dayMap[selectedDate.getDay()];
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

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSteps steps={steps} currentStep={currentStep} />

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 1 && (
          <ServiceSelection
            language={language}
            services={services}
            selectedService={selectedService}
            lessonType={lessonType}
            onServiceSelect={handleServiceSelect}
            onLessonTypeSelect={setLessonType}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <DateTimeSelection
            language={language}
            selectedService={selectedService}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            availableSlots={availableSlots}
            daysTranslation={daysTranslation}
            groupSessionSpots={groupSessionSpots}
            onDateSelect={handleDateSelect}
            onTabChange={handleTabChange}
            onTimeSelect={handleTimeSelect}
            isDateAvailable={isDateAvailable}
            isTimeSlotAvailable={isTimeSlotAvailable}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )}

        {currentStep === 3 && (
          <BookingSummary
            language={language}
            services={services}
            selectedService={selectedService}
            lessonType={lessonType}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            termsAccepted={termsAccepted}
            isProcessing={isProcessing}
            onTermsChange={setTermsAccepted}
            onConfirmBooking={handleConfirmBooking}
            onPrevious={handlePreviousStep}
          />
        )}
      </motion.div>

      <StudentEmailDialog
        language={language}
        open={showStudentEmailDialog}
        studentEmail={studentEmail}
        onEmailChange={setStudentEmail}
        onSubmit={handleStudentEmailSubmit}
        onCancel={() => setShowStudentEmailDialog(false)}
      />
    </div>
  );
};

export default BookingWizard;
