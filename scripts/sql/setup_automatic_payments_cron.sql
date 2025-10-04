-- Setup automatic payment processing for group sessions
-- This creates a cron job that runs daily to process payments 24 hours before each group session

-- First, ensure we have the pg_cron extension enabled
-- Note: This needs to be run by a superuser or database owner
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call our Edge Function for automatic payments
CREATE OR REPLACE FUNCTION process_group_session_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the Edge Function to process automatic payments
  -- This will handle group sessions that need payment processing
  PERFORM net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/process-automatic-payments',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'source', 'cron_job',
      'timestamp', now()
    )
  );
  
  -- Log the execution
  RAISE LOG 'Automatic payment processing job executed at %', now();
END;
$$;

-- Schedule the function to run daily at 9:00 AM
-- This will process payments for group sessions happening the next day
SELECT cron.schedule(
  'process-group-payments',
  '0 9 * * *',  -- Daily at 9:00 AM
  $$SELECT process_group_session_payments();$$
);

-- Alternative: Schedule to run multiple times per day for better coverage
-- Run at 9 AM, 12 PM, 3 PM, and 6 PM
SELECT cron.schedule(
  'process-group-payments-frequent',
  '0 9,12,15,18 * * *',  -- Multiple times daily
  $$SELECT process_group_session_payments();$$
);

-- Add additional columns for tracking automatic payments
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_processed_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_error TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS can_cancel_until TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cancellation_fee INTEGER DEFAULT NULL;

-- Add comments for new columns
COMMENT ON COLUMN bookings.payment_processed_at IS 'When automatic payment was processed';
COMMENT ON COLUMN bookings.payment_intent_id IS 'Stripe payment intent ID for the session';
COMMENT ON COLUMN bookings.payment_error IS 'Error message if payment failed';
COMMENT ON COLUMN bookings.can_cancel_until IS 'Latest time student can cancel without charge';
COMMENT ON COLUMN bookings.cancellation_fee IS 'Fee charged for late cancellations (in pence)';

-- Create index for payment tracking queries
CREATE INDEX IF NOT EXISTS idx_bookings_payment_tracking 
ON bookings(payment_processed_at, payment_status, lesson_date)
WHERE service_type = 'group';

-- Update existing group session bookings to set cancellation deadline
UPDATE bookings 
SET can_cancel_until = (lesson_date || ' ' || lesson_time)::timestamp - interval '24 hours'
WHERE service_type = 'group' 
AND can_cancel_until IS NULL 
AND lesson_date >= CURRENT_DATE;

-- View existing cron jobs (for verification)
-- SELECT * FROM cron.job;

-- To remove a cron job if needed:
-- SELECT cron.unschedule('process-group-payments');
-- SELECT cron.unschedule('process-group-payments-frequent');
