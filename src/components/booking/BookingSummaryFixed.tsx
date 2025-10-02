import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  formatCurrency,
  getServiceAmount,
  getPaymentTimingMessage,
} from "@/utils/paymentUtils";
import { PoundSterling } from "lucide-react";

interface BookingSummaryProps {
  language: string;
  services: any[];
  selectedService: string | null;
  lessonType: "single" | "recurring" | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  termsAccepted: boolean;
  isProcessing: boolean;
  onTermsChange: (value: boolean) => void;
  onConfirmBooking: () => void;
  onPrevious: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  language,
  services,
  selectedService,
  lessonType,
  selectedDate,
  selectedTime,
  termsAccepted,
  isProcessing,
  onTermsChange,
  onConfirmBooking,
  onPrevious,
}) => {
  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Format date based on language
  const formatBookingDate = (date: Date) => {
    return language === "en"
      ? format(date, "EEEE, MMMM d, yyyy")
      : format(date, "EEEE, d 'de' MMMM 'de' yyyy");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Booking Summary" : "Resumo do Agendamento"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === "en" ? "Service Details" : "Detalhes do Serviço"}
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Service:" : "Serviço:"}
                  </span>
                  <span>{selectedServiceData?.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Type:" : "Tipo:"}
                  </span>
                  <span>
                    {lessonType === "single"
                      ? language === "en"
                        ? "Single Lesson"
                        : "Aula Única"
                      : language === "en"
                      ? "Recurring Lessons"
                      : "Aulas Recorrentes"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Duration:" : "Duração:"}
                  </span>
                  <span>{selectedServiceData?.duration}</span>
                </p>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === "en" ? "Schedule Details" : "Detalhes do Horário"}
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Date:" : "Data:"}
                  </span>
                  <span>
                    {selectedDate ? formatBookingDate(selectedDate) : "-"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Time:" : "Horário:"}
                  </span>
                  <span>{selectedTime || "-"}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "en" ? "Payment Details" : "Detalhes do Pagamento"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {language === "en" ? "Price:" : "Preço:"}
                </span>
                <div className="flex items-center gap-1 font-semibold">
                  {selectedServiceData
                    ? formatCurrency(getServiceAmount(selectedServiceData))
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => onTermsChange(!!checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                {language === "en"
                  ? "I agree to the terms and conditions, including the cancellation policy"
                  : "Eu concordo com os termos e condições, incluindo a política de cancelamento"}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isProcessing}>
          {language === "en" ? "Previous" : "Anterior"}
        </Button>
        <Button
          onClick={onConfirmBooking}
          disabled={!termsAccepted || isProcessing}
          className="min-w-[180px]"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {language === "en" ? "Processing..." : "Processando..."}
            </span>
          ) : language === "en" ? (
            "Pay and Book Lesson"
          ) : (
            "Pagar e Agendar Aula"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;
