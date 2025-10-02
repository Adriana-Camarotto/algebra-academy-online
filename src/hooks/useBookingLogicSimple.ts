import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isSameDay, isAfter, startOfDay } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

export interface BookingData {
  id: string;
  user_id: string;
  lesson_type: string | null;
  lesson_date: string;
  lesson_time: string;
  student_email: string | null;
  created_at: string;
  payment_status: string | null;
  amount: number;
  service_type: string;
  status: string;
  lesson_day: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  capacity?: number;
  booked?: number;
  isGroup?: boolean;
}

export const useBookingLogic = () => {
  const { user, language } = useAuthStore();
  const { toast } = useToast();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [lessonType, setLessonType] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStudentEmailDialog, setShowStudentEmailDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  // Data states
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookingData[]>([]);
  const [processedBookings, setProcessedBookings] = useState<Set<string>>(
    new Set()
  );

  // Available time slots (only individual lessons)
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  // Load bookings from database
  const loadBookings = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading bookings:", error);
        return;
      }

      if (bookings) {
        setBookedSlots(bookings);
        const processedIds = new Set(
          bookings
            .filter((booking) => booking.payment_status === "completed")
            .map((booking) => booking.id)
        );
        setProcessedBookings(processedIds);
      }
    } catch (error) {
      console.error("Error in loadBookings:", error);
    }
  }, [user?.id]);

  // Check if a date is available for booking
  const isDateAvailable = useCallback((date: Date): boolean => {
    const today = startOfDay(new Date());
    return (
      isAfter(startOfDay(date), today) || isSameDay(startOfDay(date), today)
    );
  }, []);

  // Check if a time slot is available
  const isTimeSlotAvailable = useCallback(
    (date: string, time: string): boolean => {
      if (!user?.id) return false;

      // Only check for individual lesson conflicts
      const hasConflict = bookedSlots.some((booking) => {
        if (booking.lesson_date === date && booking.lesson_time === time) {
          return (
            booking.payment_status === "completed" ||
            booking.payment_status === "pending"
          );
        }
        return false;
      });

      return !hasConflict;
    },
    [bookedSlots, user?.id]
  );

  // Generate available slots for a specific date
  const generateAvailableSlots = useCallback(
    (date: string): TimeSlot[] => {
      return timeSlots.map((time) => ({
        time,
        available: isTimeSlotAvailable(date, time),
        capacity: 1,
        booked: 0,
        isGroup: false,
      }));
    },
    [isTimeSlotAvailable]
  );

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = generateAvailableSlots(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate, generateAvailableSlots]);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!user?.id || !selectedService || !selectedDate || !selectedTime) {
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Please fill in all required fields"
            : "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Check if user needs to provide student email
      if (!user.email) {
        setShowStudentEmailDialog(true);
        setIsProcessing(false);
        return;
      }

      await processBooking(user.email);
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          language === "en"
            ? "Failed to process booking. Please try again."
            : "Falha ao processar reserva. Tente novamente.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Process the actual booking
  const processBooking = async (email: string) => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          lesson_type: selectedService,
          lesson_date: selectedDate,
          lesson_time: selectedTime,
          student_email: email,
          service_type: selectedService,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment processing failed");
      }

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle student email submission
  const handleStudentEmailSubmit = async (email: string) => {
    setStudentEmail(email);
    setShowStudentEmailDialog(false);
    await processBooking(email);
  };

  // Clean optimistic updates
  const cleanOptimisticUpdates = useCallback(() => {
    // No optimistic updates to clean in this simplified version
  }, []);

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
    availableSlots,
    bookedSlots,
    processedBookings,

    // Setters
    setCurrentStep,
    setSelectedService,
    setLessonType,
    setSelectedTime,
    setSelectedDate,
    setTermsAccepted,
    setShowStudentEmailDialog,
    setStudentEmail,

    // Functions
    isDateAvailable,
    isTimeSlotAvailable,
    handleConfirmBooking,
    handleStudentEmailSubmit,
    loadBookings,
    cleanOptimisticUpdates,
    toast,
  };
};
