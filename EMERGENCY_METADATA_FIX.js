// TEMPORARY FIX - Ultra minimal metadata
// Replace the existing metadata section with this:

metadata: {
  user: user_info.id.substring(0, 10),
  type: booking_details.service.substring(0, 10), 
  count: totalBookings.toString(),
  recurring: bookingIds.length > 1 ? "yes" : "no"
}

// This keeps metadata under 100 characters total
