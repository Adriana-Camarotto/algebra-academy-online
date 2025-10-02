import React from "react";
import { useAuthStore } from "@/lib/auth";
import { Clock, CreditCard, Users, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingLogic } from "@/hooks/useBookingLogic";
import { cn } from "@/lib/utils";
import ProgressSteps from "./booking/ProgressSteps";
import ServiceSelection from "./booking/ServiceSelection";
import DateTimeSelection from "./booking/DateTimeSelection";
import BookingSummary from "./booking/BookingSummary";
import StudentEmailDialog from "./booking/StudentEmailDialog";

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
    availableSlots,
    bookedSlots,
    processedBookings,
    setCurrentStep,
    setSelectedService,
    setLessonType,
    handleTimeSelect,
    handleDateSelect,
    setSelectedDate,
    setSelectedDay,
    setTermsAccepted,
    setShowStudentEmailDialog,
    setStudentEmail,
    isDateAvailable,
    isTimeSlotAvailable,
    handleConfirmBooking,
    handleStudentEmailSubmit,
    forceRefreshSlots, // Add debug function
    loadBookings,
    cleanOptimisticUpdates,
    toast,
  } = useBookingLogic();

  // Add periodic refresh when on step 2 (date/time selection)
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentStep === 2) {
      // Refresh booking data every 10 seconds when on step 2
      intervalId = setInterval(() => {
        console.log("Periodic refresh of booking data");
        loadBookings();
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentStep, loadBookings]);

  // 🆕 LISTEN FOR BOOKING CANCELLATIONS
  React.useEffect(() => {
    const handleBookingCancelled = (event: CustomEvent) => {
      console.log(
        "📡 Booking cancellation detected in calendar:",
        event.detail
      );

      // Force immediate refresh of booking data
      setTimeout(() => {
        console.log("🔄 Forcing calendar refresh after cancellation...");
        loadBookings();
      }, 1000);

      toast({
        title: "Calendar Updated",
        description: `Time slot ${event.detail.time} on ${event.detail.date} is now available again.`,
        variant: "default",
      });
    };

    // Listen for cancellation events
    window.addEventListener(
      "bookingCancelled",
      handleBookingCancelled as EventListener
    );

    // Also check localStorage on mount for recent cancellations
    const lastCancellation = localStorage.getItem("lastBookingCancellation");
    if (lastCancellation) {
      const cancellationData = JSON.parse(lastCancellation);
      const now = Date.now();
      const timeSinceCancel = now - cancellationData.timestamp;

      // If cancellation was within last 30 seconds, refresh calendar
      if (timeSinceCancel < 30000) {
        console.log(
          "🔄 Recent cancellation detected on mount, refreshing calendar..."
        );
        setTimeout(() => loadBookings(), 500);
      } else if (timeSinceCancel > 300000) {
        // Clean up old cancellation data (older than 5 minutes)
        localStorage.removeItem("lastBookingCancellation");
        console.log("🧹 Cleaned up old cancellation data");
      }
    }

    return () => {
      window.removeEventListener(
        "bookingCancelled",
        handleBookingCancelled as EventListener
      );
    };
  }, [loadBookings, toast]);

  // Services data - Three independent tutoring services with full functionality
  const services = [
    {
      id: "primary-school",
      name: language === "en" ? "Primary School" : "Escola Primária",
      description:
        language === "en"
          ? "One-to-one personalised mathematics tutoring sessions for primary school students"
          : "Sessões de tutoria de matemática personalizada individual para alunos do ensino primário",
      price: "£25.00",
      duration: "60 min",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      id: "secondary-school",
      name:
        language === "en"
          ? "Secondary School (including GCSE preparation)"
          : "Escola Secundária (incluindo preparação para GCSE)",
      description:
        language === "en"
          ? "One-to-one personalised mathematics tutoring sessions for secondary school students including GCSE preparation"
          : "Sessões de tutoria de matemática personalizada individual para alunos do ensino secundário incluindo preparação para GCSE",
      price: "£30.00",
      duration: "60 min",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      id: "a-level",
      name: language === "en" ? "A-level" : "A-level",
      description:
        language === "en"
          ? "One-to-one personalised mathematics tutoring sessions for A-level students"
          : "Sessões de tutoria de matemática personalizada individual para alunos do A-level",
      price: "£35.00",
      duration: "60 min",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      id: "exam-prep",
      name:
        language === "en"
          ? "GCSE & A-Level Preparation"
          : "Preparação para Exames",
      description:
        language === "en"
          ? "Intensive GCSE Retakes sessions"
          : "Sessões intensivas de preparação para exames",
      price: "£0.30",
      duration: "60 min",
      icon: <CreditCard className="h-6 w-6" />,
    },
  ];

  const daysTranslation = {
    monday: language === "en" ? "Monday" : "Segunda",
    tuesday: language === "en" ? "Tuesday" : "Terça",
    wednesday: language === "en" ? "Wednesday" : "Quarta",
    thursday: language === "en" ? "Thursday" : "Quinta",
    friday: language === "en" ? "Friday" : "Sexta",
    saturday: language === "en" ? "Saturday" : "Sábado",
  };

  const steps = [
    {
      number: 1,
      title: language === "en" ? "Choose Service" : "Escolher Serviço",
    },
    { number: 2, title: language === "en" ? "Date & Time" : "Data e Horário" },
    { number: 3, title: language === "en" ? "Payment" : "Pagamento" },
  ];

  // Use the safe time selection from the hook directly
  // (handleTimeSelect is already available from the hook)

  const handleTabChange = (day: string) => {
    handleTimeSelect(""); // Use hook function for safe clearing

    if (selectedDate) {
      const dayMap = {
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      };

      const selectedWeekday = dayMap[new Date(selectedDate).getDay()];
      if (selectedWeekday !== day) {
        setSelectedDate("");
      }
    }
  };

  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate("");
      handleTimeSelect(""); // Use hook function for safe clearing
      setSelectedDay("");
      return;
    }

    if (!isDateAvailable(date)) {
      toast({
        title: language === "en" ? "Date Not Available" : "Data Não Disponível",
        description:
          language === "en"
            ? "This date has no available time slots. Please select a different date."
            : "Esta data não tem horários disponíveis. Por favor, selecione uma data diferente.",
        variant: "destructive",
      });
      return;
    }

    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Set selectedDay based on the day of the week
    const dayOfWeek = date.getDay();
    const dayMap = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    const selectedWeekday = dayMap[dayOfWeek];

    console.log("Selected date:", date, "Formatted:", formattedDate);
    handleDateSelect(formattedDate);
    setSelectedDay(selectedWeekday || "");
    // Reset time when date changes - use hook function for safe clearing
    if (selectedTime) {
      handleTimeSelect(""); // Use hook function for safe clearing
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setLessonType(""); // Use empty string instead of null
  };

  const handleNextStep = () => {
    if (
      currentStep === 1 &&
      (!selectedService ||
        ((selectedService === "primary-school" ||
          selectedService === "secondary-school" ||
          selectedService === "a-level" ||
          selectedService === "individual") &&
          !lessonType))
    ) {
      toast({
        title: language === "en" ? "Selection Required" : "Seleção Obrigatória",
        description:
          language === "en"
            ? "Please select a service and lesson type to continue."
            : "Por favor, selecione um serviço e tipo de aula para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && (!selectedDay || !selectedTime || !selectedDate)) {
      toast({
        title:
          language === "en" ? "Incomplete Selection" : "Seleção Incompleta",
        description:
          language === "en"
            ? "Please select a date, day and time for your lesson."
            : "Por favor, selecione uma data, dia e horário para sua aula.",
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
            lessonType={lessonType as "single" | "recurring"}
            onServiceSelect={handleServiceSelect}
            onLessonTypeSelect={setLessonType}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="border-2 border-tutor-accent bg-gradient-to-r from-green-50 to-tutor-accent/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start mb-3">
                      <MessageCircle className="h-8 w-8 text-tutor-accent mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        {language === "en" ? "Free Trial Lesson" : "Aula teste"}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {language === "en"
                        ? "Experience our teaching method with a complimentary 15-minute session"
                        : "Experimente nosso método de ensino com uma sessão gratuita de 15 minutos"}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-tutor-accent rounded-full mr-2"></span>
                        {language === "en" ? "15 minutes" : "15 minutos"}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-tutor-accent rounded-full mr-2"></span>
                        {language === "en"
                          ? "Completely free"
                          : "Completamente grátis"}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-tutor-accent rounded-full mr-2"></span>
                        {language === "en"
                          ? "WhatsApp booking"
                          : "Agendamento via WhatsApp"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-tutor-accent mb-2">
                      {language === "en" ? "FREE" : "GRÁTIS"}
                    </div>
                    <a
                      href={`https://wa.me/447592156251?text=${encodeURIComponent(
                        language === "en"
                          ? "Hello! I would like to schedule a free 15-minute trial lesson."
                          : "Olá! Quero agendar uma aula de teste gratuita de 15min."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-tutor-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {language === "en"
                        ? "Book via WhatsApp"
                        : "Agendar via WhatsApp"}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <div>
            {/* Debug button - temporary */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                🔧 Debug: Click to reload booking data if slots appear available
                but aren't working
              </p>
              <div className="flex gap-2 items-center mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Manual reload triggered");
                    loadBookings(); // Force refresh
                    toast({
                      title: "Data Reloaded",
                      description:
                        "Booking data has been refreshed from database",
                      variant: "default",
                    });
                  }}
                >
                  🔄 Reload Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Manual cleanup triggered");
                    cleanOptimisticUpdates();
                    toast({
                      title: "Cache Cleared",
                      description: "Old optimistic updates have been cleared",
                      variant: "default",
                    });
                  }}
                >
                  🧹 Clear Cache
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("🔄 Force Calendar Refresh triggered");
                    // Simulate cancellation event to test system
                    const testEvent = {
                      timestamp: Date.now(),
                      bookingId: "test-booking",
                      date: selectedDate,
                      time: selectedTime,
                      action: "test-refresh",
                    };
                    localStorage.setItem(
                      "lastBookingCancellation",
                      JSON.stringify(testEvent)
                    );
                    window.dispatchEvent(
                      new CustomEvent("bookingCancelled", {
                        detail: testEvent,
                      })
                    );
                    toast({
                      title: "Calendar Refresh Forced",
                      description:
                        "Simulated cancellation event to refresh calendar",
                      variant: "default",
                    });
                  }}
                >
                  🧪 Test Refresh
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Current booked slots: {JSON.stringify(Object.keys(bookedSlots))}
              </p>
              <p className="text-xs text-blue-600">
                Processing slots:{" "}
                {JSON.stringify(Array.from(processedBookings))}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedService} |{" "}
                {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "No date"}{" "}
                | {selectedDay} | {selectedTime}
              </p>
              {selectedDate && (
                <div className="text-xs text-purple-600 mt-2 p-2 bg-purple-50 rounded">
                  <strong>
                    Bookings for {format(selectedDate, "yyyy-MM-dd")}:
                  </strong>
                  <pre className="mt-1 text-xs">
                    {JSON.stringify(
                      bookedSlots[format(selectedDate, "yyyy-MM-dd")] || "none",
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>

            <DateTimeSelection
              language={language}
              selectedService={selectedService}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              selectedDate={selectedDate ? new Date(selectedDate) : undefined}
              availableSlots={availableSlots}
              daysTranslation={daysTranslation}
              bookedSlots={bookedSlots}
              onDateSelect={handleCalendarDateSelect}
              onTabChange={handleTabChange}
              onTimeSelect={handleTimeSelect}
              isDateAvailable={isDateAvailable}
              isTimeSlotAvailable={isTimeSlotAvailable}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          </div>
        )}

        {currentStep === 3 && (
          <BookingSummary
            language={language}
            services={services}
            selectedService={selectedService}
            lessonType={lessonType as "single" | "recurring"}
            selectedDate={selectedDate ? new Date(selectedDate) : new Date()}
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
        onSubmit={() => handleStudentEmailSubmit(studentEmail)}
        onCancel={() => setShowStudentEmailDialog(false)}
      />

      {/* Debug/Admin Panel - Only show in development or for testing */}
      {currentStep === 2 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              🔧 Debug Panel
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadBookings()}
              className="text-xs"
            >
              🔄 Force Refresh
            </Button>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>📊 Total bookings loaded: {bookedSlots.length} bookings</div>
            <div>
              📅 Unique dates:{" "}
              {new Set(bookedSlots.map((b) => b.lesson_date)).size} dates
            </div>
            <div>🔒 User's processed: {processedBookings.size} slots</div>
            <div>⏰ Last update: {new Date().toLocaleTimeString()}</div>
            {selectedDate && selectedTime && (
              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="font-medium text-yellow-800">
                  Current Selection Check:
                </div>
                <div>
                  📍 Date: {selectedDate}, Time: {selectedTime}
                </div>
                <div>🎯 Service: {selectedService}</div>
                <div className="text-xs text-blue-700 font-medium mt-1">
                  🔒 New Rule: ANY existing booking blocks the time slot
                  (regardless of lesson type)
                </div>
                {(() => {
                  const conflicting = bookedSlots.filter(
                    (b) =>
                      b.lesson_date === selectedDate &&
                      b.lesson_time === selectedTime &&
                      b.status !== "cancelled" &&
                      b.payment_status !== "refunded"
                  );
                  const isBlocked = conflicting.length > 0;
                  return (
                    <div>
                      <div
                        className={cn(
                          "font-medium",
                          isBlocked ? "text-red-600" : "text-green-600"
                        )}
                      >
                        {isBlocked
                          ? `❌ BLOCKED: ${conflicting.length} active booking(s)`
                          : "✅ AVAILABLE: No conflicts"}
                      </div>
                      {conflicting.length > 0 && (
                        <div className="mt-1">
                          {conflicting.map((b, i) => (
                            <div key={i} className="text-xs text-red-700">
                              • {b.service_type} lesson by user{" "}
                              {b.user_id.slice(0, 8)}
                              ... ({b.status}/{b.payment_status})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
