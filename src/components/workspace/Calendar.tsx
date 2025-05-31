import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarProps {
  appointments: Array<{
    title: string;
    start: Date;
    end: Date;
    category: string;
    mode: string;
  }>;
  onSelectSlot: (slotInfo: any) => void;
  onSelectEvent: (event: any) => void;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, onSelectSlot, onSelectEvent }) => {
  return (
    <div className="h-[600px] p-4">
      <BigCalendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'day']}
      />
    </div>
  )
}

export default Calendar