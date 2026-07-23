/* Opening-hours logic. All "now" calculations are done in the salon's
   configured timezone (Asia/Kolkata) regardless of the visitor's device
   timezone, using Intl — no external API, no libraries. */
import { business, type OpeningHours } from "../config/business";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

/** Parts of "now" as seen in the salon's timezone. */
function nowInSalonTz(now = new Date()): { dayIndex: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: business.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  let hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  // Intl can emit "24" at midnight in hour23 mode — normalise to 0.
  if (hour === 24) hour = 0;
  const shortToIndex: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return { dayIndex: shortToIndex[weekday] ?? 0, minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** 24h "HH:MM" → "9:30 AM" style label. */
export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function todayKey(now = new Date()): DayKey {
  return DAY_KEYS[nowInSalonTz(now).dayIndex];
}

export interface OpenState {
  isOpen: boolean;
  /** true when open and within 60 minutes of closing */
  closingSoon: boolean;
  /** label for the next transition, e.g. "Opens 9:30 AM" / "Closes 10:30 PM" */
  detail: string;
}

/** Compute open/closed purely from the configured weekly schedule. */
export function getOpenState(now = new Date()): OpenState {
  const { dayIndex, minutes } = nowInSalonTz(now);
  const key = DAY_KEYS[dayIndex];
  const hours: OpeningHours | undefined = business.openingHours[key];

  if (hours) {
    const opens = toMinutes(hours.opens);
    const closes = toMinutes(hours.closes);
    if (minutes >= opens && minutes < closes) {
      return {
        isOpen: true,
        closingSoon: closes - minutes <= 60,
        detail: `Closes ${formatTime12(hours.closes)}`,
      };
    }
    if (minutes < opens) {
      return {
        isOpen: false,
        closingSoon: false,
        detail: `Opens ${formatTime12(hours.opens)}`,
      };
    }
  }

  // Closed for the rest of today — find the next day that has hours.
  for (let i = 1; i <= 7; i++) {
    const nextKey = DAY_KEYS[(dayIndex + i) % 7];
    const next = business.openingHours[nextKey];
    if (next) {
      const dayWord = i === 1 ? "tomorrow" : DAY_LABELS[nextKey];
      return {
        isOpen: false,
        closingSoon: false,
        detail: `Opens ${dayWord} ${formatTime12(next.opens)}`,
      };
    }
  }
  return { isOpen: false, closingSoon: false, detail: "Closed" };
}

export interface WeekRow {
  key: DayKey;
  label: string;
  opens: string; // 12h
  closes: string; // 12h
  isToday: boolean;
}

/** Ordered Monday→Sunday rows for the schedule table. */
export function getWeekRows(now = new Date()): WeekRow[] {
  const order: DayKey[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const tKey = todayKey(now);
  return order.map((key) => {
    const h = business.openingHours[key];
    return {
      key,
      label: DAY_LABELS[key],
      opens: h ? formatTime12(h.opens) : "Closed",
      closes: h ? formatTime12(h.closes) : "",
      isToday: key === tKey,
    };
  });
}
