/*
  # Team Management Schema

  1. New Tables
    - `teams`
      - Basic team info (name, logo, sport)
      - Team settings and configuration
    - `team_members`
      - Team membership and roles
    - Enhanced `events` table
      - Added team relationship
      - Added location, min players, etc.
    - `event_comments`
      - Post-event feedback and comments
    - `event_payments`
      - Payment tracking for events
    - `team_chat`
      - Team communication

  2. Security
    - Enable RLS on all tables
    - Team-based access control
    - Role-based permissions
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  sport text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  invite_code text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  description text,
  location text
);

-- Create team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'player')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enhance events table with new columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS min_players integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_players integer,
ADD COLUMN IF NOT EXISTS vote_deadline timestamptz,
ADD COLUMN IF NOT EXISTS is_confirmed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false;

-- Create event comments table
CREATE TABLE IF NOT EXISTS event_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  comment text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create event payments table
CREATE TABLE IF NOT EXISTS event_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount decimal NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team chat table
CREATE TABLE IF NOT EXISTS team_chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Anyone can read teams"
  ON teams FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Team admins can manage teams"
  ON teams FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
    )
  );

-- Team members policies
CREATE POLICY "Team members can read team members"
  ON team_members FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can manage team members"
  ON team_members FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_members.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
    )
  );

-- Event comments policies
CREATE POLICY "Team members can read event comments"
  ON event_comments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN team_members tm ON tm.team_id = e.team_id
      WHERE e.id = event_comments.event_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their comments"
  ON event_comments FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Event payments policies
CREATE POLICY "Users can see their payments"
  ON event_payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their payments"
  ON event_payments FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Team chat policies
CREATE POLICY "Team members can read chat"
  ON team_chat FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_chat.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can send messages"
  ON team_chat FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_chat.team_id
      AND team_members.user_id = auth.uid()
    )
  );