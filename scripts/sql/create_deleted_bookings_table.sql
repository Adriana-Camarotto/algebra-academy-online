-- Create deleted_bookings table to store deleted bookings for audit purposes
CREATE TABLE deleted_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_booking_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  service_type TEXT NOT NULL,
  lesson_type TEXT,
  lesson_date DATE NOT NULL,
  lesson_time TIME NOT NULL,
  lesson_day TEXT,
  status TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_by UUID REFERENCES auth.users(id),
  group_session_number INTEGER,
  group_session_total INTEGER,
  recurring_session_number INTEGER,
  recurring_session_total INTEGER
);

-- Enable Row Level Security
ALTER TABLE deleted_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for admins and tutors to view deleted bookings
CREATE POLICY "Allow admins and tutors to view deleted bookings" ON deleted_bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR users.role = 'tutor')
    )
  );

-- Create policy for admins and tutors to insert deleted bookings
CREATE POLICY "Allow admins and tutors to insert deleted bookings" ON deleted_bookings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR users.role = 'tutor')
    )
  );

-- Create index for better performance
CREATE INDEX idx_deleted_bookings_original_id ON deleted_bookings(original_booking_id);
CREATE INDEX idx_deleted_bookings_deleted_at ON deleted_bookings(deleted_at);
CREATE INDEX idx_deleted_bookings_deleted_by ON deleted_bookings(deleted_by);

COMMENT ON TABLE deleted_bookings IS 'Stores deleted bookings for audit and recovery purposes';
