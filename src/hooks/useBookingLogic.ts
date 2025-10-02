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

  // Available time slots (Monday to Saturday, 8am to 7pm, 60-min sessions)
  const timeSlots = [
    "08:00",
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
  ];

  // Load bookings from database - load ALL bookings to check for conflicts
  const loadBookings = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Load ALL bookings to check for time slot conflicts (not just current user's)
      const { data: allBookings, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading bookings:", error);
        return;
      }

      if (allBookings) {
        console.log("🔍 DEBUG: All bookings loaded:", allBookings.length);

        // Log all bookings with details
        allBookings.forEach((booking, index) => {
          console.log(`📋 Booking ${index + 1}:`, {
            id: booking.id.slice(0, 8),
            user_id: booking.user_id.slice(0, 8),
            lesson_date: booking.lesson_date,
            lesson_time: booking.lesson_time,
            status: booking.status,
            payment_status: booking.payment_status,
            service_type: booking.service_type,
            created_at: booking.created_at,
          });
        });

        // Filter for active bookings that should block time slots
        const activeBookings = allBookings.filter(
          (booking) =>
            booking.status !== "cancelled" &&
            booking.payment_status !== "refunded" &&
            // For individual lessons, block the time slot for everyone
            (booking.service_type === "individual" ||
              // For group lessons, check capacity (future enhancement)
              booking.service_type === "group")
        );

        console.log("🔍 DEBUG: Active bookings:", activeBookings.length);
        console.log(
          "🔍 DEBUG: Active bookings details:",
          activeBookings.map((b) => ({
            date: b.lesson_date,
            time: b.lesson_time,
            status: b.status,
            payment: b.payment_status,
            service: b.service_type,
          }))
        );

        setBookedSlots(activeBookings);

        // Track user's processed bookings for user-specific UI
        const userProcessedIds = new Set(
          allBookings
            .filter(
              (booking) =>
                booking.user_id === user.id &&
                booking.payment_status === "completed"
            )
            .map((booking) => booking.id)
        );
        setProcessedBookings(userProcessedIds);
      }
    } catch (error) {
      console.error("Error in loadBookings:", error);
    }
  }, [user?.id]);

  // Check if a date is available for booking (weekdays + Saturday)
  const isDateAvailable = useCallback((date: Date): boolean => {
    const today = startOfDay(new Date());
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Allow Monday (1) to Saturday (6)
    const isAvailableDay = dayOfWeek >= 1 && dayOfWeek <= 6;

    // Must be today or in the future AND be an available day
    const isFutureOrToday =
      isAfter(startOfDay(date), today) || isSameDay(startOfDay(date), today);

    return isAvailableDay && isFutureOrToday;
  }, []);

  // Check if a date is valid for single lessons (7 days to 24 hours before)
  const isSingleLessonDateValid = useCallback(
    (date: Date): { valid: boolean; reason?: string } => {
      const now = new Date();
      const selectedDate = startOfDay(date);
      const today = startOfDay(now);

      // Calculate time differences
      const hoursDifference =
        (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      const daysDifference =
        (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

      // Single lessons must be booked between 7 days and 24 hours before
      if (daysDifference > 7) {
        return {
          valid: false,
          reason:
            language === "en"
              ? "Single lessons can only be booked up to 7 days in advance."
              : "Aulas individuais só podem ser agendadas com até 7 dias de antecedência.",
        };
      }

      if (hoursDifference < 24) {
        return {
          valid: false,
          reason:
            language === "en"
              ? "Single lessons must be booked at least 24 hours in advance."
              : "Aulas individuais devem ser agendadas com pelo menos 24 horas de antecedência.",
        };
      }

      return { valid: true };
    },
    [language]
  );

  // Check if a time slot is available (enhanced for recurring bookings)
  const isTimeSlotAvailable = useCallback(
    (date: string, time: string): boolean => {
      if (!user?.id) return false;

      console.log(`🔍 Checking availability for ${date} ${time}`);
      console.log(`🔍 Total booked slots to check:`, bookedSlots.length);

      // Filter bookings for the specific date and time
      const conflictingBookings = bookedSlots.filter((booking) => {
        // Normalize time formats for comparison (remove seconds if present)
        const bookingTime = booking.lesson_time.slice(0, 5); // "17:00:00" -> "17:00"
        const searchTime = time.slice(0, 5); // "17:00" -> "17:00"

        const matches =
          booking.lesson_date === date && bookingTime === searchTime;

        if (matches) {
          console.log(`🔍 Found booking for ${date} ${time}:`, {
            id: booking.id,
            user_id: booking.user_id,
            service_type: booking.service_type,
            status: booking.status,
            payment_status: booking.payment_status,
            db_time: booking.lesson_time,
            search_time: time,
            normalized_match: `${bookingTime} === ${searchTime}`,
          });
        }
        return matches;
      });

      console.log(`🔍 Conflicting bookings found:`, conflictingBookings.length);

      // Check specifically for current user's existing booking
      const currentUserBooking = conflictingBookings.find(
        (b) => b.user_id === user.id
      );
      if (currentUserBooking) {
        console.log(`⚠️ CRITICAL: Current user already has booking:`, {
          id: currentUserBooking.id,
          date: currentUserBooking.lesson_date,
          time: currentUserBooking.lesson_time,
          status: currentUserBooking.status,
          payment_status: currentUserBooking.payment_status,
        });
      }

      // Enhanced rule: If there's ANY active booking in the time slot, it's unavailable
      // This applies to all lesson types including recurring series
      const hasAnyActiveBooking = conflictingBookings.some((booking) => {
        const isActiveBooking =
          booking.status !== "cancelled" &&
          booking.payment_status !== "refunded";

        console.log(`🔍 Checking booking:`, {
          service_type: booking.service_type,
          status: booking.status,
          payment_status: booking.payment_status,
          isActive: isActiveBooking,
        });

        return isActiveBooking;
      });

      console.log(`🔍 Has any active booking:`, hasAnyActiveBooking);

      // For recurring bookings, also check if this slot is blocked by existing recurring series
      if (
        (selectedService === "primary-school" ||
          selectedService === "secondary-school" ||
          selectedService === "a-level" ||
          selectedService === "individual") &&
        lessonType === "recurring"
      ) {
        const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const recurringConflicts = bookedSlots.filter((booking) => {
          if (booking.lesson_type !== "recurring") return false;

          const bookingDayOfWeek = new Date(booking.lesson_date).getDay();
          const bookingTime = booking.lesson_time.slice(0, 5);
          const searchTime = time.slice(0, 5);

          return (
            bookingDayOfWeek === dayOfWeek &&
            bookingTime === searchTime &&
            booking.status !== "cancelled" &&
            booking.payment_status !== "refunded"
          );
        });

        if (recurringConflicts.length > 0) {
          console.log(
            `🔄 Found recurring series blocking ${date} ${time}:`,
            recurringConflicts
          );
          return false;
        }
      }

      // Returns false if there's any active booking (slot unavailable)
      return !hasAnyActiveBooking;
    },
    [bookedSlots, user?.id, selectedService, lessonType]
  );
  // Generate available slots for a specific date
  const generateAvailableSlots = useCallback(
    (date: string): TimeSlot[] => {
      console.log(
        `🏗️ Generating slots for ${date} with ${bookedSlots.length} total bookings`
      );

      const slots = timeSlots.map((time) => {
        const available = isTimeSlotAvailable(date, time);

        // Count existing active bookings for this time slot
        const existingBookings = bookedSlots.filter((booking) => {
          return (
            booking.lesson_date === date &&
            booking.lesson_time === time &&
            booking.status !== "cancelled" &&
            booking.payment_status !== "refunded"
          );
        });

        console.log(`🏗️ Slot ${time} for ${date}:`, {
          available,
          existingBookingsCount: existingBookings.length,
          existingBookings: existingBookings.map((b) => ({
            id: b.id,
            user_id: b.user_id.slice(0, 8),
            service_type: b.service_type,
            status: b.status,
            payment_status: b.payment_status,
          })),
        });

        // Simple logic: if there's ANY active booking, slot is unavailable
        const booked = existingBookings.length;
        const capacity = 1; // Simplified - any booking blocks the slot
        const isGroup = false; // Not relevant anymore

        return {
          time,
          available,
          capacity,
          booked,
          isGroup,
        };
      });

      console.log(
        `🏗️ Final slots for ${date}:`,
        slots
          .map((s) => `${s.time}: ${s.available ? "AVAILABLE" : "BLOCKED"}`)
          .join(", ")
      );
      return slots;
    },
    [isTimeSlotAvailable, bookedSlots]
  );

  // Update available slots when date changes OR bookings change
  useEffect(() => {
    if (selectedDate && selectedDate.length > 0) {
      console.log(
        `🔄 Regenerating slots for ${selectedDate} with ${bookedSlots.length} bookings`
      );
      const slots = generateAvailableSlots(selectedDate);
      console.log(
        `🔄 Generated ${slots.length} slots:`,
        slots.map((s) => `${s.time}:${s.available}`)
      );
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, generateAvailableSlots, bookedSlots]); // Added bookedSlots dependency

  // 🆕 LISTEN FOR EXTERNAL BOOKING CHANGES (from cancellations, etc.)
  useEffect(() => {
    const handleExternalBookingChange = () => {
      console.log("📡 External booking change detected, refreshing...");
      loadBookings();
    };

    // Listen for custom events
    window.addEventListener("bookingCancelled", handleExternalBookingChange);
    window.addEventListener("bookingCreated", handleExternalBookingChange);

    return () => {
      window.removeEventListener(
        "bookingCancelled",
        handleExternalBookingChange
      );
      window.removeEventListener("bookingCreated", handleExternalBookingChange);
    };
  }, [loadBookings]);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Calculate recurring lesson dates until December 1, 2025
  const calculateRecurringDates = useCallback(
    (startDate: string, dayOfWeek: string): string[] => {
      const endDate = new Date("2025-12-01");
      const dates: string[] = [];
      const start = new Date(startDate);

      let current = new Date(start);

      while (current <= endDate) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 7); // Add 7 days for weekly recurrence
      }

      console.log(
        `📅 Calculated ${dates.length} recurring dates from ${startDate} to 2025-12-01:`,
        dates
      );
      return dates;
    },
    []
  );

  // Check if all slots in a recurring series are available
  const validateRecurringAvailability = useCallback(
    async (dates: string[], time: string) => {
      console.log(
        `🔍 Validating availability for ${dates.length} recurring slots...`
      );

      // First enforce 24-hour rule for the first lesson
      const firstLessonDate = new Date(`${dates[0]}T${time}`);
      const now = new Date();
      const twentyFourHoursFromNow = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );

      if (firstLessonDate < twentyFourHoursFromNow) {
        throw new Error(
          language === "en"
            ? "The first recurring lesson must be booked at least 24 hours in advance."
            : "A primeira aula recorrente deve ser agendada com pelo menos 24 horas de antecedência."
        );
      }

      // Check availability for each date in the series
      for (let i = 0; i < dates.length; i++) {
        const checkDate = dates[i];
        const isAvailable = isTimeSlotAvailable(checkDate, time);

        if (!isAvailable) {
          const conflictDate = format(new Date(checkDate), "dd/MM/yyyy");
          throw new Error(
            language === "en"
              ? `Conflict detected on ${conflictDate}: This time slot is already occupied. Please choose a different time or day.`
              : `Conflito detectado em ${conflictDate}: Este horário já está ocupado. Escolha um horário ou dia diferente.`
          );
        }

        console.log(
          `✅ Date ${i + 1}/${dates.length} (${checkDate}) is available`
        );
      }

      console.log(`✅ All ${dates.length} recurring slots are available!`);
      return true;
    },
    [isTimeSlotAvailable, language]
  );

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

    // Guard against double execution
    if (isProcessing) {
      console.warn(
        "⚠️ Booking confirmation already in progress, ignoring duplicate request"
      );
      return;
    }

    setIsProcessing(true);

    try {
      // For recurring lessons, validate all dates before proceeding
      if (
        (selectedService === "primary-school" ||
          selectedService === "secondary-school" ||
          selectedService === "a-level" ||
          selectedService === "individual") &&
        lessonType === "recurring"
      ) {
        console.log("🔄 Validating recurring lesson series...");

        const recurringDates = calculateRecurringDates(
          selectedDate,
          selectedDay
        );
        await validateRecurringAvailability(recurringDates, selectedTime);

        console.log("✅ All recurring slots validated successfully!");
      }

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
          error instanceof Error
            ? error.message
            : language === "en"
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
      console.log("🚀 Starting booking process");

      // Guard against double execution
      if (isProcessing) {
        console.warn(
          "⚠️ Booking already in progress, ignoring duplicate request"
        );
        return;
      }

      // Refresh booking data just before creating to get latest state
      console.log("🔄 Refreshing booking data before creation...");
      await loadBookings();

      // Wait a bit to ensure data is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Pre-validation: Check if time slot is still available before sending request
      if (!isTimeSlotAvailable(selectedDate, selectedTime)) {
        toast({
          title:
            language === "en"
              ? "Time Slot Unavailable"
              : "Horário Indisponível",
          description:
            language === "en"
              ? "This time slot is no longer available. Please select a different time."
              : "Este horário não está mais disponível. Selecione um horário diferente.",
          variant: "destructive",
        });

        // Force refresh the booking data and reset processing state
        await loadBookings();
        setIsProcessing(false);
        return;
      }

      // Calculate amount based on service and recurring nature
      let amount: number;
      let totalLessons = 1;
      let recurringDates: string[] = [];

      // Define prices for each service type (in pence)
      const servicePrices = {
        "primary-school": 2500, // 25.00
        "secondary-school": 3000, // 30.00
        "a-level": 3500, // 35.00
        individual: 30, // 0.30 (legacy)
        "exam-prep": 30, // 0.30
        group: 30, // 0.30
      };

      const servicePrice = servicePrices[selectedService] || 30;

      if (
        (selectedService === "primary-school" ||
          selectedService === "secondary-school" ||
          selectedService === "a-level" ||
          selectedService === "individual") &&
        lessonType === "recurring"
      ) {
        // Calculate recurring dates and pricing
        recurringDates = calculateRecurringDates(selectedDate, selectedDay);
        totalLessons = recurringDates.length;
        amount = servicePrice * totalLessons; // Full price per lesson × number of lessons

        console.log(
          `💰 Recurring booking TOTAL: £${
            servicePrice / 100
          } per lesson × ${totalLessons} lessons = £${amount / 100} total`
        );
      } else {
        amount = servicePrice; // Full price for single lessons
        console.log(
          `💰 Single lesson price: £${
            servicePrice / 100
          } for ${selectedService}`
        );
      }

      // Generate unique request ID for tracking
      const requestId = `booking_${user?.id}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.log(`🆔 Request ID: ${requestId}`);

      const requestData = {
        amount: amount,
        currency: "gbp",
        product_name: `Mathematics Lesson - ${selectedService}${
          lessonType === "recurring" ? " (Recurring Series)" : ""
        }`,
        booking_details: {
          date: selectedDate,
          time: selectedTime,
          day: new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          service: selectedService,
          lesson_type: lessonType || "single",
          student_email: email,
          // Add recurring-specific data
          ...(lessonType === "recurring" && {
            is_recurring: true,
            recurring_dates: recurringDates,
            total_lessons: totalLessons,
            recurring_end_date: "2025-12-01",
          }),
        },
        user_info: {
          id: user?.id,
          email: email,
        },
        request_id: requestId, // Add unique tracking ID
      };

      console.log("📤 Sending request to Edge Function:", requestData);

      // Use the existing create-payment function for all bookings
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Edge Function error:", errorData);

        // Handle specific time slot conflict errors
        if (
          errorData.error &&
          errorData.error.includes("already booked for an individual lesson")
        ) {
          await loadBookings(); // Refresh booking data
          toast({
            title:
              language === "en"
                ? "Time Slot Unavailable"
                : "Horário Indisponível",
            description:
              language === "en"
                ? "This time slot has been booked by another student. Please select a different time."
                : "Este horário foi reservado por outro aluno. Selecione um horário diferente.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        if (
          errorData.error &&
          errorData.error.includes("no longer available")
        ) {
          await loadBookings(); // Refresh booking data
          toast({
            title:
              language === "en" ? "Booking Conflict" : "Conflito de Reserva",
            description:
              language === "en"
                ? "The selected time is no longer available. Please refresh and try again."
                : "O horário selecionado não está mais disponível. Atualize e tente novamente.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        // Handle specific Stripe configuration error
        if (errorData.error === "STRIPE_SECRET_KEY not configured") {
          toast({
            title:
              language === "en"
                ? "Payment Configuration Issue"
                : "Problema de Configuração de Pagamento",
            description:
              language === "en"
                ? "Payment processing is being configured. Your booking has been noted and we'll contact you shortly."
                : "O processamento de pagamento está sendo configurado. Sua reserva foi anotada e entraremos em contato em breve.",
            variant: "default",
          });

          // For now, simulate success since the booking logic works
          toast({
            title:
              language === "en" ? "Booking Received!" : "Reserva Recebida!",
            description:
              language === "en"
                ? `Your lesson request for ${selectedDate} at ${selectedTime} has been received!`
                : `Sua solicitação de aula para ${selectedDate} às ${selectedTime} foi recebida!`,
          });

          // Reset booking state after successful test booking
          setSelectedDate(undefined);
          setSelectedTime("");
          setTermsAccepted(false);
          setCurrentStep(1);
          setIsProcessing(false);

          return;
        }

        throw new Error(errorData.error || "Payment processing failed");
      }

      const data = await response.json();
      console.log("✅ Edge Function response:", data);

      // Handle recurring booking success (new format from create-payment function)
      if (lessonType === "recurring" && data.success && data.recurring_series) {
        console.log("✅ Recurring booking series created successfully:", data);

        toast({
          title:
            language === "en"
              ? "Recurring Lessons Scheduled!"
              : "Aulas Recorrentes Agendadas!",
          description:
            language === "en"
              ? `Successfully scheduled ${data.bookings_created} recurring lessons. Payment has been processed for the entire series.`
              : `${data.bookings_created} aulas recorrentes agendadas com sucesso. Pagamento foi processado para toda a série.`,
        });

        // Refresh booking data to show new recurring series
        await loadBookings();

        // Reset booking state after successful recurring booking
        setSelectedService("");
        setLessonType("");
        setSelectedDate("");
        setSelectedTime("");
        setSelectedDay("");
        setTermsAccepted(false);
        setCurrentStep(1);
        setIsProcessing(false);

        return;
      }

      // Handle ALL bookings that need payment (including recurring)
      if (data.client_secret) {
        console.log("✅ Payment data received:", data);

        // For recurring lessons, store additional data for post-payment processing
        if (data.recurring_series) {
          console.log(
            "🔄 Storing recurring lesson data for post-payment processing"
          );
          sessionStorage.setItem(
            "pendingRecurringBooking",
            JSON.stringify({
              payment_intent_id: data.payment_intent_id,
              recurring_dates: data.recurring_dates,
              booking_details: {
                time: selectedTime,
                day: selectedDay,
                service: selectedService,
                student_email: email,
                currency: "gbp",
              },
              user_info: { id: user.id },
              amount_per_lesson: data.amount_per_lesson,
            })
          );
        }

        // Redirect to checkout page with client_secret
        console.log("✅ Redirecting to checkout with:", data.client_secret);
        window.location.href = `/checkout?client_secret=${
          data.client_secret
        }&recurring=${data.recurring_series ? "true" : "false"}`;

        toast({
          title:
            language === "en"
              ? "Redirecting to Payment..."
              : "Redirecionando para Pagamento...",
          description:
            language === "en"
              ? data.recurring_series
                ? "Please complete payment for your recurring lesson series."
                : "Please complete your payment to confirm the booking."
              : data.recurring_series
              ? "Complete o pagamento para suas aulas recorrentes."
              : "Complete o pagamento para confirmar a reserva.",
        });

        // Reset booking state after successful booking
        setSelectedDate(undefined);
        setSelectedTime("");
        setTermsAccepted(false);
        setCurrentStep(1);
        setIsProcessing(false);

        // TODO: Enable checkout redirection when Stripe is fully configured
        // const checkoutUrl = `/checkout?client_secret=${
        //   data.client_secret
        // }&booking_ids=${data.booking_ids.join(",")}`;
        // console.log("🔄 Redirecting to:", checkoutUrl);
        // window.location.href = checkoutUrl;
      } else {
        throw new Error("No client secret received");
      }
    } catch (error) {
      console.error("❌ Error processing booking:", error);
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

  // Safe date selection with validation for single lessons
  const handleDateSelect = useCallback(
    (date: string) => {
      // Check if it's a single lesson and validate the date range
      if (lessonType === "single") {
        const dateObj = new Date(date);
        const validation = isSingleLessonDateValid(dateObj);

        if (!validation.valid) {
          console.warn(
            `⚠️ Single lesson date validation failed: ${validation.reason}`
          );
          toast({
            title:
              language === "en" ? "Invalid Date Selection" : "Data Inválida",
            description: validation.reason || "",
            variant: "destructive",
          });
          return;
        }
      }

      console.log(`✅ Date ${date} selected for ${lessonType} lesson`);
      setSelectedDate(date);
      // Clear selected time when date changes
      setSelectedTime("");
    },
    [lessonType, isSingleLessonDateValid, language, toast]
  );

  // Safe time selection with availability check
  const handleTimeSelect = useCallback(
    (time: string) => {
      if (!selectedDate) {
        console.warn("⚠️ No date selected, cannot select time");
        return;
      }

      // Check if it's a single lesson and validate the date range
      if (lessonType === "single") {
        const dateObj = new Date(selectedDate);
        const validation = isSingleLessonDateValid(dateObj);

        if (!validation.valid) {
          console.warn(
            `⚠️ Single lesson date validation failed: ${validation.reason}`
          );
          toast({
            title: language === "en" ? "Invalid Date" : "Data Inválida",
            description: validation.reason || "",
            variant: "destructive",
          });
          return;
        }
      }

      const isAvailable = isTimeSlotAvailable(selectedDate, time);

      if (!isAvailable) {
        console.warn(
          `⚠️ Time slot ${time} is not available for ${selectedDate}`
        );
        toast({
          title:
            language === "en" ? "Time Unavailable" : "Horário Indisponível",
          description:
            language === "en"
              ? "This time slot is already occupied."
              : "Este horário já está ocupado.",
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ Time slot ${time} selected for ${selectedDate}`);
      setSelectedTime(time);
    },
    [
      selectedDate,
      lessonType,
      isSingleLessonDateValid,
      isTimeSlotAvailable,
      language,
      toast,
    ]
  );

  // DEBUG: Force refresh function
  const forceRefreshSlots = useCallback(async () => {
    console.log("🔄 FORCE REFRESH: Starting complete data refresh...");
    await loadBookings();

    // Force regenerate slots after a delay
    setTimeout(() => {
      if (selectedDate) {
        console.log("🔄 FORCE REFRESH: Regenerating slots...");
        const slots = generateAvailableSlots(selectedDate);
        setAvailableSlots(slots);
        console.log("🔄 FORCE REFRESH: Slots updated");
      }
    }, 1000);
  }, [loadBookings, generateAvailableSlots, selectedDate]);

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
    handleTimeSelect, // Safe time selection instead of direct setSelectedTime
    handleDateSelect, // Safe date selection with single lesson validation
    setSelectedDate, // Direct setter (use handleDateSelect for safety)
    setSelectedDay,
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
    forceRefreshSlots, // DEBUG function
    toast,
  };
};
