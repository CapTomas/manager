import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Event, EventAttendance, EventComment, EventPayment } from '../types';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  attendances: EventAttendance[];
  comments: EventComment[];
  payments: EventPayment[];
  isLoading: boolean;
  error: string | null;
  fetchTeamEvents: (teamId: string) => Promise<void>;
  createEvent: (event: Partial<Event>) => Promise<Event>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  updateAttendance: (eventId: string, status: 'attending' | 'not_attending') => Promise<void>;
  addComment: (eventId: string, comment: string, rating?: number) => Promise<void>;
  createPayment: (eventId: string, amount: number) => Promise<void>;
  updatePaymentStatus: (paymentId: string, status: 'paid' | 'refunded') => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  attendances: [],
  comments: [],
  payments: [],
  isLoading: false,
  error: null,

  fetchTeamEvents: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('team_id', teamId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      set({ events: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createEvent: async (event: Partial<Event>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...event, created_by: supabase.auth.user()?.id }])
        .select()
        .single();

      if (error) throw error;

      const { events } = get();
      set({ events: [...events, data], isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateEvent: async (eventId: string, updates: Partial<Event>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId);

      if (error) throw error;

      const { events } = get();
      set({
        events: events.map(event => 
          event.id === eventId ? { ...event, ...updates } : event
        ),
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateAttendance: async (eventId: string, status: 'attending' | 'not_attending') => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_attendance')
        .upsert([{
          event_id: eventId,
          user_id: supabase.auth.user()?.id,
          status
        }], {
          onConflict: 'event_id,user_id'
        });

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  addComment: async (eventId: string, comment: string, rating?: number) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_comments')
        .insert([{
          event_id: eventId,
          user_id: supabase.auth.user()?.id,
          comment,
          rating
        }]);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  createPayment: async (eventId: string, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_payments')
        .insert([{
          event_id: eventId,
          user_id: supabase.auth.user()?.id,
          amount,
          status: 'pending'
        }]);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updatePaymentStatus: async (paymentId: string, status: 'paid' | 'refunded') => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('event_payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));