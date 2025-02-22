/*
  # Create events and attendance tables

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `event_attendance`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Events:
      - Everyone can read
      - Only admins can create/update/delete
    - Event attendance:
      - Everyone can read
      - Users can manage their own attendance
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create event attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL CHECK (status IN ('attending', 'not_attending')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Everyone can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'isAdmin' = 'true');

CREATE POLICY "Admins can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'isAdmin' = 'true')
  WITH CHECK ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'isAdmin' = 'true');

CREATE POLICY "Admins can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'isAdmin' = 'true');

-- Event attendance policies
CREATE POLICY "Everyone can read attendance"
  ON event_attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their attendance"
  ON event_attendance
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);