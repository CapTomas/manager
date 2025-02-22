import React, { useState } from 'react';
import { useTeamStore } from '../../stores/teamStore';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Share2, Users } from 'lucide-react';

export function TeamManagement() {
  const { teams, createTeam } = useTeamStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: 'Floorball',
    description: '',
    location: ''
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam(newTeam);
      setShowCreateModal(false);
      setNewTeam({ name: '', sport: 'Floorball', description: '', location: '' });
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Create Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                <p className="text-gray-400">{team.sport}</p>
              </div>
              {team.logo_url && (
                <img
                  src={team.logo_url}
                  alt={`${team.name} logo`}
                  className="w-12 h-12 rounded-full"
                />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={16} />
              <span>Members</span>
            </div>

            {team.location && (
              <p className="text-gray-400 text-sm">
                Location: {team.location}
              </p>
            )}

            <div className="pt-4 flex justify-between">
              <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                <Share2 size={16} />
                Share Invite
              </button>
              <QRCodeSVG
                value={`${window.location.origin}/join/${team.invite_code}`}
                size={32}
                className="bg-white p-1 rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Sport</label>
                <input
                  type="text"
                  value={newTeam.sport}
                  onChange={e => setNewTeam({ ...newTeam, sport: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={newTeam.location}
                  onChange={e => setNewTeam({ ...newTeam, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}