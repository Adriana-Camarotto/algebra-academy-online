// Utility functions for payment processing
import { supabase } from "@/integrations/supabase/client";

export interface PaymentProcessingResult {
  success: boolean;
  message: string;
  processedCount: number;
  errors: string[];
}

/**
 * Process payments for bookings that are 24h before lesson time
 * NOW APPLIES TO ALL LESSON TYPES: individual (single), individual (recurring), group, and exam-prep
 */
export const processAutomaticPayments =
  async (): Promise<PaymentProcessingResult> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "process-automatic-payments"
      );

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: "Payments processed successfully for all lesson types",
        processedCount: data?.processed_count || 0,
        errors: [],
      };
    } catch (error) {
      console.error("Error processing automatic payments:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        processedCount: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  };

/**
 * Check if a booking's payment should be processed
 * NOW APPLIES TO ALL LESSON TYPES: 24h before lesson time
 */
export const shouldProcessPayment = (
  lessonDate: string,
  lessonTime: string
): boolean => {
  const now = new Date();
  const lessonDateTime = new Date(`${lessonDate}T${lessonTime}`);
  const paymentTime = new Date(lessonDateTime.getTime() - 24 * 60 * 60 * 1000); // 24h before (standardized for all lesson types)
  return now >= paymentTime && now < lessonDateTime;
};

/**
 * Check if a booking can be cancelled with refund
 */
export const canGetRefund = (
  lessonDate: string,
  lessonTime: string
): boolean => {
  const now = new Date();
  const lessonDateTime = new Date(`${lessonDate}T${lessonTime}`);
  const refundDeadline = new Date(
    lessonDateTime.getTime() - 24 * 60 * 60 * 1000
  ); // 24 hours before
  return now < refundDeadline;
};

/**
 * Get human-readable time until payment processing
 * NOW APPLIES TO ALL LESSON TYPES: 24h before lesson time
 */
export const getTimeUntilPayment = (
  lessonDate: string,
  lessonTime: string
): string => {
  const now = new Date();
  const lessonDateTime = new Date(`${lessonDate}T${lessonTime}`);
  const paymentTime = new Date(lessonDateTime.getTime() - 24 * 60 * 60 * 1000); // 24h before (standardized for all lesson types)

  if (now >= paymentTime) {
    return "Payment processing time has passed";
  }

  const diffMs = paymentTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ${
      diffHours % 24
    }h ${diffMinutes}m`;
  }

  return `${diffHours}h ${diffMinutes}m`;
};

/**
 * Payment status helpers
 */
export const PaymentStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type PaymentStatusType =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Format currency value consistently across the application
 * Always displays in GBP (£) format
 */
export const formatCurrency = (
  amount: number,
  currency: string = "GBP"
): string => {
  const value = amount / 100; // Convert pence to pounds
  // Always format as GBP regardless of input currency
  return `£${value.toFixed(2)}`;
};

/**
 * Get price amount from service data
 */
export const getServiceAmount = (serviceData: any): number => {
  if (!serviceData) return 0;

  // If it's already a number (in pence), return it
  if (typeof serviceData.amount === "number") {
    return serviceData.amount;
  }

  // If price is a string like "£25.00", extract the number
  if (typeof serviceData.price === "string") {
    const match = serviceData.price.match(/[\d.]+/);
    if (match) {
      return Math.round(parseFloat(match[0]) * 100); // Convert to pence
    }
  }

  // Default fallback
  return 2500; // £25.00 in pence
};

/**
 * Ensure all amounts are treated as GBP regardless of stored currency
 * This standardizes the application to always use British Pounds
 */
export const normalizeToGBP = (amount: number, currency?: string): number => {
  // For now, all amounts are assumed to be in GBP (pence)
  // In the future, this could include currency conversion if needed
  return amount;
};

/**
 * Request a refund for a booking
 */
export const requestRefund = async (
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the booking exists and is eligible for refund
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // Check if refund is still available
    if (!canGetRefund(booking.lesson_date, booking.lesson_time)) {
      return {
        success: false,
        message: getRefundTimingMessages().refundEligibilityExpired,
      };
    }

    // Check if booking is in a state that allows refund
    if (
      booking.status === "cancelled" ||
      booking.payment_status === "refunded"
    ) {
      return {
        success: false,
        message: "Booking is already cancelled or refunded",
      };
    }

    // Update booking to request refund
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        payment_status:
          booking.payment_status === "paid" ? "refunded" : "cancelled",
        refund_reason: reason || "Student requested refund",
        refund_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Error updating booking for refund:", updateError);
      return {
        success: false,
        message: "Failed to process refund request",
      };
    }

    // TODO: Integrate with payment processor to actually process the refund
    // For now, we just mark it as refunded in the database

    // TODO: Send confirmation email to student

    return {
      success: true,
      message: "Refund request processed successfully",
    };
  } catch (error) {
    console.error("Error processing refund request:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get refund status text for display
 */
export const getRefundStatusText = (
  paymentStatus: string,
  language: string = "en"
): string => {
  const statusTexts = {
    en: {
      refunded: "Refunded",
      cancelled: "Cancelled",
      pending: "Refund Pending",
      processing: "Processing Refund",
    },
    pt: {
      refunded: "Reembolsado",
      cancelled: "Cancelado",
      pending: "Reembolso Pendente",
      processing: "Processando Reembolso",
    },
  };

  const texts = statusTexts[language] || statusTexts.en;
  return texts[paymentStatus] || paymentStatus;
};

/**
 * Get consistent payment timing messages for user display
 */
export const getPaymentTimingMessage = (
  language: string = "en"
): {
  paymentProcessing: string;
  cancellationPolicy: string;
  fullMessage: string;
} => {
  if (language === "pt") {
    return {
      paymentProcessing: "",
      cancellationPolicy: "",
      fullMessage: "",
    };
  }

  return {
    paymentProcessing: "",
    cancellationPolicy: "",
    fullMessage: "",
  };
};

/**
 * Get refund-related timing messages
 */
export const getRefundTimingMessages = (language: string = "en") => {
  if (language === "pt") {
    return {
      warningLessThan24h:
        "Aviso: Sua aula é em menos de 24 horas. O pagamento já foi processado e NÃO será reembolsado. Você realmente quer cancelar esta aula?",
      noRefundMessage:
        "Aula cancelada. O pagamento não foi reembolsado pois o cancelamento foi feito com menos de 24 horas de antecedência.",
      refundAvailable: "Reembolso disponível",
      noRefund: "Sem reembolso",
      refundEligibilityExpired:
        "Período de reembolso expirou (deve ser mais de 24 horas antes da aula)",
      adminDeletionWithRefund:
        "Agendamento deletado com reembolso automático processado",
      adminDeletionNoRefund:
        "Agendamento deletado sem reembolso (fora do período de pagamento)",
    };
  }

  return {
    warningLessThan24h:
      "Warning: Your lesson is less than 24 hours away. The payment has already been processed and WILL NOT be refunded. Do you really want to cancel this lesson?",
    noRefundMessage:
      "Lesson cancelled. Payment was not refunded as cancellation was made less than 24 hours before the lesson.",
    refundAvailable: "Refund available",
    noRefund: "No refund",
    refundEligibilityExpired:
      "Refund period has expired (must be more than 24 hours before lesson)",
    adminDeletionWithRefund: "Booking deleted with automatic refund processed",
    adminDeletionNoRefund:
      "Booking deleted without refund (outside payment window)",
  };
};

/**
 * Admin/Tutor delete booking with automatic refund if within 24h payment window
 */
export const adminDeleteBooking = async (
  bookingId: string,
  language: string = "en"
): Promise<{
  success: boolean;
  message: string;
  automaticRefundProcessed?: boolean;
  refundId?: string;
  withinPaymentWindow?: boolean;
}> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        message:
          language === "en"
            ? "Authentication required"
            : "Autenticação necessária",
      };
    }

    const { data, error } = await supabase.functions.invoke(
      "admin-delete-booking",
      {
        body: { booking_id: bookingId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (error) {
      console.error("Admin delete booking error:", error);
      return {
        success: false,
        message:
          error.message ||
          (language === "en"
            ? "Failed to delete booking"
            : "Falha ao deletar agendamento"),
      };
    }

    if (!data.success) {
      return {
        success: false,
        message:
          data.error ||
          (language === "en"
            ? "Failed to delete booking"
            : "Falha ao deletar agendamento"),
      };
    }

    const messages = getRefundTimingMessages(language);
    let finalMessage = data.message;

    // Enhance message based on refund status
    if (data.within_payment_window && data.automatic_refund_processed) {
      finalMessage = messages.adminDeletionWithRefund;
    } else if (!data.within_payment_window) {
      finalMessage = messages.adminDeletionNoRefund;
    }

    return {
      success: true,
      message: finalMessage,
      automaticRefundProcessed: data.automatic_refund_processed,
      refundId: data.refund_id,
      withinPaymentWindow: data.within_payment_window,
    };
  } catch (error) {
    console.error("Error in adminDeleteBooking:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : language === "en"
          ? "Unknown error occurred"
          : "Erro desconhecido",
    };
  }
};
