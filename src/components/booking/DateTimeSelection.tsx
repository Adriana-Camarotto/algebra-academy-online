
import React from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimeSelectionProps {
  language: string;
  selectedService: string | null;
  selectedDay: string | null;
  selectedTime: string | null;
  selectedDate: Date | undefined;
  availableSlots: Record<string, string[]>;
  daysTranslation: Record<string, string>;
  groupSessionSpots: Record<string, { available: number; total: number }>;
  onDateSelect: (date: Date | undefined) => void;
  onTabChange: (day: string) => void;
  onTimeSelect: (time: string) => void;
  isDateAvailable: (date: Date) => boolean;
  isTimeSlotAvailable: (day: string, time: string, date: Date) => boolean;
  onNext: () => void;
  onPrevious: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  language,
  selectedService,
  selectedDay,
  selectedTime,
  selectedDate,
  availableSlots,
  daysTranslation,
  groupSessionSpots,
  onDateSelect,
  onTabChange,
  onTimeSelect,
  isDateAvailable,
  isTimeSlotAvailable,
  onNext,
  onPrevious
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Select Date and Time' : 'Selecionar Data e Horário'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Choose your preferred date and time. Only dates with available slots are shown.' 
            : 'Escolha sua data e horário preferido. Apenas datas com horários disponíveis são mostradas.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {language === 'en' ? 'Select Date' : 'Selecionar Data'}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>{language === 'en' ? 'Pick a date' : 'Escolha uma data'}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                disabled={(date) => !isDateAvailable(date)}
                initialFocus
                className="p-3 pointer-events-auto"
                modifiers={{
                  available: (date) => isDateAvailable(date)
                }}
                modifiersStyles={{
                  available: { 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgb(34, 197, 94)',
                    color: 'rgb(34, 197, 94)'
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {language === 'en' ? 'Available Time Slots' : 'Horários Disponíveis'}
          </label>
          <Tabs value={selectedDay || "monday"} onValueChange={onTabChange}>
            <TabsList className="grid grid-cols-5">
              {Object.keys(availableSlots).map(day => (
                <TabsTrigger key={day} value={day}>
                  {daysTranslation[day]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(availableSlots).map(([day, slots]) => (
              <TabsContent key={day} value={day} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map(slot => {
                    const isAvailable = selectedDate ? isTimeSlotAvailable(day, slot, selectedDate) : true;
                    const isSelected = selectedTime === slot && selectedDay === day;
                    const slotKey = `${day}-${slot}`;
                    const spotInfo = selectedService === 'group' ? groupSessionSpots[slotKey] : null;
                    
                    return (
                      <div key={slot} className="relative">
                        <Button 
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "w-full h-auto p-3 flex flex-col items-center gap-1",
                            isSelected && "bg-primary text-white",
                            !isAvailable && "opacity-50 cursor-not-allowed bg-red-100 text-red-600 border-red-200",
                            isAvailable && !isSelected && "hover:bg-primary hover:text-white transition-colors"
                          )}
                          onClick={() => onTimeSelect(slot)}
                          disabled={!isAvailable}
                        >
                          <span className="font-medium">{slot}</span>
                          {selectedService === 'group' && spotInfo && (
                            <span className={cn(
                              "text-xs",
                              spotInfo.available === 0 ? "text-red-600" : "text-green-600"
                            )}>
                              {spotInfo.available}/{spotInfo.total} {language === 'en' ? 'spots' : 'vagas'}
                            </span>
                          )}
                          {!isAvailable && (
                            <span className="text-xs">
                              {language === 'en' ? 'Booked' : 'Reservado'}
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {language === 'en' ? 'Back' : 'Voltar'}
        </Button>
        <Button onClick={onNext} disabled={!selectedDay || !selectedTime || !selectedDate}>
          {language === 'en' ? 'Continue' : 'Continuar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DateTimeSelection;
