'use client'
import { EventClickArg, EventInput } from '@fullcalendar/core/index.js'
import allLocales from '@fullcalendar/core/locales-all'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
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
} from 'date-fns'
import './Calendar.css'

type EventFuncInfoProp = {
  start: Date
  end: Date
  startStr: string
  endStr: string
  timeZone: string
}

const Calendar = () => {
  const makeTwitterUrl = (start: string, end: string): string => {
    const url = encodeURI(
      `https://twitter.com/search?f=tweets&vertical=default&q=from:@tokino_sora since:${start} until:${end}`,
    )
    return url
  }

  const moveToTwitter = (e: EventClickArg): void => {
    e.jsEvent.preventDefault()
    if (e.event.url) {
      window.location.href = e.event.url
    }
  }

  const getEachWeeks = (start: Date, end: Date): Date[][] => {
    const thursdays = eachWeekOfInterval(
      {
        start: start,
        end: end,
      },
      {
        weekStartsOn: 4,
      },
    )

    return thursdays.map((thursday) => {
      return eachDayOfInterval({
        start: thursday,
        end: endOfWeek(thursday, { weekStartsOn: 4 }),
      })
    })
  }

  const makeEvents = (info: EventFuncInfoProp, successCallback: (e: EventInput[]) => void) => {
    let events: EventInput[] = []

    const current =
      format(info.start, 'yyyy-MM-dd') === '2017-09-07' || getDate(info.start) === 1
        ? info.start
        : startOfMonth(addMonths(info.start, 1))

    const start = isThursday(current) ? startOfMonth(current) : previousThursday(current)

    const tmpEnd = endOfMonth(current)
    const end = isWednesday(tmpEnd) ? tmpEnd : nextWednesday(tmpEnd)

    const eachWeeks = getEachWeeks(start, end)

    events.push(
      ...eachWeeks.map((week) => {
        const formatString = 'yyyy-MM-dd'
        const start = format(week[0], formatString)
        const end = format(addDays(week[week.length - 1], 1), formatString)
        const url = makeTwitterUrl(start, end)

        return {
          start: start,
          end: end,
          url: url,
        }
      }),
    )

    successCallback(events)
  }

  return (
    <FullCalendar
      headerToolbar={{
        left: 'prevYear prev',
        center: 'title',
        right: 'next nextYear',
      }}
      titleFormat={{
        year: 'numeric',
        month: '2-digit',
      }}
      dayCellContent={(e) => (e.dayNumberText = e.dayNumberText.replace('日', ''))}
      validRange={() => {
        return { start: '2017-09-07', end: new Date() }
      }}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locales={allLocales}
      locale="ja"
      businessHours={true}
      eventClick={moveToTwitter}
      events={makeEvents}
    />
  )
}

export default Calendar
