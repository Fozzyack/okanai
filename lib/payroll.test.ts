import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateGross, calculateWeek, days, formatTime, freshWeek, saveShift, shiftHours, updateShiftBreak, updateShiftTime, updateShiftHoliday, validateBasePay, validateInputs, type Shift } from "./payroll";

test("default weekday estimate and the eight-hour boundary", () => {
  const result = calculateGross("Monday", 25, 8);
  assert.equal(result.gross, 200);
  assert.equal(result.overtimeHours, 0);
  assert.equal(calculateGross("Friday", 25, 10).gross, 275);
});

test("quarter-hour same-day shifts and midnight formatting", () => {
  assert.equal(shiftHours(540, 1020), 8);
  assert.equal(shiftHours(1425, 1440), 0.25);
  assert.equal(shiftHours(0, 1440), 24);
  assert.equal(formatTime(0), "12:00 AM");
  assert.equal(formatTime(735), "12:15 PM");
  assert.equal(formatTime(1440), "12:00 AM next day");
  for (const [start, end] of [[600, 600], [1020, 540], [-15, 60], [0, 1455], [1, 60], [NaN, 60]]) {
    assert.throws(() => shiftHours(start, end), RangeError);
  }
  assert.throws(() => formatTime(1441), RangeError);
});

test("weekly totals exclude suggestions and skipped days, and overtime is daily", () => {
  const shifts: Shift[] = days.map(() => ({ start: 540, end: 1020, status: "draft" }));
  assert.equal(calculateWeek(25, shifts).gross, 0);
  shifts[0] = { start: 540, end: 1140, status: "worked" };
  shifts[5] = { start: 540, end: 1140, status: "worked" };
  shifts[6] = { start: 540, end: 1140, status: "skipped" };
  const week = calculateWeek(25, shifts);
  assert.equal(week.hours, 20);
  assert.equal(week.regularHours, 8);
  assert.equal(week.overtimeHours, 12);
  assert.equal(week.regularPay, 200);
  assert.equal(week.overtimePay, 537.5);
  assert.equal(week.gross, 737.5);
  assert.equal(calculateWeek(50, shifts).gross, 1475);
  assert.equal(calculateWeek(0, shifts).gross, 0);
  assert.throws(() => calculateWeek(25, []), RangeError);
  shifts[0].end = shifts[0].start;
  assert.throws(() => calculateWeek(25, shifts), RangeError);
});

test("base pay validation rejects nonfinite values and weekly overflow", () => {
  for (const pay of ["", " ", "-1", "Infinity", "NaN", "abc", "1e308", "1e306"]) {
    assert.ok(validateBasePay(pay));
  }
  assert.equal(validateBasePay("0"), undefined);
  assert.equal(validateBasePay("25.50"), undefined);
  const fullWeek: Shift[] = days.map(() => ({ start: 0, end: 1440, status: "worked" }));
  assert.throws(() => calculateWeek(1e306, fullWeek), RangeError);
});

test("weekend tiers are overtime without stacking multipliers", () => {
  assert.equal(calculateGross("Saturday", 25, 10).gross, 462.5);
  const sunday = calculateGross("Sunday", 25, 10);
  assert.equal(sunday.regularPay, 0);
  assert.equal(sunday.overtimePay, 462.5);
  assert.equal(sunday.gross, 462.5);
});

test("zero, fractional hours, and maximum hours are supported", () => {
  assert.equal(calculateGross("Monday", 0, 24).gross, 0);
  assert.equal(calculateGross("Monday", 25, 0).gross, 0);
  assert.equal(calculateGross("Monday", 25, 8.5).gross, 218.75);
  assert.equal(calculateGross("Monday", 25, 24).gross, 975);
});

test("breaks preserve original higher-rate tiers on weekdays", () => {
  const result = calculateGross("Monday", 25, 12, false, 30);
  assert.equal(result.shiftHours, 12);
  assert.equal(result.hours, 11.5);
  assert.equal(result.breakHours, 0.5);
  assert.equal(result.regularHours, 7.5);
  assert.equal(result.overtime150Hours, 2);
  assert.equal(result.overtime200Hours, 2);
  assert.equal(result.gross, 362.5);
  assert.equal(result.breakDeduction, 12.5);
  const overflow = calculateGross("Friday", 25, 12, false, 570);
  assert.equal(overflow.regularHours, 0);
  assert.equal(overflow.overtime150Hours, 0.5);
  assert.equal(overflow.overtime200Hours, 2);
  assert.equal(overflow.breakDeduction, 256.25);
  const intoDouble = calculateGross("Tuesday", 25, 12, false, 660);
  assert.equal(intoDouble.overtime150Hours, 0);
  assert.equal(intoDouble.overtime200Hours, 1);
  assert.equal(intoDouble.gross, 50);
});

test("weekend breaks consume 1.5x first; holidays consume only 2x", () => {
  for (const day of ["Saturday", "Sunday"] as const) {
    const result = calculateGross(day, 25, 5, false, 60);
    assert.equal(result.overtime150Hours, 2);
    assert.equal(result.overtime200Hours, 2);
    assert.equal(result.gross, 175);
    assert.equal(result.breakDeduction, 37.5);
    const overflow = calculateGross(day, 25, 5, false, 240);
    assert.equal(overflow.overtime150Hours, 0);
    assert.equal(overflow.overtime200Hours, 1);
    assert.equal(overflow.breakDeduction, 162.5);
  }
  for (const day of ["Monday", "Sunday"] as const) {
    const result = calculateGross(day, 25, 5, true, 30);
    assert.equal(result.regularHours, 0);
    assert.equal(result.overtime150Hours, 0);
    assert.equal(result.overtime200Hours, 4.5);
    assert.equal(result.gross, 225);
    assert.equal(result.breakDeduction, 25);
  }
});

test("zero, full-shift and minute breaks with fractional elapsed hours", () => {
  for (const day of days) {
    for (const holiday of [false, true]) {
      const noBreak = calculateGross(day, 25, 8.25, holiday);
      assert.deepEqual(calculateGross(day, 25, 8.25, holiday, 0), noBreak);
      const allBreak = calculateGross(day, 25, 8.25, holiday, 495);
      assert.equal(allBreak.hours, 0);
      assert.equal(allBreak.gross, 0);
      assert.equal(allBreak.breakDeduction, noBreak.gross);
      assert.equal(allBreak.regularHours + allBreak.overtimeHours, 0);
    }
  }
  const minute = calculateGross("Monday", 25, 0.25, false, 1);
  assert.equal(minute.hours, 14 / 60);
  assert.equal(minute.breakHours, 1 / 60);
  assert.equal(calculateGross("Monday", 25, 0, false, 0).hours, 0);
  assert.equal(calculateGross("Monday", 0, 1, false, 30).breakDeduction, 0);
});

test("invalid break values are rejected by calculation and worked save", () => {
  for (const breakMinutes of [NaN, Infinity, -Infinity, -1, 0.5, 481]) {
    assert.throws(() => calculateGross("Monday", 25, 8, false, breakMinutes), RangeError);
    const form = updateShiftBreak(freshWeek(), 0, breakMinutes);
    assert.throws(() => saveShift(form, 0, "worked"), RangeError);
    assert.equal(saveShift(form, 0, "skipped").shifts[0].status, "skipped");
  }
  // Clearing the number input produces NaN, not 0.
  assert.throws(() => saveShift(updateShiftBreak(freshWeek(), 0, NaN), 0, "worked"), /whole unpaid break minutes/);
  assert.throws(() => calculateGross("Monday", 25, 0, false, 1), RangeError);
});

test("week aggregates paid and elapsed hours, breaks and deductions only for worked shifts", () => {
  const shifts: Shift[] = days.map(() => ({ start: NaN, end: NaN, status: "draft", breakMinutes: NaN }));
  shifts[0] = { start: 540, end: 1140, status: "worked", breakMinutes: 30 };
  shifts[5] = { start: 540, end: 840, status: "worked", breakMinutes: 60 };
  shifts[6].status = "skipped";
  const week = calculateWeek(25, shifts);
  assert.equal(week.shiftHours, 15);
  assert.equal(week.hours, 13.5);
  assert.equal(week.breakHours, 1.5);
  assert.equal(week.breakDeduction, 50);
  assert.equal(week.gross, 437.5);
  assert.equal(week.hours, week.regularHours + week.overtimeHours);
  assert.equal(week.gross, week.regularPay + week.overtimePay);
  assert.equal(week.entries[6].breakDeduction, 0);
  shifts[0].breakMinutes = NaN;
  assert.throws(() => calculateWeek(25, shifts), RangeError);
});

test("break edits stay per day through saving, skipping, revisiting and reset", () => {
  const initial = freshWeek();
  assert.ok(initial.shifts.every((shift) => shift.breakMinutes === 0));
  let form = updateShiftTime(initial, 0, "end", 1140);
  form = updateShiftBreak(form, 0, 30);
  assert.equal(form.shifts[0].touched, true);
  form = saveShift(form, 0, "worked");
  assert.equal(form.shifts[1].end, 1140);
  assert.equal(form.shifts[1].breakMinutes, 30);
  assert.deepEqual(form.remembered, { start: 540, end: 1140, breakMinutes: 30 });
  form = updateShiftBreak(form, 1, 60);
  form = saveShift(form, 1, "skipped");
  assert.equal(form.shifts[0].breakMinutes, 30);
  assert.equal(form.shifts[1].breakMinutes, 60);
  form = updateShiftBreak(form, 0, 45);
  assert.equal(form.shifts[0].status, "draft");
  assert.equal(calculateWeek(25, form.shifts).hours, 0);
  form = saveShift(form, 0, "worked");
  form = updateShiftHoliday(form, 0, true);
  form = updateShiftTime(form, 0, "start", 600);
  assert.equal(form.shifts[0].breakMinutes, 45);
  assert.equal(form.shifts[1].breakMinutes, 60);
  assert.ok(form.shifts.slice(2).every((shift) => shift.breakMinutes === 45));
  assert.equal(freshWeek().remembered.breakMinutes, 0);
  assert.deepEqual(freshWeek(), initial);
  assert.equal(form.shifts[0].breakMinutes, 45); // Reset does not mutate the old week.
});

test("worked saves seed times and breaks only into later untouched drafts", () => {
  let form = freshWeek();
  form = saveShift(updateShiftBreak(form, 4, 10), 4, "worked");
  form = saveShift(updateShiftBreak(form, 5, 20), 5, "skipped");
  form = updateShiftTime(form, 1, "start", 600);
  form = updateShiftBreak(form, 2, 60);
  form = updateShiftHoliday(form, 3, true);
  const protectedDays = form.shifts.slice(1, 6);
  form = updateShiftTime(form, 0, "end", 1140);
  form = saveShift(updateShiftBreak(form, 0, 45), 0, "worked");
  assert.deepEqual(form.shifts.slice(1, 6), protectedDays);
  assert.deepEqual(form.remembered, { start: 540, end: 1140, breakMinutes: 45 });
  assert.equal(form.shifts[6].breakMinutes, 45);
  assert.equal(form.shifts[6].end, 1140);
  assert.equal(form.shifts[6].publicHoliday, false);
  assert.equal(form.shifts[6].status, "draft");
  // Editing a later day does not alter earlier independent values.
  const monday = form.shifts[0];
  form = saveShift(updateShiftBreak(form, 6, 15), 6, "worked");
  assert.deepEqual(form.shifts[0], monday);
});

test("skipping retains the remembered break and does not propagate an edited break", () => {
  let form = saveShift(updateShiftBreak(freshWeek(), 0, 30), 0, "worked");
  form = updateShiftBreak(form, 1, 90);
  form = updateShiftTime(form, 1, "end", 1080);
  form = saveShift(form, 1, "skipped");
  assert.deepEqual(form.remembered, { start: 540, end: 1020, breakMinutes: 30 });
  assert.equal(form.shifts[1].breakMinutes, 90);
  assert.ok(form.shifts.slice(2).every((shift) => shift.breakMinutes === 30 && shift.end === 1020));
});

test("shortening a suggested shift retains its overlong break until explicitly corrected", () => {
  let form = saveShift(updateShiftBreak(freshWeek(), 0, 60), 0, "worked");
  form = updateShiftTime(form, 1, "end", 570);
  assert.equal(shiftHours(form.shifts[1].start, form.shifts[1].end), 0.5);
  assert.equal(form.shifts[1].breakMinutes, 60);
  assert.throws(() => saveShift(form, 1, "worked"), RangeError);
  assert.equal(form.remembered.breakMinutes, 60);
  form = saveShift(updateShiftBreak(form, 1, 15), 1, "worked");
  assert.equal(form.remembered.breakMinutes, 15);
  assert.equal(form.shifts[2].breakMinutes, 15);
  assert.equal(calculateWeek(25, form.shifts).entries[1].hours, 0.25);
});

test("invalid input is rejected without treating empty fields as zero", () => {
  for (const pay of ["", " ", "-1", "Infinity", "NaN", "abc"]) {
    assert.ok(validateInputs(pay, "8").pay);
  }
  for (const hours of ["", "-1", "24.1", "Infinity", "abc"]) {
    assert.ok(validateInputs("25", hours).hours);
  }
  assert.deepEqual(validateInputs("0", "0"), {});
  assert.throws(() => calculateGross("Monday", -1, 8), RangeError);
  assert.throws(() => calculateGross("Monday", 25, 25), RangeError);
  assert.throws(() => calculateGross("Sunday", Number.MAX_VALUE, 24), RangeError);
});
