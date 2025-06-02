
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export const useBookingLogic = (language: string, user: any) => {
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

  // Mock data for group session availability
  const groupSessionSpots = {
    'monday-9:00': { available: 2, total: 4 },
    'monday-14:00': { available: 1, total: 4 },
    'tuesday-11:00': { available: 3, total: 4 },
    'wednesday-17:00': { available: 4, total: 4 },
    'thursday-16:00': { available: 0, total: 4 },
    'friday-15:00': { available: 2, total: 4 },
  };

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

  // Check if user is a parent
  const isParentUser = (user: any): boolean => {
    console.log('Checking if user is parent:', user);
    return user && user.role === 'parent';
  };

  const processBooking = async (studentEmailForParent?: string) => {
    setIsProcessing(true);

    try {
      // Ensure user is authenticated
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('User authenticated, proceeding with booking creation');

      // Service pricing - minimum amount for Stripe
      const baseAmount = 30; // £0.30 = 30 pence (Stripe minimum for GBP)
      
      console.log('Creating booking with student email:', studentEmailForParent);
      
      // Create the booking using the edge function
      const { data: bookingData, error: bookingError } = await supabase.functions.invoke('create-booking', {
        body: {
          service_type: selectedService,
          lesson_type: lessonType,
          lesson_date: format(selectedDate!, 'yyyy-MM-dd'),
          lesson_time: selectedTime,
          lesson_day: selectedDay,
          student_email: studentEmailForParent,
          amount: baseAmount
        }
      });

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw new Error(bookingError.message || 'Erro ao criar agendamento');
      }

      if (!bookingData || !bookingData.success) {
        console.error('Booking creation failed:', bookingData);
        throw new Error(bookingData?.error || 'Erro ao criar agendamento');
      }

      console.log('Booking created successfully:', bookingData);

      toast({
        title: language === 'en' ? 'Booking Created' : 'Agendamento Criado',
        description: language === 'en' 
          ? 'Your lesson has been scheduled. Payment will be processed 24 hours before the lesson.' 
          : 'Sua aula foi agendada. O pagamento será processado 24 horas antes da aula.',
        variant: "default",
      });

      // Reset wizard state after successful booking
      setCurrentStep(1);
      setSelectedService(null);
      setLessonType(null);
      setSelectedDay(null);
      setSelectedTime(null);
      setSelectedDate(undefined);
      setTermsAccepted(false);
      setStudentEmail('');

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: language === 'en' ? 'Booking Error' : 'Erro no Agendamento',
        description: error instanceof Error 
          ? error.message 
          : (language === 'en' 
            ? 'There was an error creating your booking. Please try again.' 
            : 'Houve um erro ao criar seu agendamento. Tente novamente.'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmBooking = async () => {
    console.log('Confirm booking clicked, user:', user);
    
    // Check if user is a parent and needs to provide student email
    if (isParentUser(user)) {
      console.log('User is parent, showing student email dialog');
      setShowStudentEmailDialog(true);
      return;
    }

    console.log('User is not parent, proceeding with normal booking');
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

    console.log('Student email submitted:', studentEmail);
    setShowStudentEmailDialog(false);
    await processBooking(studentEmail);
  };

  return {
    // State
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
    bookedSlots,
    
    // Setters
    setCurrentStep,
    setSelectedService,
    setLessonType,
    setSelectedDay,
    setSelectedTime,
    setSelectedDate,
    setTermsAccepted,
    setShowStudentEmailDialog,
    setStudentEmail,
    
    // Functions
    isDateAvailable,
    isTimeSlotAvailable,
    processBooking,
    handleConfirmBooking,
    handleStudentEmailSubmit,
    toast
  };
};
