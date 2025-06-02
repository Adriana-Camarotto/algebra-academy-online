
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { CreditCard, Calendar, Clock, User } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

interface BookingSummaryProps {
  language: string;
  services: Service[];
  selectedService: string | null;
  lessonType: 'single' | 'recurring' | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  termsAccepted: boolean;
  isProcessing: boolean;
  onTermsChange: (checked: boolean) => void;
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
  onPrevious
}) => {
  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Booking Summary' : 'Resumo da Reserva'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Service' : 'Serviço'}:
                </p>
                <p className="font-medium">{selectedServiceData?.name}</p>
                {selectedService === 'group' && (
                  <p className="text-xs text-blue-600">
                    {language === 'en' ? '6 classes total, 60 minutes each' : '6 aulas no total, 60 minutos cada'}
                  </p>
                )}
              </div>
            </div>

            {selectedService === 'individual' && lessonType && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Lesson Type' : 'Tipo de Aula'}:
                  </p>
                  <p className="font-medium">
                    {lessonType === 'single' 
                      ? (language === 'en' ? 'Single Lesson' : 'Aula Única')
                      : (language === 'en' ? 'Recurring Lessons' : 'Aulas Recorrentes')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Duration' : 'Duração'}:
                </p>
                <p className="font-medium">{selectedServiceData?.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Date' : 'Data'}:
                </p>
                <p className="font-medium">
                  {selectedDate ? format(selectedDate, 'PPP') : (language === 'en' ? 'Not selected' : 'Não selecionado')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Time' : 'Horário'}:
                </p>
                <p className="font-medium">
                  {selectedTime || (language === 'en' ? 'Not selected' : 'Não selecionado')}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-1 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Payment' : 'Pagamento'}:
                  </p>
                  <p className="font-bold text-blue-600 text-lg">
                    {language === 'en' ? 'Scheduled' : 'Agendado'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'en' 
                      ? 'Payment will be processed 24 hours before the lesson'
                      : 'Pagamento será processado 24 horas antes da aula'}
                  </p>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    £0.30
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'en' 
                      ? 'Minimum payment amount required by Stripe'
                      : 'Valor mínimo de pagamento exigido pelo Stripe'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Terms & Booking' : 'Termos e Agendamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">
              {language === 'en' ? 'Payment & Cancellation Policy' : 'Política de Pagamento e Cancelamento'}
            </h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                <strong>
                  {language === 'en' 
                    ? 'Scheduled Payment:' 
                    : 'Pagamento Agendado:'}
                </strong>{' '}
                {language === 'en' 
                  ? 'Payment will be automatically processed 24 hours and 1 minute before your lesson.'
                  : 'O pagamento será processado automaticamente 24 horas e 1 minuto antes da sua aula.'}
              </p>
              <p>
                <strong>
                  {language === 'en' 
                    ? 'Free Cancellation:' 
                    : 'Cancelamento Gratuito:'}
                </strong>{' '}
                {language === 'en'
                  ? 'You can cancel your lesson up to 24 hours before the scheduled time without any charge. The payment will not be processed if you cancel in time.'
                  : 'Você pode cancelar sua aula até 24 horas antes do horário agendado sem nenhuma cobrança. O pagamento não será processado se você cancelar a tempo.'}
              </p>
              <p>
                <strong>
                  {language === 'en' 
                    ? 'Late Cancellation:' 
                    : 'Cancelamento Tardio:'}
                </strong>{' '}
                {language === 'en'
                  ? 'If you cancel less than 24 hours before the lesson, the payment will still be processed as the payment window has passed.'
                  : 'Se você cancelar com menos de 24 horas antes da aula, o pagamento ainda será processado pois a janela de pagamento já passou.'}
              </p>
              <p>
                {language === 'en'
                  ? 'Only one rescheduling of an individual class pass is permitted and we will only reschedule a class like for like.'
                  : 'Apenas um reagendamento de uma aula individual é permitido e só reagendaremos uma aula igual por igual.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={onTermsChange}
            />
            <Label htmlFor="terms" className="text-xs leading-relaxed">
              {language === 'en'
                ? 'I have read and agree to the payment and cancellation terms above *'
                : 'Li e concordo com os termos de pagamento e cancelamento acima *'}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            {language === 'en' ? 'Back' : 'Voltar'}
          </Button>
          <Button 
            onClick={onConfirmBooking}
            disabled={!termsAccepted || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                {language === 'en' ? 'Processing...' : 'Processando...'}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Pay and Book Lesson' : 'Pagar e Agendar Aula'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingSummary;
