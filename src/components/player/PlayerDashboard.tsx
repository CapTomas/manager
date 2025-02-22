import React from 'react';
import { useTeamStore } from '../../stores/teamStore';
import { useEventStore } from '../../stores/eventStore';
import { Users, Calendar, Trophy, CheckCircle2, XCircle } from 'lucide-react';

interface AttendanceCircleProps {
  attended: boolean;
  date: string;
}

function AttendanceCircle({ attended, date }: AttendanceCircleProps) {
  return (
    <div 
      className={`attendance-circle ${attended ? 'attended' : 'missed'}`}
      title={`${attended ? 'Attended' : 'Missed'} on ${new Date(date).toLocaleDateString()}`}
    >
      {attended ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
    </div>
  );
}

export function PlayerDashboard() {
  const { teams } = useTeamStore();
  const { events } = useEventStore();

  // Mock data for attendance - replace with real data
  const recentAttendance = [
    { date: '2025-02-20', attended: true },
    { date: '2025-02-18', attended: false },
    { date: '2025-02-15', attended: true },
    { date: '2025-02-12', attended: true },
    { date: '2025-02-10', attended: false },
  ];

  const totalEvents = 25; // Replace with real count
  const attendedEvents = 20; // Replace with real count

  const nextWeekEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const now = new Date();
    const nextWeek = new Date(now.setDate(now.getDate() + 7));
    return eventDate <= nextWeek && eventDate >= now;
  });

  const nextConfirmedEvent = events.find(event => 
    event.is_confirmed && new Date(event.start_time) > new Date()
  );

  const pendingPayments = [
    { id: 1, event: 'Training Session', amount: 15 },
    { id: 2, event: 'Tournament Fee', amount: 30 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Recent Attendance</h3>
              <div className="flex gap-2 mt-3">
                {recentAttendance.map((record, i) => (
                  <AttendanceCircle 
                    key={i}
                    attended={record.attended}
                    date={record.date}
                  />
                ))}
              </div>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Events</h3>
              <p className="text-2xl font-bold text-white mt-2">
                {attendedEvents}/{totalEvents}
              </p>
              <p className="text-sm text-gray-400 mt-1">Events attended</p>
            </div>
            <Trophy className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300">My Teams</h3>
              <p className="text-2xl font-bold text-white mt-2">{teams.length}</p>
              <p className="text-sm text-gray-400 mt-1">Active teams</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Next Confirmed Event */}
      {nextConfirmedEvent && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Next Confirmed Event</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-200">{nextConfirmedEvent.title}</h3>
              <p className="text-gray-400">
                {new Date(nextConfirmedEvent.start_time).toLocaleDateString()} at{' '}
                {new Date(nextConfirmedEvent.start_time).toLocaleTimeString()}
              </p>
              {nextConfirmedEvent.location && (
                <p className="text-gray-400 mt-1">{nextConfirmedEvent.location}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">You're attending</span>
              <div className="attendance-circle attended">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Week's Events */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Vote for Next Week</h2>
        <div className="space-y-4">
          {nextWeekEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-background-hover rounded-lg">
              <div>
                <h3 className="font-medium text-gray-200">{event.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(event.start_time).toLocaleDateString()} • {event.location}
                </p>
                <p className="text-sm text-primary mt-1">
                  {event.min_players} players minimum
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">3/{event.max_players || '∞'}</span>
                <div className="flex gap-2">
                  <button className="btn-primary py-1.5">Attend</button>
                  <button className="btn-secondary py-1.5">Skip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-background-hover rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-200">{payment.event}</h3>
                  <p className="text-sm text-gray-400">Due amount: ${payment.amount}</p>
                </div>
                <button className="btn-primary py-1.5">Pay Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}