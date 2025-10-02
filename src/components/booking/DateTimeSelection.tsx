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
import { t, Language } from "@/lib/i18n";

interface DateTimeSelectionProps {
  language: Language;
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
            modifiers={{
              available: (date) => isDateAvailable(date),
            }}
            modifiersStyles={{
              available: {
                backgroundColor: "#f97316", // Orange color for available days
                color: "white",
                fontWeight: "bold",
              },
            }}
            className="rounded-md border w-fit mx-auto"
          />
          <div className="text-center text-sm text-gray-600 mt-2">
            {language === "en"
              ? "Available days (Monday-Friday) are shown in orange"
              : "Dias disponíveis (Segunda-Sexta) são mostrados em laranja"}
          </div>
        </div>

        {/* Time Selection - Only show after date is selected */}
        {selectedDate &&
        availableSlots &&
        Array.isArray(availableSlots) &&
        availableSlots.length > 0 ? (
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("availableTimeSlots", language)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {availableSlots.map((timeSlot) => {
                const isSelected = selectedTime === timeSlot.time;
                const isAvailable = timeSlot.available;

                console.log(`🔍 Rendering slot ${timeSlot.time}:`, {
                  available: isAvailable,
                  booked: timeSlot.booked,
                  capacity: timeSlot.capacity,
                });

                return (
                  <div key={timeSlot.time} className="relative">
                    {!isAvailable ? (
                      // Completely different element for unavailable slots
                      <div
                        className={cn(
                          "w-full h-10 justify-center flex items-center transition-all duration-200 relative",
                          "opacity-40 bg-gray-100 border border-gray-300 text-gray-400 rounded-md"
                        )}
                        style={{
                          pointerEvents: "none",
                          cursor: "not-allowed",
                          userSelect: "none",
                        }}
                      >
                        <span className="flex flex-col items-center">
                          <span className="font-medium line-through text-sm">
                            {timeSlot.time}
                          </span>
                          <span className="text-xs text-red-500 font-bold">
                            {language === "en" ? "OCCUPIED" : "OCUPADO"}
                          </span>
                          {timeSlot.booked > 0 && (
                            <span className="text-xs text-gray-400">
                              ({timeSlot.booked} booking
                              {timeSlot.booked !== 1 ? "s" : ""})
                            </span>
                          )}
                        </span>
                      </div>
                    ) : (
                      // Normal button for available slots
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          console.log(
                            "Available time slot clicked:",
                            timeSlot.time
                          );
                          onTimeSelect(timeSlot.time);
                        }}
                        className={cn(
                          "w-full justify-center transition-all duration-200 relative",
                          isSelected
                            ? "bg-tutor-primary text-white border-tutor-primary"
                            : "hover:bg-tutor-primary/10 hover:border-tutor-primary/30 hover:scale-105"
                        )}
                      >
                        <span className="flex flex-col items-center">
                          <span className="font-medium">{timeSlot.time}</span>
                        </span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedDate ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">
              {language === "en"
                ? "No time slots available for the selected date"
                : "Nenhum horário disponível para a data selecionada"}
            </p>
            <p className="text-sm">
              Available slots: {availableSlots ? availableSlots.length : 0}
            </p>
            <p className="text-xs mt-2">
              Debug:{" "}
              {selectedDate ? selectedDate.toLocaleDateString() : "No date"}
            </p>
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
