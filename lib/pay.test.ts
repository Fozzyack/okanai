import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { hoursWorked, PaySettings } from "../types/calculate";
import { calculateBreakLoss, calculateDailyHours, calculateDailyPay, calculateWeeklyPay } from "./pay";

const settings: PaySettings = {
    bonusPay1: 1.5,
    bonusPay2: 2,
    bonus1After: 8,
    bonus2After: 10,
    weekendBonus1: 1.5,
    weekendBonus2: 2,
    weekendOvertimeAfter: 3,
    publicHolidayBonus: 1.5,
    breaksOnlyDeductBasePay: false,
};

const emptyWeek = (): hoursWorked[] => Array.from({ length: 7 }, () => ({
    start: 0, end: 0, break_time: 0, is_public_holiday: false,
}));

test("skipped days contribute no pay", () => {
    assert.equal(calculateWeeklyPay("20", emptyWeek(), settings), 0);
});

test("weekday tiers apply after subtracting unpaid breaks", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1260, break_time: 60, is_public_holiday: false };
    assert.equal(calculateWeeklyPay("20", week, settings), 260);
    week[0].end = 1080;
    assert.equal(calculateWeeklyPay("20", week, settings), 160);
    week[0].end = 1200;
    assert.equal(calculateWeeklyPay("20", week, settings), 220);
});

test("both weekend days use weekend tiers", () => {
    const week = emptyWeek();
    week[5] = { start: 540, end: 1020, break_time: 0, is_public_holiday: false };
    week[6] = { ...week[5] };
    assert.equal(calculateWeeklyPay("20", week, settings), 580);
});

test("holiday rates replace weekday overtime and weekend rates", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1260, break_time: 60, is_public_holiday: true };
    week[6] = { start: 540, end: 1020, break_time: 0, is_public_holiday: true };
    assert.equal(calculateWeeklyPay("20", week, settings), 570);
});

test("rounds once for the week and does not mutate inputs", () => {
    const week = emptyWeek();
    week[0].end = 1;
    week[1].end = 1;
    week[2].end = 1;
    const before = structuredClone(week);
    assert.equal(calculateWeeklyPay("0.10", week, settings), 0.01);
    assert.deepEqual(week, before);
});

test("rejects invalid pay, settings, and schedules", () => {
    assert.throws(() => calculateWeeklyPay("", emptyWeek(), settings), RangeError);
    assert.throws(() => calculateWeeklyPay("20", [], settings), RangeError);
    assert.throws(() => calculateWeeklyPay("20", emptyWeek(), { ...settings, bonusPay1: NaN }), RangeError);
    assert.throws(() => calculateWeeklyPay("20", emptyWeek(), { ...settings, bonus2After: 7 }), RangeError);
    assert.throws(() => calculateWeeklyPay("20", emptyWeek(), { ...settings, weekendOvertimeAfter: -1 }), RangeError);
    const week = emptyWeek();
    week[0].break_time = 1;
    assert.throws(() => calculateWeeklyPay("20", week, settings), RangeError);
    week[0] = { start: 600, end: 540, break_time: 0, is_public_holiday: false };
    assert.throws(() => calculateWeeklyPay("20", week, settings), RangeError);
});

test("daily pay uses weekday, weekend, and holiday rates", () => {
    const day = { start: 540, end: 1080, break_time: 60, is_public_holiday: false };
    assert.equal(calculateDailyPay("20", day, 0, settings), 160);
    assert.equal(calculateDailyPay("20", day, 5, settings), 290);
    assert.equal(calculateDailyPay("20", { ...day, is_public_holiday: true }, 6, settings), 240);
});

test("break loss accounts for crossing overtime thresholds", () => {
    const day = { start: 540, end: 1200, break_time: 180, is_public_holiday: false };
    const before = { ...day };
    assert.equal(calculateBreakLoss("20", day, 0, settings), 100);
    assert.deepEqual(day, before);
    assert.equal(calculateBreakLoss("20", { ...day, break_time: 0 }, 0, settings), 0);
});

test("break loss uses weekend tiers and holiday-only rates", () => {
    const day = { start: 540, end: 780, break_time: 120, is_public_holiday: false };
    assert.equal(calculateBreakLoss("20", day, 5, settings), 70);
    assert.equal(calculateBreakLoss("20", { ...day, is_public_holiday: true }, 5, settings), 60);
    assert.equal(calculateBreakLoss("20", { ...day, break_time: 240 }, 0, settings), 80);
});

test("daily functions reject invalid day indexes and breaks", () => {
    const day = emptyWeek()[0];
    for (const index of [-1, 7, 1.5, NaN]) {
        assert.throws(() => calculateDailyPay("20", day, index, settings), RangeError);
        assert.throws(() => calculateBreakLoss("20", day, index, settings), RangeError);
    }
    assert.throws(() => calculateBreakLoss("20", { ...day, break_time: -1 }, 0, settings), RangeError);
});

test("daily hours exclude breaks and split both weekday overtime tiers", () => {
    const day = { start: 540, end: 1260, break_time: 60, is_public_holiday: false };
    assert.deepEqual(calculateDailyHours(day, 0, settings), {
        paidHours: 11, normalHours: 8, overtimeHours: 3, overtime1Hours: 2, overtime2Hours: 1,
    });
    assert.equal(calculateDailyHours({ ...day, break_time: 240 }, 0, settings).overtimeHours, 0);
});

test("daily hours follow weekend and holiday pay rules", () => {
    const day = { start: 540, end: 1020, break_time: 0, is_public_holiday: false };
    assert.deepEqual(calculateDailyHours(day, 5, settings), {
        paidHours: 8, normalHours: 3, overtimeHours: 5, overtime1Hours: 5, overtime2Hours: 0,
    });
    assert.deepEqual(calculateDailyHours({ ...day, is_public_holiday: true }, 6, settings), {
        paidHours: 8, normalHours: 8, overtimeHours: 0, overtime1Hours: 0, overtime2Hours: 0,
    });
});

test("daily hours support fractional thresholds, skipped days, and validation", () => {
    const day = { start: 540, end: 1110, break_time: 30, is_public_holiday: false };
    const hours = calculateDailyHours(day, 0, { ...settings, bonus1After: 7.5, bonus2After: 8.5 });
    assert.deepEqual(hours, {
        paidHours: 9, normalHours: 7.5, overtimeHours: 1.5, overtime1Hours: 1, overtime2Hours: 0.5,
    });
    assert.equal(hours.normalHours + hours.overtimeHours, hours.paidHours);
    assert.equal(calculateDailyHours(emptyWeek()[0], 0, settings).paidHours, 0);
    assert.throws(() => calculateDailyHours(day, 7, settings), RangeError);
    assert.throws(() => calculateDailyHours({ ...day, break_time: 1000 }, 0, settings), RangeError);
});

test("base-only breaks deduct the base rate on weekdays, weekends, and holidays", () => {
    const baseOnly = { ...settings, breaksOnlyDeductBasePay: true };
    const day = { start: 540, end: 1200, break_time: 60, is_public_holiday: false };
    assert.equal(calculateDailyPay("20", day, 0, baseOnly), 240);
    assert.equal(calculateBreakLoss("20", day, 0, baseOnly), 20);
    assert.equal(calculateDailyPay("20", day, 5, baseOnly), 390);
    assert.equal(calculateBreakLoss("20", day, 5, baseOnly), 20);
    assert.equal(calculateDailyPay("20", { ...day, is_public_holiday: true }, 0, baseOnly), 310);
    assert.equal(calculateBreakLoss("20", { ...day, is_public_holiday: true }, 0, baseOnly), 20);
    assert.equal(calculateDailyPay("20", day, 0, settings), 220);
    assert.equal(calculateBreakLoss("20", day, 0, settings), 40);
    assert.deepEqual(calculateDailyHours(day, 0, baseOnly), calculateDailyHours(day, 0, settings));
});

test("weekly totals honor base-only breaks and keep the input unchanged", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1200, break_time: 60, is_public_holiday: false };
    week[5] = { ...week[0] };
    week[6] = { ...week[0], is_public_holiday: true };
    const before = structuredClone(week);
    assert.equal(calculateWeeklyPay("20", week, { ...settings, breaksOnlyDeductBasePay: true }), 940);
    assert.deepEqual(week, before);
});

test("base-only deductions handle zero, fractional-hour, and entire-shift breaks", () => {
    const baseOnly = { ...settings, breaksOnlyDeductBasePay: true };
    const day = { start: 540, end: 600, break_time: 15, is_public_holiday: false };
    assert.equal(calculateDailyPay("20", day, 0, baseOnly), 15);
    assert.equal(calculateBreakLoss("20", day, 0, baseOnly), 5);
    assert.equal(calculateBreakLoss("20", { ...day, break_time: 0 }, 0, baseOnly), 0);
    assert.equal(calculateDailyPay("20", { ...day, break_time: 60 }, 0, baseOnly), 0);
    const lowerRate = { ...baseOnly, publicHolidayBonus: 0.5 };
    const holiday = { ...day, break_time: 60, is_public_holiday: true };
    assert.equal(calculateDailyPay("20", holiday, 0, lowerRate), 0);
    assert.equal(calculateBreakLoss("20", holiday, 0, lowerRate), 10);
    assert.throws(() => calculateDailyPay("20", { ...day, break_time: 61 }, 0, baseOnly), RangeError);
});
