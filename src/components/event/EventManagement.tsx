import React, { useState, useEffect } from 'react';
import { useEventStore } from '../../stores/eventStore';
import { useTeamStore } from '../../stores/teamStore';
import { Calendar as CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function EventManagement() {
  const { events, createEvent, updateEvent } = useEventStore();
  const { teams } = useTeamStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    team_id: '',
    start_time: '',
    end_time: '',
    location: '',
    min_players: 1,
    max_players: null as number | null,
    description: ''
  });

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].id);
    }
  }, [teams]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...newEvent,
        team_id: selectedTeam
      });
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        team_id: '',
        start_time: '',
        end_time: '',
        location: '',
        min_players: 1,
        max_players: null,
        description: ''
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Event Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <CalendarIcon size={20} />
          Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{event.title}</h3>
              <p className="text-gray-400">
                {format(new Date(event.start_time), 'PPP')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock size={16} />
                <span>
                  {format(new Date(event.start_time), 'p')} - 
                  {format(new Date(event.end_time), 'p')}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-300">
                <Users size={16} />
                <span>
                  Min: {event.min_players}
                  {event.max_players && ` / Max: ${event.max_players}`}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => updateEvent(event.id, { is_confirmed: !event.is_confirmed })}
                className={`w-full px-4 py-2 rounded-md transition-colors ${
                  event.is_confirmed
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {event.is_confirmed ? 'Confirmed' : 'Confirm Event'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Team</label>
                <select
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  required
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.start_time}
                    onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Min Players</label>
                  <input
                    type="number"
                    value={newEvent.min_players}
                    onChange={e => setNewEvent({ ...newEvent, min_players: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Max Players</label>
                  <input
                    type="number"
                    value={newEvent.max_players || ''}
                    onChange={e => setNewEvent({ ...newEvent, max_players: parseInt(e.target.value) || null })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                    min={newEvent.min_players}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}