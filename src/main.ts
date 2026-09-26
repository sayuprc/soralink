import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isThursday,
  isWednesday,
  nextWednesday,
  previousThursday,
  startOfMonth,
} from 'date-fns';
import { Calendar, type EventClickInfo, type EventInput, type EventSourceFuncInfo } from 'fullcalendar';
import dayGridPlugin from 'fullcalendar/daygrid';
import jaLocale from 'fullcalendar/locales/ja';
import classicThemePlugin from 'fullcalendar/themes/classic';
import 'fullcalendar/skeleton.css';
import 'fullcalendar/themes/classic/theme.css';
import 'fullcalendar/themes/classic/palette.css';
import './styles.css';

const calendarElement = document.querySelector<HTMLElement>('#calendar');

if (!calendarElement) {
  throw new Error('カレンダーの表示先が見つかりません');
}

const makeTwitterUrl = (start: string, end: string): string =>
  encodeURI(`https://twitter.com/search?f=tweets&vertical=default&q=from:@tokino_sora since:${start} until:${end}`);

const moveToTwitter = (event: EventClickInfo): void => {
  event.jsEvent.preventDefault();

  if (event.event.url) {
    window.location.href = event.event.url;
  }
};

const getEachWeeks = (start: Date, end: Date): Date[][] => {
  const thursdays = eachWeekOfInterval({ start, end }, { weekStartsOn: 4 });

  return thursdays.map((thursday) =>
    eachDayOfInterval({
      start: thursday,
      end: endOfWeek(thursday, { weekStartsOn: 4 }),
    }),
  );
};

const makeEvents = (info: EventSourceFuncInfo, successCallback: (events: EventInput[]) => void): void => {
  const current =
    format(info.start, 'yyyy-MM-dd') === '2017-09-07' || getDate(info.start) === 1
      ? info.start
      : startOfMonth(addMonths(info.start, 1));
  const start = isThursday(current) ? startOfMonth(current) : previousThursday(current);
  const monthEnd = endOfMonth(current);
  const end = isWednesday(monthEnd) ? monthEnd : nextWednesday(monthEnd);

  const events = getEachWeeks(start, end).map((week) => {
    const start = format(week[0], 'yyyy-MM-dd');
    const end = format(addDays(week[week.length - 1], 1), 'yyyy-MM-dd');

    return { start, end, url: makeTwitterUrl(start, end) };
  });

  successCallback(events);
};

const calendar = new Calendar(calendarElement, {
  headerToolbar: {
    left: 'prevYear prev',
    center: 'title',
    right: 'next nextYear',
  },
  titleFormat: {
    year: 'numeric',
    month: '2-digit',
  },
  dayCellTopContent: (info) => info.dayNumberText.replace('日', ''),
  validRange: () => ({ start: '2017-09-07', end: new Date() }),
  plugins: [dayGridPlugin, classicThemePlugin],
  initialView: 'dayGridMonth',
  locales: [jaLocale],
  locale: 'ja',
  businessHours: true,
  eventClick: moveToTwitter,
  events: makeEvents,
});

calendar.render();
