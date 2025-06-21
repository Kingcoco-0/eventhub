/*
  # Update users table for authentication integration

  1. Changes
    - Ensure the users table is properly set up for authentication
    - Add any missing columns or constraints
    - Update RLS policies for proper access control

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users to read/update their own data
    - Add policy for users to read basic info of other users
*/

-- Ensure the users table has all necessary columns
DO $$
BEGIN
  -- Check if avatar_url column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
  END IF;

  -- Ensure updated_at has a default value
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'updated_at' AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can read other users basic info" ON users;

-- Create updated RLS policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read other users basic info"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure the trigger function exists for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the updated_at trigger exists
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();