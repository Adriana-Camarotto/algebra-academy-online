import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  PoundSterling,
  CreditCard,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { resolveUser } from "@/lib/auth";
import { useBookingLogic } from "@/hooks/useBookingLogic";

interface GroupSessionCardProps {
  booking: any;
  user: any;
  language: string;
  onPaymentComplete: () => void;
  onSessionCancelled?: () => void;
}

const GroupSessionCard: React.FC<GroupSessionCardProps> = ({
  booking,
  user,
  language,
  onPaymentComplete,
  onSessionCancelled,
}) => {
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getStatusBadge = (paymentStatus: string, status: string) => {
    const sessionDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const now = new Date();
    const hoursUntilSession =
      (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (paymentStatus === "paid") {
      return (
        <Badge
          variant="default"
          className="bg-green-500 flex items-center gap-1"
        >
          <CreditCard className="h-3 w-3" />
          {language === "en" ? "Paid" : "Pago"}
        </Badge>
      );
    } else if (paymentStatus === "pending") {
      if (hoursUntilSession <= 24) {
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {language === "en"
              ? "Payment processing..."
              : "Processando pagamento..."}
          </Badge>
        );
      } else {
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {language === "en"
              ? "Auto-pay in 24h"
              : "Pagamento automático em 24h"}
          </Badge>
        );
      }
    } else {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          {language === "en" ? "Payment failed" : "Pagamento falhou"}
        </Badge>
      );
    }
  };

  const canCancelSession = () => {
    const sessionDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const now = new Date();
    const timeUntilSession = sessionDateTime.getTime() - now.getTime();
    const hoursUntilSession = timeUntilSession / (1000 * 60 * 60);
    return hoursUntilSession > 24;
  };

  const handleCancelSession = async () => {
    try {
      await cancelLesson(
        booking.lesson_date,
        booking.lesson_day,
        booking.lesson_time
      );
      if (onSessionCancelled) {
        onSessionCancelled();
      }
    } catch (error) {
      console.error("Error cancelling group session:", error);
    }
  };

  const handlePayNow = async () => {
    setIsProcessingPayment(true);

    try {
      const resolvedUser = resolveUser(user);
      if (!resolvedUser) {
        throw new Error("User not authenticated");
      }

      console.log("Processing individual payment for booking:", booking.id);

      const { data, error } = await supabase.functions.invoke(
        "process-individual-payment",
        {
          body: {
            booking_id: booking.id,
            amount: Math.round(booking.amount * 100), // Convert to pence
            currency: "gbp",
            user_info: {
              id: resolvedUser.id,
              email: resolvedUser.email,
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        throw new Error(error.message || "Payment processing failed");
      }

      if (data?.url) {
        // Open payment page in new tab
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

        // Refresh after a delay to check for payment completion
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: language === "en" ? "Payment Error" : "Erro no Pagamento",
        description:
          error instanceof Error
            ? error.message
            : language === "en"
            ? "There was an error processing your payment. Please try again."
            : "Houve um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">
              {language === "en" ? "Group Session" : "Sessão em Grupo"}{" "}
              {booking.group_session_number}/{booking.group_session_total}
            </CardTitle>
          </div>
          {getStatusBadge(booking.payment_status, booking.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {format(new Date(booking.lesson_date), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.lesson_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <PoundSterling className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              0.30 {language === "en" ? "per session" : "por sessão"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            💡{" "}
            {language === "en"
              ? "Payment automatically processed 24h before session"
              : "Pagamento processado automaticamente 24h antes da sessão"}
          </div>

          <div className="flex items-center gap-2">
            {canCancelSession() ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelSession}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title={language === "en" ? "Cancel session" : "Cancelar sessão"}
              >
                <X className="h-4 w-4" />
                {language === "en" ? "Cancel" : "Cancelar"}
              </Button>
            ) : (
              <span className="text-xs text-gray-400">
                {language === "en"
                  ? "Cannot cancel (< 24h)"
                  : "Não cancelável (< 24h)"}
              </span>
            )}

            {booking.payment_status === "pending" && (
              <Button
                onClick={handlePayNow}
                disabled={isProcessingPayment}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === "en" ? "Processing..." : "Processando..."}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {language === "en" ? "Pay Now" : "Pagar Agora"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSessionCard;
