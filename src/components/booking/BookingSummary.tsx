
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

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
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Booking Summary' : 'Resumo da Reserva'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Service' : 'Serviço'}:
            </p>
            <p className="font-medium">
              {services.find(s => s.id === selectedService)?.name}
            </p>
            {selectedService === 'group' && (
              <p className="text-xs text-blue-600">
                {language === 'en' ? '6 classes total, 60 minutes each' : '6 aulas no total, 60 minutos cada'}
              </p>
            )}
          </div>
          {selectedService === 'individual' && lessonType && (
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
          )}
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Duration' : 'Duração'}:
            </p>
            <p className="font-medium">{services.find(s => s.id === selectedService)?.duration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Date' : 'Data'}:
            </p>
            <p className="font-medium">
              {selectedDate ? format(selectedDate, 'PPP') : (language === 'en' ? 'Not selected' : 'Não selecionado')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Time' : 'Horário'}:
            </p>
            <p className="font-medium">
              {selectedTime || (language === 'en' ? 'Not selected' : 'Não selecionado')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Price' : 'Preço'}:
            </p>
            <p className="font-medium">{services.find(s => s.id === selectedService)?.price}</p>
            {lessonType === 'recurring' && (
              <p className="text-xs text-amber-600">
                {language === 'en' 
                  ? 'First payment now, then weekly automatically'
                  : 'Primeiro pagamento agora, depois semanalmente automaticamente'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Terms & Payment' : 'Termos e Pagamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">
              {language === 'en' ? 'Refunds & Cancellations Policy' : 'Política de Reembolsos e Cancelamentos'}
            </h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                {language === 'en' 
                  ? 'Please note that refunds are not available.'
                  : 'Por favor, note que reembolsos não estão disponíveis.'}
              </p>
              <p>
                {language === 'en'
                  ? 'If for any reason you are unable to attend the class then you must contact us before the class start time for the option to have it rescheduled to either of the 2 following weeks.'
                  : 'Se por qualquer motivo você não puder comparecer à aula, deve nos contatar antes do horário de início da aula para ter a opção de reagendá-la para qualquer uma das 2 semanas seguintes.'}
              </p>
              <p>
                {language === 'en'
                  ? 'Only one rescheduling of an individual class pass is permitted and we will only reschedule a class like for like.'
                  : 'Apenas um reagendamento de uma aula individual é permitido e só reagendaremos uma aula igual por igual.'}
              </p>
              <p>
                {language === 'en'
                  ? 'Workshops and special sessions cannot be rescheduled due to the nature of the event.'
                  : 'Workshops e sessões especiais não podem ser reagendados devido à natureza do evento.'}
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
                ? 'I have read and agree to the terms above *'
                : 'Li e concordo com os termos acima *'}
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
          >
            {isProcessing 
              ? (language === 'en' ? 'Processing...' : 'Processando...') 
              : (language === 'en' ? 'Confirm Booking & Pay' : 'Confirmar Agendamento e Pagar')
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingSummary;
