export const days = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export type Day = (typeof days)[number];

export function calculateGross(day: Day, basePay: number, hours: number, publicHoliday = false) {
  if (!days.includes(day) || !Number.isFinite(basePay) || basePay < 0 ||
    !Number.isFinite(hours) || hours < 0 || hours > 24) {
    throw new RangeError("Enter a valid day, nonnegative pay, and hours from 0 to 24.");
  }

  const weekend = day === "Saturday" || day === "Sunday";
  const regularHours = publicHoliday || weekend ? 0 : Math.min(hours, 8);
  const overtimeHours = hours - regularHours;
  const overtime150Hours = publicHoliday ? 0 : Math.min(overtimeHours, weekend ? 3 : 2);
  const overtime200Hours = overtimeHours - overtime150Hours;
  const overtime150Rate = basePay * 1.5;
  const overtime200Rate = basePay * 2;
  const regularPay = regularHours * basePay;
  const overtime150Pay = overtime150Hours * overtime150Rate;
  const overtime200Pay = overtime200Hours * overtime200Rate;
  const overtimePay = overtime150Pay + overtime200Pay;
  const gross = regularPay + overtimePay;

  if (![overtime150Rate, overtime200Rate, regularPay, overtime150Pay,
    overtime200Pay, overtimePay, gross].every(Number.isFinite)) {
    throw new RangeError("This pay is too large to calculate. Enter a smaller hourly pay.");
  }

  return { day, basePay, hours, regularHours, overtimeHours,
    overtime150Hours, overtime200Hours, overtime150Pay, overtime200Pay,
    regularPay, overtimePay, gross };
}

export function validateInputs(pay: string, hours: string) {
  const errors: { pay?: string; hours?: string } = {};
  if (!pay.trim() || !Number.isFinite(Number(pay)) || Number(pay) < 0) {
    errors.pay = "Enter a finite hourly pay of 0 or more.";
  }
  if (!hours.trim() || !Number.isFinite(Number(hours)) || Number(hours) < 0 || Number(hours) > 24) {
    errors.hours = "Enter hours between 0 and 24.";
  }
  return errors;
}

export type Shift = { start: number; end: number; status: "draft" | "worked" | "skipped"; touched?: boolean; publicHoliday?: boolean };

export type WeekForm = {
  shifts: Shift[];
  remembered: { start: number; end: number };
};

export function freshWeek(): WeekForm {
  const remembered = { start: 540, end: 1020 };
  return {
    remembered,
    shifts: days.map(() => ({ ...remembered, status: "draft", touched: false, publicHoliday: false })),
  };
}

export function updateShiftTime(form: WeekForm, index: number, key: "start" | "end", value: number): WeekForm {
  return {
    ...form,
    shifts: form.shifts.map((shift, dayIndex) => dayIndex === index
      ? { ...shift, [key]: value, status: "draft", touched: true }
      : shift),
  };
}

export function updateShiftHoliday(form: WeekForm, index: number, publicHoliday: boolean): WeekForm {
  return {
    ...form,
    shifts: form.shifts.map((shift, dayIndex) => dayIndex === index
      ? { ...shift, publicHoliday, status: "draft", touched: true }
      : shift),
  };
}

export function saveShift(form: WeekForm, index: number, status: "worked" | "skipped"): WeekForm {
  const current = form.shifts[index];
  if (status === "worked") shiftHours(current.start, current.end);
  const remembered = status === "worked"
    ? { start: current.start, end: current.end }
    : form.remembered;
  return {
    remembered,
    shifts: form.shifts.map((shift, dayIndex) => {
      if (dayIndex === index) return { ...shift, status };
      if (dayIndex > index && shift.status === "draft" && !shift.touched) {
        return { ...shift, ...remembered };
      }
      return shift;
    }),
  };
}

const audFormatter = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export const money = (value: number) => audFormatter.format(value);

export const clockInput = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function timeInputMinutes(value: string, key: "start" | "end") {
  if (!/^\d{2}:\d{2}$/.test(value)) return undefined;
  const [hours, minutes] = value.split(":").map(Number);
  if (hours > 23 || minutes > 59) return undefined;
  return key === "end" && hours === 0 && minutes === 0 ? 1440 : hours * 60 + minutes;
}

export function shiftHours(start: number, end: number) {
  if (![start, end].every((value) => Number.isInteger(value) && value % 15 === 0) ||
    start < 0 || end > 1440 || start >= end) {
    throw new RangeError("Choose an end after the start, in 15-minute increments, within the same day.");
  }
  return (end - start) / 60;
}

export function formatTime(minutes: number) {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) {
    throw new RangeError("Time must be between 0 and 1440 minutes.");
  }
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}${minutes === 1440 ? " next day" : ""}`;
}

export function calculateWeek(basePay: number, shifts: readonly Shift[]) {
  if (shifts.length !== 7) throw new RangeError("Provide one shift for each day of the week.");
  const entries = days.map((day, index) => ({
    ...calculateGross(day, basePay, shifts[index].status === "worked" ? shiftHours(shifts[index].start, shifts[index].end) : 0, shifts[index].publicHoliday),
    status: shifts[index].status,
  }));
  const totals = entries.reduce((sum, entry) => ({
    hours: sum.hours + entry.hours,
    regularHours: sum.regularHours + entry.regularHours,
    overtimeHours: sum.overtimeHours + entry.overtimeHours,
    overtime150Hours: sum.overtime150Hours + entry.overtime150Hours,
    overtime200Hours: sum.overtime200Hours + entry.overtime200Hours,
    overtime150Pay: sum.overtime150Pay + entry.overtime150Pay,
    overtime200Pay: sum.overtime200Pay + entry.overtime200Pay,
    regularPay: sum.regularPay + entry.regularPay,
    overtimePay: sum.overtimePay + entry.overtimePay,
    gross: sum.gross + entry.gross,
  }), { hours: 0, regularHours: 0, overtimeHours: 0, overtime150Hours: 0,
    overtime200Hours: 0, overtime150Pay: 0, overtime200Pay: 0,
    regularPay: 0, overtimePay: 0, gross: 0 });
  if (!Object.values(totals).every(Number.isFinite)) {
    throw new RangeError("This weekly pay is too large to calculate. Enter a smaller hourly pay.");
  }
  return { entries, ...totals };
}

export function validateBasePay(pay: string) {
  const error = validateInputs(pay, "0").pay;
  if (error) return error;
  try {
    // A full holiday week pays every hour at the maximum 2× rate.
    calculateWeek(Number(pay), days.map(() => ({ start: 0, end: 1440, status: "worked", publicHoliday: true })));
  } catch {
    return "This pay is too large to calculate. Enter a smaller hourly pay.";
  }
}
