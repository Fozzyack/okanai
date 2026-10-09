import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { hoursWorked, PaySettings } from "../types/calculate";
import { calculateBreakLoss, calculateDailyPay, calculateWeeklyPay } from "./pay";

const settings: PaySettings = {
    bonusPay1: 1.5,
    bonusPay2: 2,
    bonus1After: 8,
    bonus2After: 10,
    weekendBonus1: 1.5,
    weekendBonus2: 2,
    weekendOvertimeAfter: 3,
    publicHolidayBonus: 1.5,
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
