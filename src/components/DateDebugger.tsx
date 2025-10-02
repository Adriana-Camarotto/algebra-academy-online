import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DateDebugger: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const isFutureOrToday = targetDate >= today;

    return isWeekday && isFutureOrToday;
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log("DateDebugger - Raw date selected:", date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log("DateDebugger - Formatted date:", formattedDate);
    }
    setSelectedDate(date);
  };

  return (
    <Card className="w-fit mx-auto">
      <CardHeader>
        <CardTitle>Date Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => !isDateAvailable(date)}
          modifiers={{
            available: (date) => isDateAvailable(date),
          }}
          modifiersStyles={{
            available: {
              backgroundColor: "#f97316",
              color: "white",
              fontWeight: "bold",
            },
          }}
          className="rounded-md border"
        />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>
            Selected Date Object:{" "}
            {selectedDate ? selectedDate.toString() : "None"}
          </p>
          <p>
            Selected Date ISO:{" "}
            {selectedDate ? selectedDate.toISOString() : "None"}
          </p>
          <p>
            Local String:{" "}
            {selectedDate ? selectedDate.toLocaleDateString() : "None"}
          </p>
          <p>
            Day of Week: {selectedDate ? selectedDate.getDay() : "None"} (1=Mon,
            5=Fri)
          </p>
          <p>
            Is Available:{" "}
            {selectedDate ? isDateAvailable(selectedDate).toString() : "None"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateDebugger;
