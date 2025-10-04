# 🔄 Recurring Class Booking System - Complete Implementation

## 📋 Overview

This document outlines the comprehensive recurring class booking system integrated with Stripe payments, designed to meet all specified requirements:

1. ✅ **24-Hour Advance Rule**: First recurring class must be booked at least 24 hours before start
2. ✅ **Automatic Calendar Blocking**: Time slots blocked weekly for the entire series
3. ✅ **Individual Dashboard Cards**: Each recurring lesson appears as separate booking card
4. ✅ **Admin/Tutor Visibility**: Individual sessions visible in admin and tutor dashboards

## 🏗️ Technical Architecture

### Database Schema

```sql
-- Enhanced bookings table with recurring support
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS:
- recurring_session_id TEXT        -- Unique series identifier
- recurring_session_number INTEGER -- Current lesson number (1, 2, 3...)
- recurring_session_total INTEGER  -- Total lessons in series
```

### Data Flow

```
User Selects Recurring → Frontend Validation → Edge Function → Database Records
                                ↓                    ↓              ↓
                         24h Rule Check    Individual Bookings   Calendar Blocking
                                                    ↓              ↓
                               Student Dashboard Cards    Admin/Tutor Views
```

## 🚀 Key Features Implemented

### 1. Enhanced Service Selection

**File**: `src/components/booking/ServiceSelection.tsx`

- Individual tutoring now offers "Single Lesson" vs "Recurring Lessons"
- Clear pricing and payment structure explanation
- Recurring lessons show weekly scheduling information

### 2. Advanced Booking Validation

**File**: `src/hooks/useBookingLogic.ts`

```typescript
// 24-Hour Rule Enforcement
const validateRecurringAvailability = useCallback(
  async (dates: string[], time: string) => {
    const firstLessonDate = new Date(`${dates[0]}T${time}`);
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    );

    if (firstLessonDate < twentyFourHoursFromNow) {
      throw new Error(
        "First recurring lesson must be booked at least 24 hours in advance."
      );
    }

    // Validate all dates in series for conflicts
    for (const checkDate of dates) {
      if (!isTimeSlotAvailable(checkDate, time)) {
        throw new Error(`Conflict detected on ${checkDate}`);
      }
    }
  },
  [isTimeSlotAvailable, language]
);
```

### 3. Automatic Date Calculation

```typescript
// Calculate weekly recurring dates until December 1, 2025
const calculateRecurringDates = useCallback(
  (startDate: string, dayOfWeek: string): string[] => {
    const endDate = new Date("2025-12-01");
    const dates: string[] = [];
    const start = new Date(startDate);

    let current = new Date(start);
    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 7); // Weekly recurrence
    }

    return dates;
  },
  []
);
```

### 4. Smart Calendar Blocking

**Enhanced Time Slot Availability**:

```typescript
const isTimeSlotAvailable = useCallback(
  (date: string, time: string): boolean => {
    // Check for existing active bookings
    const conflictingBookings =
      bookedSlots.filter(/* standard conflict check */);

    // ENHANCED: Check for recurring series conflicts
    if (selectedService === "individual" && lessonType === "recurring") {
      const dayOfWeek = new Date(date).getDay();
      const recurringConflicts = bookedSlots.filter((booking) => {
        return (
          booking.lesson_type === "recurring" &&
          new Date(booking.lesson_date).getDay() === dayOfWeek &&
          booking.lesson_time.slice(0, 5) === time.slice(0, 5) &&
          booking.status !== "cancelled"
        );
      });

      if (recurringConflicts.length > 0) return false;
    }

    return !hasAnyActiveBooking;
  },
  [bookedSlots, user?.id, selectedService, lessonType]
);
```

### 5. Specialized Edge Function

**File**: `supabase/functions/create-recurring-payment/index.ts`

```typescript
// Handle recurring booking creation
if (is_recurring && recurring_dates && recurring_dates.length > 0) {
  const recurringSeriesId = `recurring_${user_info.id}_${Date.now()}`;

  // Create individual booking records for each date
  const bookingInserts = recurring_dates.map((lessonDate, index) => ({
    user_id: user_info.id,
    service_type: service,
    lesson_type: lesson_type,
    lesson_date: lessonDate,
    lesson_time: time,
    status: "scheduled",
    payment_status: "paid", // Recurring lessons paid upfront
    amount: Math.round(amount / total_lessons),
    recurring_session_number: index + 1,
    recurring_session_total: total_lessons,
    recurring_session_id: recurringSeriesId,
    // ... other fields
  }));

  await supabase.from("bookings").insert(bookingInserts);
}
```

### 6. Enhanced Dashboard Views

#### Student Dashboard

**File**: `src/pages/student/StudentBookingsPage.tsx`

- **Individual Cards**: Each recurring lesson appears as separate booking card
- **Series Information**: Shows lesson X of Y with series identifier
- **Visual Indicators**: Purple badges for recurring lessons
- **Payment Status**: Clear indication of payment processing

```tsx
{
  booking.recurring_session_number && booking.recurring_session_total && (
    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
      <Repeat className="h-3 w-3 mr-1" />
      Lesson {booking.recurring_session_number} of {booking.recurring_session_total}
    </Badge>
  );
}
```

#### Admin Dashboard

**File**: `src/pages/AdminBookingsPage.tsx`

- **Service Type Labels**: "Individual (Recurring)" for recurring lessons
- **Series Tracking**: Shows lesson progression and series ID
- **Bulk Management**: Individual sessions can be managed separately
- **Revenue Tracking**: Proper accounting for recurring series

## 💰 Pricing Structure

### Recurring Lessons Pricing

- **Price per lesson**: £0.30 (30 pence)
- **Payment model**: Full series paid upfront
- **Example**: 16 lessons = 16 × £0.30 = £4.80 total

### Payment Processing

- **Upfront payment**: Student pays for entire series immediately
- **Individual tracking**: Each lesson tracked separately for admin purposes
- **Automatic refunds**: 24-hour rule applies to individual lessons in series

## 🔧 Setup Instructions

### 1. Database Setup

```bash
# Run the migration
psql -f add_recurring_lessons_support.sql

# Test the functionality
psql -f test_recurring_lessons.sql
```

### 2. Edge Function Deployment

```bash
# Deploy the new recurring payment function
supabase functions deploy create-recurring-payment
```

### 3. Frontend Integration

- ✅ Enhanced service selection component
- ✅ Updated booking validation logic
- ✅ Improved dashboard displays
- ✅ Calendar blocking implementation

### 4. Testing Checklist

#### User Experience Testing

- [ ] Can select "Recurring Lessons" option
- [ ] 24-hour validation works for first lesson
- [ ] Calendar properly blocks weekly slots
- [ ] Payment processing completes successfully
- [ ] Dashboard shows individual lesson cards

#### Admin Testing

- [ ] Individual recurring lessons visible in admin panel
- [ ] Can delete individual lessons with proper refund handling
- [ ] Revenue calculations are accurate
- [ ] Export functionality includes recurring lesson details

#### Edge Cases

- [ ] Conflict detection prevents double booking
- [ ] Proper handling of cancelled lessons
- [ ] Series management when lessons are modified
- [ ] Refund processing for admin deletions

## 📊 Monitoring & Analytics

### Key Metrics to Track

- Number of recurring series created
- Average series length
- Completion rates for recurring students
- Revenue from recurring vs single lessons
- Cancellation patterns in recurring series

### Database Queries for Monitoring

```sql
-- Active recurring series
SELECT
  recurring_session_id,
  user_id,
  count(*) as total_lessons,
  count(*) FILTER (WHERE status = 'completed') as completed_lessons,
  min(lesson_date) as series_start,
  max(lesson_date) as series_end
FROM bookings
WHERE lesson_type = 'recurring'
  AND recurring_session_id IS NOT NULL
GROUP BY recurring_session_id, user_id;

-- Revenue analysis
SELECT
  'recurring' as booking_type,
  count(DISTINCT recurring_session_id) as series_count,
  count(*) as total_lessons,
  sum(amount) as total_revenue
FROM bookings
WHERE lesson_type = 'recurring';
```

## 🔄 Future Enhancements

### Phase 2 Features

- **Flexible End Dates**: Allow custom series end dates beyond Dec 2025
- **Mid-Series Modifications**: Change time/day for remaining lessons
- **Pause/Resume**: Temporarily pause recurring series
- **Payment Plans**: Split recurring payments over multiple installments

### Integration Opportunities

- **Calendar Integration**: Export to Google Calendar, Outlook
- **Notification System**: Automated reminders for recurring students
- **Progress Tracking**: Learning progression across recurring series
- **Advanced Analytics**: Student engagement metrics over time

## 📞 Support & Maintenance

### Common Issues

1. **Time Zone Handling**: Ensure consistent timezone across all date calculations
2. **Conflict Resolution**: Handle edge cases in recurring slot detection
3. **Payment Reconciliation**: Match individual lesson payments with series totals

### Maintenance Tasks

- Regular cleanup of completed recurring series
- Monitor for orphaned recurring session records
- Validate recurring series data integrity
- Update end date logic as needed (currently Dec 1, 2025)

This implementation provides a robust, scalable solution for recurring class bookings with comprehensive payment integration and user experience optimization.
