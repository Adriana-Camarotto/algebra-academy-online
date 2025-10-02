// Test schedule for Monday-Saturday, 8am-7pm (60-minute slots)

const weeklySchedule = {
  // Monday to Saturday - day 1 to 6 (0 = Sunday, 6 = Saturday)
  availableDays: [1, 2, 3, 4, 5, 6],

  // 8am to 7pm (60-minute slots)
  timeSlots: [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ],

  // Function to check if a date is available (Monday to Saturday)
  isDateAvailable: (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return weeklySchedule.availableDays.includes(dayOfWeek);
  },

  // Function to get available slots for a date
  getAvailableSlots: (date: Date) => {
    if (!weeklySchedule.isDateAvailable(date)) {
      return [];
    }

    return weeklySchedule.timeSlots.map((time) => ({
      time,
      available: true,
      capacity: 1,
      booked: 0,
      isGroup: false,
    }));
  },
};

console.log("Weekly Schedule Test:");
console.log("Available days:", weeklySchedule.availableDays);
console.log("Time slots:", weeklySchedule.timeSlots);

// Test with today's date
const today = new Date();
console.log("Today is available:", weeklySchedule.isDateAvailable(today));
console.log("Today slots:", weeklySchedule.getAvailableSlots(today));

// Test with next Monday
const nextMonday = new Date();
nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
console.log(
  "Next Monday is available:",
  weeklySchedule.isDateAvailable(nextMonday)
);
console.log("Next Monday slots:", weeklySchedule.getAvailableSlots(nextMonday));

export default weeklySchedule;
