export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  sport: string;
  created_by: string;
  created_at: string;
  invite_code: string;
  description: string | null;
  location: string | null;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'player';
  joined_at: string;
}

export interface Event {
  id: string;
  title: string;
  team_id: string;
  start_time: string;
  end_time: string;
  location: string | null;
  min_players: number;
  max_players: number | null;
  vote_deadline: string | null;
  is_confirmed: boolean;
  description: string | null;
  reminder_sent: boolean;
  created_by: string;
  created_at: string;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string;
  status: 'attending' | 'not_attending';
  created_at: string;
}

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  comment: string;
  rating: number | null;
  created_at: string;
}

export interface EventPayment {
  id: string;
  event_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  team_id: string;
  user_id: string;
  message: string;
  created_at: string;
}