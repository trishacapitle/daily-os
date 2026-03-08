"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";

import { useRouter } from "next/navigation";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  name: string;
  time: string;
  datetime: string;
}

interface CalendarData {
  day: Date;
  events: Event[];
}

interface FullScreenCalendarProps {
  data: CalendarData[];
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  );

  const router = useRouter();

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">
          {format(firstDayCurrentMonth, "MMMM yyyy")}
        </h2>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={previousMonth}>
            <ChevronLeftIcon size={16} />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              goToToday();

              router.push(
                `/dashboard/${format(today, "yyyy")}/${format(today, "MM")}/${format(today, "dd")}`,
              );
            }}
          >
            Today
          </Button>

          <Button size="icon" variant="outline" onClick={nextMonth}>
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="bg-muted/40 grid grid-cols-7 border-b font-medium">
        {weekdays.map((day) => (
          <div key={day} className="border-r py-2 text-center last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid auto-rows-[120px] grid-cols-7">
        {days.map((day, dayIdx) => (
          <DayCell
            key={day.toISOString()}
            day={day}
            dayIdx={dayIdx}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            currentMonth={firstDayCurrentMonth}
            data={data}
          />
        ))}
      </div>
    </div>
  );
}

interface DayCellProps {
  day: Date;
  dayIdx: number;
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
  currentMonth: Date;
  data: CalendarData[];
}

function DayCell({
  day,
  dayIdx,
  setSelectedDay,
  currentMonth,
  data,
}: DayCellProps) {
  const router = useRouter();
  const events = data
    .filter((d) => isSameDay(d.day, day))
    .flatMap((d) => d.events);

  return (
    <button
      onClick={() => {
        setSelectedDay(day);

        router.push(
          `/dashboard/${format(day, "yyyy")}/${format(day, "MM")}/${format(day, "dd")}`,
        );
      }}
      className={cn(
        dayIdx === 0 && colStartClasses[getDay(day)],
        "hover:bg-muted/50 flex flex-col border-r border-b p-2 text-left",
        !isSameMonth(day, currentMonth) && "bg-accent/40 text-muted-foreground",
      )}
    >
      <div className="flex justify-between">
        <time
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xl",
            isToday(day) && "bg-primary text-primary-foreground font-semibold",
          )}
        >
          {format(day, "d")}
        </time>
      </div>

      <div className="mt-2 space-y-1 text-sm">
        {events.slice(0, 1).map((event) => (
          <div
            key={event.id}
            className="bg-muted truncate rounded-full border px-2 py-1"
          >
            {event.name}
          </div>
        ))}

        {events.length > 1 && (
          <span className="text-muted-foreground truncate">
            +{events.length - 1} more
          </span>
        )}
      </div>
    </button>
  );
}
