-- Add preferences JSONB column to users table
alter table public.users
  add column if not exists preferences jsonb not null default '{}'::jsonb;

-- Policy: Users can update their own preferences
-- (The existing users_update_own_profile policy already covers this if it allows updating all columns)
-- Let's ensure a specific policy exists or the general one is sufficient.
-- The current policy is: auth.uid() = id for update.

-- Enable RLS on users if not already (it should be)
alter table public.users enable row level security;
