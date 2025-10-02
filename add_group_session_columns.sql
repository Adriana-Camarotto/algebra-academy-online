-- Add columns to track group session information
-- This allows group bookings to be split into individual sessions that appear separately in the dashboard

-- Add columns for group session tracking
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS group_session_number INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS group_session_total INTEGER DEFAULT NULL;

-- Add comments to explain the new columns
COMMENT ON COLUMN bookings.group_session_number IS 'For group sessions: which session this is (1-6)';
COMMENT ON COLUMN bookings.group_session_total IS 'For group sessions: total number of sessions in the group';

-- Create an index on group session columns for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_group_session 
ON bookings(group_session_number, group_session_total)
WHERE group_session_number IS NOT NULL;

-- Add a constraint to ensure valid group session numbers
ALTER TABLE bookings 
ADD CONSTRAINT IF NOT EXISTS chk_group_session_number 
CHECK (
  (group_session_number IS NULL AND group_session_total IS NULL) OR
  (group_session_number > 0 AND group_session_total > 0 AND group_session_number <= group_session_total)
);
