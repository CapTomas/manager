import React, { useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { useEventStore } from '../stores/eventStore';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  isAdmin?: boolean;
  onSelectSlot?: (start: Date, end: Date) => void;
}

export function Calendar({ isAdmin, onSelectSlot }: CalendarProps) {
  const { events } = useEventStore();

  const calendarEvents = useMemo(() => {
    return events.map(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      
      let className = '';
      const now = new Date();
      
      if (start < now) {
        className = event.is_confirmed ? 'event-attended' : 'event-missed';
      } else {
        className = event.is_confirmed ? 'event-upcoming' : 'event-pending';
      }

      return {
        id: event.id,
        title: event.title,
        start,
        end,
        className,
        resource: event,
      };
    });
  }, [events]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (onSelectSlot) {
      onSelectSlot(start, end);
    }
  };

  return (
    <div className="card h-[700px]">
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView={Views.WEEK}
        selectable={isAdmin}
        onSelectSlot={handleSelectSlot}
        tooltipAccessor={event => {
          const { resource } = event;
          return `${resource.title}\n${resource.location || 'No location'}\nMin players: ${resource.min_players}`;
        }}
        eventPropGetter={(event) => ({
          className: event.className,
        })}
      />
    </div>
  );
}