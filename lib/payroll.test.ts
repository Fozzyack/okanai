import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateGross, calculateWeek, days, formatTime, shiftHours, validateBasePay, validateInputs, type Shift } from "./payroll";

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
  assert.equal(week.regularHours, 16);
  assert.equal(week.overtimeHours, 4);
  assert.equal(week.regularPay, 500);
  assert.equal(week.overtimePay, 187.5);
  assert.equal(week.gross, 687.5);
  assert.equal(calculateWeek(50, shifts).gross, 1375);
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

test("weekend multipliers stack with overtime", () => {
  assert.equal(calculateGross("Saturday", 25, 10).gross, 412.5);
  const sunday = calculateGross("Sunday", 25, 10);
  assert.equal(sunday.regularPay, 400);
  assert.equal(sunday.overtimePay, 150);
  assert.equal(sunday.gross, 550);
});

test("zero, fractional hours, and maximum hours are supported", () => {
  assert.equal(calculateGross("Monday", 0, 24).gross, 0);
  assert.equal(calculateGross("Monday", 25, 0).gross, 0);
  assert.equal(calculateGross("Monday", 25, 8.5).gross, 218.75);
  assert.equal(calculateGross("Monday", 25, 24).gross, 800);
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
