import React from "react";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface DateTimeSelectionProps {
  language: string;
  selectedService: string | null;
  selectedDay: string | null;
  selectedTime: string | null;
  selectedDate: Date | undefined;
  availableSlots: any; // TimeSlot[] from new hook
  daysTranslation: Record<string, string>;
  bookedSlots?: any; // Add this for conflict detection
  onDateSelect: (date: Date | undefined) => void;
  onTabChange: (day: string) => void;
  onTimeSelect: (time: string) => void;
  isDateAvailable: (date: Date) => boolean;
  isTimeSlotAvailable: (date: string, time: string) => boolean;
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
  bookedSlots,
  onDateSelect,
  onTabChange,
  onTimeSelect,
  isDateAvailable,
  isTimeSlotAvailable,
  onNext,
  onPrevious,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t("selectDate", language)} & {t("selectTime", language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("selectDate", language)}
          </label>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => !isDateAvailable(date)}
            className="rounded-md border w-fit mx-auto"
          />
        </div>

        {/* Time Selection - Only show after date is selected */}
        {selectedDate && availableSlots && Array.isArray(availableSlots) ? (
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("availableTimeSlots", language)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {availableSlots.map((timeSlot) => {
                const isSelected = selectedTime === timeSlot.time;
                const isAvailable = timeSlot.available;

                return (
                  <div key={timeSlot.time} className="relative">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isAvailable) {
                          onTimeSelect(timeSlot.time);
                        }
                      }}
                      disabled={!isAvailable}
                      className={cn(
                        "w-full justify-center transition-all duration-200",
                        isSelected
                          ? "bg-tutor-primary text-white border-tutor-primary"
                          : isAvailable
                          ? "hover:bg-tutor-primary/10 hover:border-tutor-primary/30"
                          : "opacity-50 cursor-not-allowed bg-gray-100"
                      )}
                    >
                      <span className="flex flex-col items-center">
                        <span className="font-medium">{timeSlot.time}</span>
                        {!isAvailable && (
                          <span className="text-xs text-red-600">
                            {language === "en" ? "Booked" : "Ocupado"}
                          </span>
                        )}
                      </span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedDate ? (
          <div className="text-center py-8 text-gray-500">
            {language === "en"
              ? "No time slots available for the selected date"
              : "Nenhum horário disponível para a data selecionada"}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {language === "en"
              ? "Please select a date to see available time slots."
              : "Por favor, selecione uma data para ver os horários disponíveis."}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {language === "en" ? "Previous" : "Anterior"}
        </Button>
        <Button onClick={onNext} disabled={!selectedDate || !selectedTime}>
          {language === "en" ? "Continue" : "Continuar"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DateTimeSelection;
