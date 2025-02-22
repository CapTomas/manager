import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Team, TeamMember } from '../types';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  createTeam: (team: Partial<Team>) => Promise<Team>;
  joinTeam: (inviteCode: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  teamMembers: [],
  isLoading: false,
  error: null,

  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: teamMemberships, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', supabase.auth.user()?.id);

      if (membershipError) throw membershipError;

      const teamIds = teamMemberships.map(tm => tm.team_id);
      
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);

      if (teamsError) throw teamsError;
      
      set({ teams, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTeam: async (team: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ ...team, created_by: supabase.auth.user()?.id }])
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin
      await supabase
        .from('team_members')
        .insert([{
          team_id: data.id,
          user_id: supabase.auth.user()?.id,
          role: 'admin'
        }]);

      const { teams } = get();
      set({ teams: [...teams, data], isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  joinTeam: async (inviteCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

      if (teamError) throw teamError;

      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: team.id,
          user_id: supabase.auth.user()?.id,
          role: 'player'
        }]);

      if (memberError) throw memberError;

      const { teams } = get();
      set({ teams: [...teams, team], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchTeamMembers: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:auth.users(email)
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      
      set({ teamMembers: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTeam: async (teamId: string, updates: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', teamId);

      if (error) throw error;

      const { teams } = get();
      set({
        teams: teams.map(team => 
          team.id === teamId ? { ...team, ...updates } : team
        ),
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));