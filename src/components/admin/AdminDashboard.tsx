import React, { useState } from 'react';
import { Calendar } from '../Calendar';
import { useTeamStore } from '../../stores/teamStore';
import { useEventStore } from '../../stores/eventStore';
import { 
  Users, 
  CalendarDays, 
  Trophy,
  Plus,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

export function AdminDashboard() {
  const { teams, createTeam } = useTeamStore();
  const { events, createEvent } = useEventStore();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const confirmedEvents = events.filter(e => e.is_confirmed);
  const pendingEvents = events.filter(e => !e.is_confirmed);
  const totalPlayers = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEvent(eventData);
      setShowCreateEventModal(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleSlotSelect = (start: Date, end: Date) => {
    setSelectedSlot({ start, end });
    setShowCreateEventModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateEventModal(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Teams</h3>
              <p className="text-2xl font-bold text-white mt-2">{teams.length}</p>
              <p className="text-sm text-gray-400 mt-1">Active teams</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Players</h3>
              <p className="text-2xl font-bold text-white mt-2">{totalPlayers}</p>
              <p className="text-sm text-gray-400 mt-1">Across all teams</p>
            </div>
            <Trophy className="w-8 h-8 text-secondary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Confirmed Events</h3>
              <p className="text-2xl font-bold text-white mt-2">{confirmedEvents.length}</p>
              <p className="text-sm text-gray-400 mt-1">Ready to go</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Pending Events</h3>
              <p className="text-2xl font-bold text-white mt-2">{pendingEvents.length}</p>
              <p className="text-sm text-gray-400 mt-1">Awaiting confirmation</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <Calendar isAdmin onSelectSlot={handleSlotSelect} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Events</h2>
          <div className="space-y-4">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-background-hover rounded-lg">
                <div className="flex items-center gap-3">
                  {event.is_confirmed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-200">{event.title}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(event.start_time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {event.location}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Teams</h2>
          <div className="space-y-4">
            {teams.slice(0, 5).map(team => (
              <div key={team.id} className="flex items-center justify-between p-4 bg-background-hover rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">{team.name}</h3>
                    <p className="text-sm text-gray-400">{team.sport}</p>
                  </div>
                </div>
                <button className="btn-secondary py-1.5">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}