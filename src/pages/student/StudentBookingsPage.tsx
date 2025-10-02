import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Calendar,
  Clock,
  PoundSterling,
  Repeat,
  RefreshCw,
  Info,
  Users,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, isBefore } from "date-fns";
import {
  canGetRefund,
  shouldProcessPayment,
  getTimeUntilPayment,
  PaymentStatus,
  formatCurrency,
  requestRefund,
  getRefundTimingMessages,
} from "@/utils/paymentUtils";

interface Booking {
  id: string;
  service_type: string;
  lesson_type: string | null;
  lesson_date: string;
  lesson_time: string;
  lesson_day: string;
  payment_status: string;
  status: string;
  amount: number;
  currency: string;
  can_cancel_until: string;
  student_email: string | null;
  created_at: string;
  group_session_number?: number | null;
  group_session_total?: number | null;
  group_session_id?: string | null;
  // New fields for recurring individual lessons
  recurring_session_number?: number | null;
  recurring_session_total?: number | null;
  recurring_session_id?: string | null;
}

const StudentBookingsPage = () => {
  const { language, user } = useAuthStore();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Load bookings from database
  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's bookings
      const { data: userBookings, error: userError } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("lesson_date", { ascending: false });

      if (userError) {
        console.error("Error loading user bookings:", userError);
        toast({
          title: language === "en" ? "Error" : "Erro",
          description:
            language === "en"
              ? "Failed to load bookings"
              : "Falha ao carregar agendamentos",
          variant: "destructive",
        });
        return;
      }

      console.log("🔍 DEBUG: Raw bookings from database:", userBookings);
      console.log(
        "🔍 DEBUG: Group bookings:",
        userBookings?.filter((b) => b.service_type === "group")
      );

      // Process bookings to expand group sessions and recurring individual lessons
      const processedBookings =
        userBookings?.flatMap((booking) => {
          // If it's a group session with high amount (£6.00 = 600 pence),
          // it means it's an old booking that needs to be split into individual cards
          if (booking.service_type === "group" && booking.amount >= 600) {
            console.log(
              "🔄 Found old group booking with total amount, splitting into individual sessions:",
              booking
            );

            // Create 6 individual session cards
            const sessions = [];
            const baseDate = new Date(booking.lesson_date);

            for (let i = 0; i < 6; i++) {
              const sessionDate = new Date(baseDate);
              sessionDate.setDate(baseDate.getDate() + i * 7); // Weekly sessions

              sessions.push({
                ...booking,
                id: `${booking.id}_session_${i + 1}`, // Unique ID for each session
                lesson_date: sessionDate.toISOString().split("T")[0],
                amount: 100, // £1.00 per session (100 pence) - adjusted for visibility
                group_session_number: i + 1,
                group_session_total: 6,
                group_session_id: `group_${booking.id}`,
              });
            }

            console.log("✅ Created individual session cards:", sessions);
            return sessions;
          }

          // Handle recurring lessons - they come as individual booking records already
          if (
            booking.service_type === "individual" &&
            booking.lesson_type === "recurring" &&
            booking.recurring_session_number &&
            booking.recurring_session_total &&
            booking.recurring_session_id
          ) {
            console.log(
              "🔄 Found recurring lesson booking (already individual record):",
              booking
            );

            // The booking is already an individual record in the recurring series
            // Just ensure it has the correct display properties
            return [
              {
                ...booking,
                lesson_type: "recurring", // Keep original lesson type for proper display
              },
            ];
          }

          // Legacy: If it's an old-style recurring lesson with high amount, split into individual cards
          if (
            (booking.service_type === "individual" ||
              booking.service_type === "primary-school" ||
              booking.service_type === "secondary-school" ||
              booking.service_type === "a-level") &&
            booking.lesson_type === "recurring" &&
            booking.amount >= 60 && // Multiple lessons paid upfront (at least 2 lessons minimum)
            !booking.recurring_session_number // Not already split
          ) {
            console.log(
              "🔄 Found legacy recurring lesson with total amount, splitting into individual sessions:",
              booking
            );

            // Determine price per lesson based on service type
            const servicePrices = {
              "primary-school": 2500, // 25.00
              "secondary-school": 3000, // 30.00
              "a-level": 3500, // 35.00
              individual: 30, // 0.30 (legacy)
            };

            const pricePerLesson = servicePrices[booking.service_type] || 30;

            // Calculate how many lessons based on amount and service type
            const lessonsCount =
              Math.floor(booking.amount / pricePerLesson) || 1;
            const amountPerLesson = Math.floor(booking.amount / lessonsCount);

            const sessions = [];
            const baseDate = new Date(booking.lesson_date);

            for (let i = 0; i < lessonsCount; i++) {
              const sessionDate = new Date(baseDate);
              sessionDate.setDate(baseDate.getDate() + i * 7); // Weekly sessions

              sessions.push({
                ...booking,
                id: `${booking.id}_recurring_${i + 1}`, // Unique ID for each session
                lesson_date: sessionDate.toISOString().split("T")[0],
                amount: amountPerLesson, // Amount per individual lesson
                recurring_session_number: i + 1,
                recurring_session_total: lessonsCount,
                recurring_session_id: `recurring_${booking.id}`,
                lesson_type: "recurring", // Mark as recurring session
              });
            }

            console.log(
              "✅ Created individual recurring lesson cards:",
              sessions
            );
            return sessions;
          }

          // Return the booking as-is for other types or properly structured sessions
          return [booking];
        }) || [];

      console.log("🔍 DEBUG: Processed bookings:", processedBookings);

      // Debug: Log recurring lesson details
      const recurringBookings = processedBookings.filter(
        (b) => b.lesson_type === "recurring"
      );
      if (recurringBookings.length > 0) {
        console.log("🔄 DEBUG: ALL Recurring lessons from database:");
        recurringBookings
          .sort(
            (a, b) => a.recurring_session_number - b.recurring_session_number
          )
          .forEach((booking, index) => {
            console.log(
              `${index + 1}. Session ${booking.recurring_session_number}/${
                booking.recurring_session_total
              } - ${booking.lesson_date} - Status: ${
                booking.status
              } - Payment: ${booking.payment_status}`
            );
          });

        console.log("🔄 CHECKING for missing sessions:");
        const maxSession = Math.max(
          ...recurringBookings.map((b) => b.recurring_session_number)
        );
        for (let i = 1; i <= maxSession; i++) {
          const sessionExists = recurringBookings.find(
            (b) => b.recurring_session_number === i
          );
          if (!sessionExists) {
            console.log(`❌ MISSING: Session ${i}/${maxSession}`);
          }
        }
      }

      // TEMPORARY: Add visual debug info to the page
      if (recurringBookings.length > 0) {
        console.log("🚨 RECURRING BOOKINGS DEBUG:");
        recurringBookings.forEach((booking, index) => {
          console.log(
            `${index + 1}. ID: ${booking.id?.slice(-8)}, Session: ${
              booking.recurring_session_number
            }/${booking.recurring_session_total}, Date: ${
              booking.lesson_date
            }, Series: ${booking.recurring_session_id?.slice(-8)}`
          );
        });
      }

      // SIMPLIFIED sorting - focus only on recurring lessons
      const sortedBookings = processedBookings.sort((a, b) => {
        // If both are recurring lessons with session numbers, sort by session number FIRST
        if (
          a.lesson_type === "recurring" &&
          b.lesson_type === "recurring" &&
          a.recurring_session_number &&
          b.recurring_session_number
        ) {
          // For same series, always sort by session number
          if (a.recurring_session_id === b.recurring_session_id) {
            return a.recurring_session_number - b.recurring_session_number;
          }

          // Different series - still prioritize session number over date for consistency
          return a.recurring_session_number - b.recurring_session_number;
        }

        // Default: sort by date (newest first)
        const dateA = new Date(a.lesson_date);
        const dateB = new Date(b.lesson_date);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(
        "✅ Sorted bookings (recurring lessons in ascending order):",
        sortedBookings
      );

      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "en"
      ? format(date, "MMM dd, yyyy")
      : format(date, "dd/MM/yyyy");
  };

  // Get service name (enhanced for recurring lessons)
  const getServiceName = (serviceType: string, lessonType?: string) => {
    const services = {
      "primary-school":
        language === "en" ? "Primary School" : "Escola Primária",
      "secondary-school":
        language === "en"
          ? "Secondary School (including GCSE preparation)"
          : "Escola Secundária (incluindo preparação para GCSE)",
      "a-level": language === "en" ? "A-level" : "A-level",
      individual:
        language === "en" ? "Individual Tutoring" : "Tutoria Individual",
      group: language === "en" ? "Group Sessions" : "Sessões em Grupo",
      "exam-prep":
        language === "en"
          ? "GCSE & A-Level Preparation"
          : "Preparação para Exames",
    };

    if (serviceType === "individual" && lessonType === "recurring") {
      return language === "en"
        ? "Recurring Individual Tutoring"
        : "Tutoria Individual Recorrente";
    }

    if (
      (serviceType === "primary-school" ||
        serviceType === "secondary-school" ||
        serviceType === "a-level") &&
      lessonType === "recurring"
    ) {
      const serviceName = services[serviceType] || serviceType;
      return language === "en"
        ? `Recurring ${serviceName}`
        : `${serviceName} Recorrente`;
    }

    return services[serviceType] || serviceType;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return language === "en" ? "Paid" : "Pago";
      case "pending":
        return language === "en" ? "Payment Pending" : "Pagamento Pendente";
      case "processing":
        return language === "en"
          ? "Processing Payment"
          : "Processando Pagamento";
      case "cancelled":
        return language === "en" ? "Cancelled" : "Cancelado";
      case "failed":
        return language === "en" ? "Failed" : "Falhou";
      case "refunded":
        return language === "en" ? "Refunded" : "Reembolsado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return language === "en" ? "Scheduled" : "Agendada";
      case "cancelled":
        return language === "en" ? "Cancelled" : "Cancelada";
      case "completed":
        return language === "en" ? "Completed" : "Concluída";
      case "confirmed":
        return language === "en" ? "Confirmed" : "Confirmada";
      default:
        return status;
    }
  };

  // Check if booking can be cancelled (24h before for ALL lesson types - STANDARDIZED POLICY)
  const canCancelBooking = (booking: Booking): boolean => {
    // Apply uniform 24h cancellation policy for ALL lesson types
    const lessonDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const now = new Date();
    const hoursUntilLesson =
      (lessonDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilLesson >= 24 && booking.status === "scheduled";
  };

  // Check if payment is due for recurring sessions
  const isPaymentDue = (booking: Booking): boolean => {
    if (booking.service_type === "group") {
      return booking.payment_status === "payment_due";
    }

    // For recurring individual lessons: payment is due 24h before the lesson
    if (
      booking.service_type === "individual" &&
      (booking.lesson_type === "recurring" ||
        booking.lesson_type === "recurring_individual")
    ) {
      const lessonDateTime = new Date(
        `${booking.lesson_date}T${booking.lesson_time}`
      );
      const now = new Date();
      const hoursUntilLesson =
        (lessonDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Payment is due if we're within 24h and payment status is not paid
      return hoursUntilLesson <= 24 && booking.payment_status !== "paid";
    }

    return false;
  };

  // Get payment status for recurring sessions (groups and individual recurring)
  const getRecurringSessionPaymentStatus = (booking: Booking): string => {
    if (
      booking.service_type !== "group" &&
      !(
        booking.service_type === "individual" &&
        (booking.lesson_type === "recurring" ||
          booking.lesson_type === "recurring_individual")
      )
    ) {
      return booking.payment_status;
    }

    const lessonDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const now = new Date();
    const hoursUntilLesson =
      (lessonDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (booking.payment_status === "paid") {
      return "paid";
    } else if (hoursUntilLesson <= 24) {
      return "payment_due";
    } else {
      return "pending";
    }
  };

  // Cancel group session (same as individual)
  const cancelGroupSession = async (booking: Booking) => {
    try {
      setCancelling(booking.id);

      if (booking.payment_status === "paid") {
        // Process refund for paid group session
        await requestRefund(booking.id, language);
      } else {
        // Simple cancellation for unpaid group session
        const { error } = await supabase
          .from("bookings")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("id", booking.id);

        if (error) throw error;

        toast({
          title: language === "en" ? "Session Cancelled" : "Sessão Cancelada",
          description:
            language === "en"
              ? "Your group session has been cancelled successfully."
              : "Sua sessão em grupo foi cancelada com sucesso.",
          variant: "default",
        });
      }

      // Refresh bookings
      await loadBookings();

      // 🆕 NOTIFY CALENDAR ABOUT GROUP SESSION CANCELLATION
      const cancellationEvent = {
        timestamp: Date.now(),
        bookingId: booking.id,
        date: booking.lesson_date,
        time: booking.lesson_time,
        action: "cancelled",
        type: "group",
      };
      localStorage.setItem(
        "lastBookingCancellation",
        JSON.stringify(cancellationEvent)
      );
      window.dispatchEvent(
        new CustomEvent("bookingCancelled", {
          detail: cancellationEvent,
        })
      );
      console.log(
        "📡 Group cancellation event broadcasted:",
        cancellationEvent
      );
    } catch (error) {
      console.error("Error cancelling group session:", error);
      toast({
        title:
          language === "en" ? "Cancellation Error" : "Erro no Cancelamento",
        description:
          language === "en"
            ? "There was an error cancelling your session. Please try again."
            : "Houve um erro ao cancelar sua sessão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  // Process individual payment for group session
  const processGroupSessionPayment = async (booking: Booking) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "process-individual-payment",
        {
          body: {
            booking_id: booking.id,
            amount: 30, // £0.30 in pence
            currency: "gbp",
            user_info: {
              id: user.id,
              email: user.email,
            },
          },
        }
      );

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title:
            language === "en"
              ? "Redirecting to Payment"
              : "Redirecionando para Pagamento",
          description:
            language === "en"
              ? "Please complete your payment in the new tab."
              : "Por favor, complete seu pagamento na nova aba.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: language === "en" ? "Payment Error" : "Erro no Pagamento",
        description:
          language === "en"
            ? "There was an error processing your payment. Please try again."
            : "Houve um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const willGetRefund =
      canCancelBooking(booking) && booking.payment_status === "paid";
    const isPaid = booking.payment_status === "paid";

    try {
      setCancelling(bookingId);

      // If eligible for refund and paid, process refund automatically
      if (willGetRefund && isPaid) {
        // Use the requestRefund function for automatic refund
        const refundResult = await requestRefund(
          bookingId,
          "Student cancelled lesson"
        );

        if (refundResult.success) {
          toast({
            title: language === "en" ? "Lesson Cancelled" : "Aula Cancelada",
            description:
              language === "en"
                ? "Lesson cancelled successfully. Your payment has been refunded."
                : "Aula cancelada com sucesso. Seu pagamento foi reembolsado.",
          });
        } else {
          // If refund fails, still try to cancel via Edge Function
          const { data, error } = await supabase.functions.invoke(
            "cancel-booking",
            {
              body: {
                booking_id: bookingId,
                refund_eligible: willGetRefund && isPaid,
              },
            }
          );

          if (error) {
            throw new Error(error.message);
          }

          toast({
            title: language === "en" ? "Lesson Cancelled" : "Aula Cancelada",
            description:
              language === "en"
                ? "Lesson cancelled. Refund is being processed."
                : "Aula cancelada. Reembolso está sendo processado.",
          });
        }
      } else {
        // No refund needed, just cancel
        const { data, error } = await supabase.functions.invoke(
          "cancel-booking",
          {
            body: {
              booking_id: bookingId,
              refund_eligible: false,
            },
          }
        );

        if (error) {
          throw new Error(error.message);
        }

        let successMessage = "";
        if (data.payment_refunded) {
          successMessage =
            language === "en"
              ? "Lesson cancelled and payment refunded."
              : "Aula cancelada e pagamento reembolsado.";
        } else if (isPaid && !willGetRefund) {
          successMessage = getRefundTimingMessages(language).noRefundMessage;
        } else {
          successMessage =
            language === "en"
              ? "Lesson cancelled successfully."
              : "Aula cancelada com sucesso.";
        }

        toast({
          title:
            language === "en" ? "Booking Cancelled" : "Agendamento Cancelado",
          description: successMessage,
        });
      }

      // Reload bookings
      await loadBookings();

      // 🆕 NOTIFY CALENDAR ABOUT CANCELLATION
      // Store cancellation event to trigger calendar refresh
      const cancellationEvent = {
        timestamp: Date.now(),
        bookingId,
        date: booking.lesson_date,
        time: booking.lesson_time,
        action: "cancelled",
      };
      localStorage.setItem(
        "lastBookingCancellation",
        JSON.stringify(cancellationEvent)
      );

      // Dispatch custom event for real-time communication
      window.dispatchEvent(
        new CustomEvent("bookingCancelled", {
          detail: cancellationEvent,
        })
      );

      console.log("📡 Cancellation event broadcasted:", cancellationEvent);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: language === "en" ? "Error" : "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao cancelar agendamento",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  const upcomingBookings = bookings
    .filter(
      (booking) =>
        booking.status === "scheduled" &&
        new Date(booking.lesson_date) >= new Date()
    )
    // Reapply sorting to upcoming bookings to ensure recurring lessons are in order
    .sort((a, b) => {
      // Prioritize recurring lessons sorting by session number
      if (
        a.lesson_type === "recurring" &&
        b.lesson_type === "recurring" &&
        a.recurring_session_number &&
        b.recurring_session_number
      ) {
        // Same series - sort by session number
        if (a.recurring_session_id === b.recurring_session_id) {
          return a.recurring_session_number - b.recurring_session_number;
        }
        // Different series - still sort by session number for consistency
        return a.recurring_session_number - b.recurring_session_number;
      }

      // Default sort by date (soonest first for upcoming)
      const dateA = new Date(a.lesson_date);
      const dateB = new Date(b.lesson_date);
      return dateA.getTime() - dateB.getTime();
    });

  // DEBUG: Log the final order of upcoming bookings
  console.log("📋 FINAL UPCOMING BOOKINGS ORDER:");
  upcomingBookings
    .filter((b) => b.lesson_type === "recurring")
    .forEach((booking, index) => {
      console.log(
        `${index + 1}. Session ${booking.recurring_session_number}/${
          booking.recurring_session_total
        } - ${booking.lesson_date}`
      );
    });

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status !== "scheduled" ||
      new Date(booking.lesson_date) < new Date()
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === "en" ? "My Bookings" : "Meus Agendamentos"}
          </h1>
          <Button onClick={loadBookings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === "en" ? "Refresh" : "Atualizar"}
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">
            {language === "en"
              ? "Loading bookings..."
              : "Carregando agendamentos..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "en" ? "My Bookings" : "Meus Agendamentos"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === "en"
              ? "Manage your scheduled lessons and view payment status"
              : "Gerencie suas aulas agendadas e visualize o status de pagamento"}
          </p>
        </div>
        <Button onClick={loadBookings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === "en" ? "Refresh" : "Atualizar"}
        </Button>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === "en" ? "Upcoming Lessons" : "Próximas Aulas"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Your scheduled lessons including individual sessions and recurring group sessions"
              : "Suas aulas agendadas incluindo sessões individuais e sessões de grupo recorrentes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {language === "en"
                  ? "No upcoming lessons scheduled"
                  : "Nenhuma aula agendada"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {getServiceName(
                            booking.service_type,
                            booking.lesson_type
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {booking.lesson_type === "recurring" && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              {language === "en" ? "Recurring" : "Recorrente"}
                            </Badge>
                          )}
                          {booking.group_session_number &&
                            booking.group_session_total && (
                              <Badge variant="secondary" className="text-xs">
                                {language === "en"
                                  ? `Session ${booking.group_session_number} of ${booking.group_session_total}`
                                  : `Sessão ${booking.group_session_number} de ${booking.group_session_total}`}
                              </Badge>
                            )}
                          {booking.recurring_session_number &&
                            booking.recurring_session_total && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-purple-50 text-purple-600 border-purple-200"
                              >
                                <Repeat className="h-3 w-3 mr-1" />
                                {language === "en"
                                  ? `Lesson ${booking.recurring_session_number} of ${booking.recurring_session_total}`
                                  : `Aula ${booking.recurring_session_number} de ${booking.recurring_session_total}`}
                              </Badge>
                            )}
                          {booking.recurring_session_id && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-25 text-purple-500 border-purple-100"
                            >
                              Series: {booking.recurring_session_id.slice(-8)}
                            </Badge>
                          )}
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xl font-bold text-green-600">
                          {formatCurrency(booking.amount, booking.currency)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {language === "en"
                            ? "Amount for this lesson"
                            : "Valor desta aula"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {formatDate(booking.lesson_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {booking.lesson_time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {language === "en"
                            ? "Payment Status"
                            : "Status do Pagamento"}
                        </h4>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.payment_status
                          )}
                        >
                          {getPaymentStatusText(booking.payment_status)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {/* Special handling for recurring individual lessons */}
                        {booking.service_type === "individual" &&
                          (booking.lesson_type === "recurring" ||
                            booking.lesson_type === "recurring_individual") &&
                          booking.payment_status === PaymentStatus.PENDING && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Info className="h-4 w-4" />
                              <span className="text-sm">
                                {language === "en"
                                  ? "Payment will be charged automatically 24h before lesson"
                                  : "Pagamento será cobrado automaticamente 24h antes da aula"}
                              </span>
                            </div>
                          )}

                        {/* Regular payment pending */}
                        {!(
                          booking.service_type === "individual" &&
                          (booking.lesson_type === "recurring" ||
                            booking.lesson_type === "recurring_individual")
                        ) &&
                          booking.payment_status === PaymentStatus.PENDING && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Info className="h-4 w-4" />
                              <span className="text-sm">
                                {language === "en"
                                  ? `Payment will be charged: ${getTimeUntilPayment(
                                      booking.lesson_date,
                                      booking.lesson_time
                                    )}`
                                  : `Pagamento será cobrado: ${getTimeUntilPayment(
                                      booking.lesson_date,
                                      booking.lesson_time
                                    )}`}
                              </span>
                            </div>
                          )}

                        {booking.payment_status === PaymentStatus.PAID && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">
                              {language === "en"
                                ? "Payment completed"
                                : "Pagamento concluído"}
                            </span>
                          </div>
                        )}

                        {isPaymentDue(booking) && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {language === "en"
                                ? "Processing payment..."
                                : "Processando pagamento..."}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          {canCancelBooking(booking)
                            ? booking.service_type === "individual" &&
                              (booking.lesson_type === "recurring" ||
                                booking.lesson_type === "recurring_individual")
                              ? language === "en"
                                ? "Can be cancelled up to 24h before lesson"
                                : "Pode ser cancelada até 24h antes da aula"
                              : getRefundTimingMessages(language)
                                  .refundAvailable
                            : booking.service_type === "individual" &&
                              (booking.lesson_type === "recurring" ||
                                booking.lesson_type === "recurring_individual")
                            ? language === "en"
                              ? "Cancellation period expired - payment will be charged"
                              : "Prazo de cancelamento expirado - pagamento será cobrado"
                            : getRefundTimingMessages(language).noRefund}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      {canCancelBooking(booking) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                              disabled={cancelling === booking.id}
                            >
                              {cancelling === booking.id ? (
                                <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent mr-2" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              {language === "en"
                                ? "Cancel Lesson"
                                : "Cancelar Aula"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === "en"
                                  ? "Cancel Lesson"
                                  : "Cancelar Aula"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <div className="space-y-3">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium">
                                      {getServiceName(
                                        booking.service_type,
                                        booking.lesson_type
                                      )}
                                      {booking.group_session_number &&
                                        booking.group_session_total && (
                                          <span className="text-blue-600 ml-2">
                                            {language === "en"
                                              ? `(Session ${booking.group_session_number}/${booking.group_session_total})`
                                              : `(Sessão ${booking.group_session_number}/${booking.group_session_total})`}
                                          </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(booking.lesson_date)} às{" "}
                                      {booking.lesson_time}
                                    </p>
                                    <p className="text-sm font-semibold text-green-600">
                                      {formatCurrency(
                                        booking.amount,
                                        booking.currency
                                      )}
                                    </p>
                                  </div>

                                  {canCancelBooking(booking) &&
                                  booking.payment_status === "paid" ? (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                      <p className="text-sm text-green-800 font-medium">
                                        ✅{" "}
                                        {language === "en"
                                          ? "Refund Available"
                                          : "Reembolso Disponível"}
                                      </p>
                                      <p className="text-xs text-green-700 mt-1">
                                        {language === "en"
                                          ? "Your payment will be automatically refunded to your original payment method."
                                          : "Seu pagamento será automaticamente reembolsado para seu método de pagamento original."}
                                      </p>
                                    </div>
                                  ) : booking.payment_status === "paid" ? (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <p className="text-sm text-red-800 font-medium">
                                        ❌{" "}
                                        {language === "en"
                                          ? "No Refund Available"
                                          : "Sem Reembolso"}
                                      </p>
                                      <p className="text-xs text-red-700 mt-1">
                                        {language === "en"
                                          ? "Less than 24 hours before lesson. Payment will not be refunded."
                                          : "Menos de 24 horas antes da aula. O pagamento não será reembolsado."}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <p className="text-sm text-blue-800 font-medium">
                                        ℹ️{" "}
                                        {language === "en"
                                          ? "No Payment to Refund"
                                          : "Nenhum Pagamento para Reembolsar"}
                                      </p>
                                      <p className="text-xs text-blue-700 mt-1">
                                        {language === "en"
                                          ? "Payment has not been processed yet."
                                          : "O pagamento ainda não foi processado."}
                                      </p>
                                    </div>
                                  )}

                                  <p className="text-sm text-gray-600">
                                    {language === "en"
                                      ? "This action cannot be undone."
                                      : "Esta ação não pode ser desfeita."}
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {language === "en"
                                  ? "Keep Lesson"
                                  : "Manter Aula"}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {language === "en"
                                  ? "Cancel Lesson"
                                  : "Cancelar Aula"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past/Cancelled Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en"
                ? "Past & Cancelled Lessons"
                : "Aulas Anteriores e Canceladas"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your completed and cancelled lessons"
                : "Suas aulas concluídas e canceladas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "en" ? "Service" : "Serviço"}
                    </TableHead>
                    <TableHead>{language === "en" ? "Date" : "Data"}</TableHead>
                    <TableHead>
                      {language === "en" ? "Time" : "Horário"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Status" : "Status"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Payment" : "Pagamento"}
                    </TableHead>
                    <TableHead>
                      {language === "en" ? "Amount" : "Valor"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span>
                            {getServiceName(
                              booking.service_type,
                              booking.lesson_type
                            )}
                          </span>
                          {booking.group_session_number &&
                            booking.group_session_total && (
                              <span className="text-xs text-gray-500">
                                {language === "en"
                                  ? `(Session ${booking.group_session_number}/${booking.group_session_total})`
                                  : `(Sessão ${booking.group_session_number}/${booking.group_session_total})`}
                              </span>
                            )}
                          {booking.recurring_session_number &&
                            booking.recurring_session_total && (
                              <span className="text-xs text-gray-500">
                                {language === "en"
                                  ? `(Lesson ${booking.recurring_session_number}/${booking.recurring_session_total})`
                                  : `(Aula ${booking.recurring_session_number}/${booking.recurring_session_total})`}
                              </span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(booking.lesson_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.lesson_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.payment_status
                          )}
                        >
                          {getPaymentStatusText(booking.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {formatCurrency(booking.amount, booking.currency)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Total Bookings" : "Total de Agendamentos"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Upcoming" : "Próximas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {upcomingBookings.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Completed" : "Concluídas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Cancelled" : "Canceladas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter((b) => b.status === "cancelled").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentBookingsPage;
