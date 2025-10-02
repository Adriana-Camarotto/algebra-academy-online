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
          {/* Service Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              {language === "en" ? "Service Details" : "Detalhes do Serviço"}
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === "en" ? "Service:" : "Serviço:"}
                </span>
                <span>
                  {selectedServiceData
                    ? selectedServiceData.name[language] ||
                      selectedServiceData.name
                    : language === "en"
                    ? "No service selected"
                    : "Nenhum serviço selecionado"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === "en" ? "Type:" : "Tipo:"}
                </span>
                <span>
                  {lessonType === "single"
                    ? language === "en"
                      ? "Single Lesson"
                      : "Aula Avulsa"
                    : lessonType === "recurring"
                    ? language === "en"
                      ? "Recurring Lessons"
                      : "Aulas Recorrentes"
                    : language === "en"
                    ? "Not selected"
                    : "Não selecionado"}
                </span>
              </div>

              {selectedDate && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {language === "en" ? "Date:" : "Data:"}
                  </span>
                  <span>{formatBookingDate(selectedDate)}</span>
                </div>
              )}

              {selectedTime && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {language === "en" ? "Time:" : "Horário:"}
                  </span>
                  <span>{selectedTime}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              {language === "en" ? "Pricing" : "Preços"}
            </h3>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              {selectedServiceData && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {language === "en"
                        ? "Service Price:"
                        : "Preço do Serviço:"}
                    </span>
                    <span className="flex items-center gap-1">
                      {formatCurrency(getServiceAmount(selectedServiceData))}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {getPaymentTimingMessage(language).fullMessage ||
                      (language === "en"
                        ? "Payment will be processed securely"
                        : "O pagamento será processado com segurança")}
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => onTermsChange(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                {language === "en"
                  ? "I agree to the terms and conditions and privacy policy"
                  : "Concordo com os termos e condições e política de privacidade"}
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isProcessing}
              className="flex-1"
            >
              {language === "en" ? "Previous" : "Anterior"}
            </Button>

            <Button
              onClick={onConfirmBooking}
              disabled={
                !selectedService ||
                !selectedDate ||
                !selectedTime ||
                !termsAccepted ||
                isProcessing
              }
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isProcessing
                ? language === "en"
                  ? "Processing..."
                  : "Processando..."
                : language === "en"
                ? "Confirm Booking"
                : "Confirmar Agendamento"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSummary;
