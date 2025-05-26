
import React from 'react';
import { Clock, CreditCard, CheckCircle, Repeat, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: JSX.Element;
}

interface ServiceSelectionProps {
  language: string;
  services: Service[];
  selectedService: string | null;
  lessonType: 'single' | 'recurring' | null;
  onServiceSelect: (serviceId: string) => void;
  onLessonTypeSelect: (type: 'single' | 'recurring') => void;
  onNext: () => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  language,
  services,
  selectedService,
  lessonType,
  onServiceSelect,
  onLessonTypeSelect,
  onNext
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Choose Your Service' : 'Escolha Seu Serviço'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Select the type of tutoring service you need' 
            : 'Selecione o tipo de serviço de tutoria que você precisa'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id}>
              <div
                onClick={() => onServiceSelect(service.id)}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                  selectedService === service.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{service.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'per session' : 'por sessão'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lesson Type Selection for Individual Tutoring */}
              {selectedService === 'individual' && service.id === 'individual' && (
                <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    {language === 'en' ? 'Lesson Type' : 'Tipo de Aula'}
                  </h4>
                  <div className="space-y-2">
                    <div
                      onClick={() => onLessonTypeSelect('single')}
                      className={cn(
                        "p-3 border rounded cursor-pointer transition-all",
                        lessonType === 'single'
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="font-medium">
                        {language === 'en' ? 'Single Lesson' : 'Aula Única'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' 
                          ? 'One-time lesson with immediate payment' 
                          : 'Aula única com pagamento imediato'}
                      </div>
                    </div>
                    <div
                      onClick={() => onLessonTypeSelect('recurring')}
                      className={cn(
                        "p-3 border rounded cursor-pointer transition-all",
                        lessonType === 'recurring'
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="font-medium">
                        {language === 'en' ? 'Recurring Lessons' : 'Aulas Recorrentes'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' 
                          ? 'Weekly lessons on the same day and time. First payment now, subsequent payments automatic.' 
                          : 'Aulas semanais no mesmo dia e horário. Primeiro pagamento agora, pagamentos seguintes automáticos.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!selectedService || (selectedService === 'individual' && !lessonType)}
        >
          {language === 'en' ? 'Continue' : 'Continuar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceSelection;
