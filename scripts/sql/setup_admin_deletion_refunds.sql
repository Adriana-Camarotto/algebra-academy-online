-- Setup for Admin Delete Booking Edge Function with Automatic Refunds
-- This extends the payment system to handle admin/tutor deletions with automatic refund processing

-- Grant necessary permissions for the edge function
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT ALL ON public.payment_logs TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;

-- Update payment_logs table to handle admin deletion audit trail (if not already done)
DO $$
BEGIN
    -- Add column for admin deletion tracking if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_logs' 
        AND column_name = 'stripe_response'
    ) THEN
        ALTER TABLE public.payment_logs 
        ADD COLUMN stripe_response JSONB DEFAULT '{}';
    END IF;
END $$;

-- Create index for efficient admin deletion queries
CREATE INDEX IF NOT EXISTS idx_payment_logs_admin_deletion 
ON public.payment_logs (status, created_at) 
WHERE status LIKE '%admin_deleted%';

-- Create index for booking lookup by lesson timing (for refund eligibility)
CREATE INDEX IF NOT EXISTS idx_bookings_lesson_timing 
ON public.bookings (lesson_date, lesson_time, payment_status, status);

-- Create function to check if admin/tutor deletion should trigger automatic refund
CREATE OR REPLACE FUNCTION check_admin_deletion_refund_eligibility(
    p_lesson_date DATE,
    p_lesson_time TIME,
    p_payment_status TEXT,
    p_booking_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    lesson_datetime TIMESTAMP;
    twenty_four_hours_before TIMESTAMP;
    current_time TIMESTAMP;
    is_within_payment_window BOOLEAN;
    should_auto_refund BOOLEAN;
BEGIN
    -- Calculate lesson datetime and payment window
    lesson_datetime := (p_lesson_date || ' ' || p_lesson_time)::TIMESTAMP;
    twenty_four_hours_before := lesson_datetime - INTERVAL '24 hours';
    current_time := NOW();
    
    -- Check if we're within the 24-hour payment window
    is_within_payment_window := (current_time >= twenty_four_hours_before AND current_time < lesson_datetime);
    
    -- Auto-refund criteria:
    -- 1. Within 24-hour payment window
    -- 2. Payment has been processed (paid/completed)
    -- 3. Booking is not already cancelled
    should_auto_refund := (
        is_within_payment_window AND 
        (p_payment_status = 'paid' OR p_payment_status = 'completed') AND
        p_booking_status != 'cancelled'
    );
    
    RETURN jsonb_build_object(
        'lesson_datetime', lesson_datetime,
        'twenty_four_hours_before', twenty_four_hours_before,
        'current_time', current_time,
        'is_within_payment_window', is_within_payment_window,
        'should_auto_refund', should_auto_refund,
        'payment_status', p_payment_status,
        'booking_status', p_booking_status
    );
END;
$$;

-- Test the refund eligibility function (can be run manually to verify)
-- SELECT check_admin_deletion_refund_eligibility(
--     CURRENT_DATE + INTERVAL '12 hours', -- lesson tomorrow at noon
--     '12:00:00',
--     'paid',
--     'scheduled'
-- );

-- Add admin deletion tracking view for reporting
CREATE OR REPLACE VIEW admin_deletion_summary AS
SELECT 
    booking_id,
    user_id,
    amount,
    currency,
    status,
    stripe_response->>'admin_user_id' AS admin_user_id,
    stripe_response->>'admin_role' AS admin_role,
    (stripe_response->>'within_payment_window')::BOOLEAN AS within_payment_window,
    (stripe_response->>'refund_processed')::BOOLEAN AS refund_processed,
    stripe_response->>'refund_id' AS stripe_refund_id,
    TO_TIMESTAMP(stripe_response->>'deletion_timestamp', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS deletion_timestamp,
    created_at
FROM payment_logs 
WHERE status IN ('admin_deleted', 'admin_deleted_refunded')
ORDER BY created_at DESC;

-- Grant permissions for the view
GRANT SELECT ON admin_deletion_summary TO authenticated;

-- Create function to get admin deletion statistics
CREATE OR REPLACE FUNCTION get_admin_deletion_stats(
    p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE,
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    total_deletions INTEGER;
    deletions_with_refund INTEGER;
    total_refund_amount NUMERIC;
    avg_refund_amount NUMERIC;
BEGIN
    -- Get deletion statistics
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE refund_processed = true),
        COALESCE(SUM(amount) FILTER (WHERE refund_processed = true), 0) / 100.0,
        COALESCE(AVG(amount) FILTER (WHERE refund_processed = true), 0) / 100.0
    INTO 
        total_deletions,
        deletions_with_refund,
        total_refund_amount,
        avg_refund_amount
    FROM admin_deletion_summary
    WHERE deletion_timestamp::DATE BETWEEN p_start_date AND p_end_date;
    
    RETURN jsonb_build_object(
        'period_start', p_start_date,
        'period_end', p_end_date,
        'total_admin_deletions', total_deletions,
        'deletions_with_automatic_refund', deletions_with_refund,
        'refund_rate_percentage', CASE 
            WHEN total_deletions > 0 THEN ROUND((deletions_with_refund::NUMERIC / total_deletions * 100), 2)
            ELSE 0
        END,
        'total_refund_amount_gbp', total_refund_amount,
        'average_refund_amount_gbp', avg_refund_amount
    );
END;
$$;

-- Example usage:
-- SELECT get_admin_deletion_stats(); -- Last 30 days
-- SELECT get_admin_deletion_stats('2024-01-01', '2024-12-31'); -- Specific period

COMMENT ON FUNCTION check_admin_deletion_refund_eligibility IS 
'Determines if an admin/tutor deletion should trigger automatic refund based on 24-hour payment window rules';

COMMENT ON VIEW admin_deletion_summary IS 
'Summary view of all admin/tutor booking deletions with refund tracking for audit purposes';

COMMENT ON FUNCTION get_admin_deletion_stats IS 
'Returns statistical summary of admin deletions and automatic refunds for a given period';
