import type { hoursWorked, PaySettings } from "@/types/calculate";
import { parseBasePay } from "./BasePay";
import { LAST_MINUTE } from "./time";

const validateSettings = (settings: PaySettings): void => {
    for (const name of [
        "bonusPay1", "bonusPay2", "weekendBonus1", "weekendBonus2", "publicHolidayBonus",
    ] as const) {
        if (!Number.isFinite(settings[name]) || settings[name] <= 0) {
            throw new RangeError(`${name} must be a positive, finite multiplier.`);
        }
    }
    for (const name of ["bonus1After", "bonus2After", "weekendOvertimeAfter"] as const) {
        if (!Number.isFinite(settings[name]) || settings[name] < 0) {
            throw new RangeError(`${name} must be a non-negative, finite number of hours.`);
        }
    }
    if (settings.bonus2After < settings.bonus1After) {
        throw new RangeError("The second overtime threshold cannot precede the first.");
    }

};

const validateDay = (day: hoursWorked, dayIndex: number): void => {
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) {
        throw new RangeError("Day index must be 0 (Monday) through 6 (Sunday).");
    }
    if (
        !Number.isInteger(day.start) || !Number.isInteger(day.end) ||
        day.start < 0 || day.end > LAST_MINUTE || day.end < day.start ||
        !Number.isInteger(day.break_time) || day.break_time < 0 ||
        day.break_time > day.end - day.start ||
        typeof day.is_public_holiday !== "boolean"
    ) {
        throw new RangeError(`Invalid schedule for day ${dayIndex + 1}.`);
    }
};

const validateAmount = (amount: number): number => {
    if (!Number.isFinite(amount) || !Number.isSafeInteger(Math.round(amount * 100))) {
        throw new RangeError("Calculated pay exceeds the supported monetary range.");
    }
    return amount;
};

/**
 * Gross pay after unpaid breaks, using daily paid-hour overtime thresholds.
 * dayIndex is 0 (Monday) through 6 (Sunday); holidays replace other rates.
 * Returns an unrounded amount so weekly totals can be rounded just once.
 * Throws RangeError for invalid pay, settings, or schedule entries.
 */
export const calculateDailyPay = (
    basePay: string,
    day: hoursWorked,
    dayIndex: number,
    settings: PaySettings,
): number => {
    const hourlyRate = parseBasePay(basePay);
    validateSettings(settings);
    validateDay(day, dayIndex);

    const hours = (day.end - day.start - day.break_time) / 60;
    let weightedHours: number;
    if (day.is_public_holiday) {
        weightedHours = hours * settings.publicHolidayBonus;
    } else if (dayIndex >= 5) {
        const firstTier = Math.min(hours, settings.weekendOvertimeAfter);
        weightedHours = firstTier * settings.weekendBonus1 +
            (hours - firstTier) * settings.weekendBonus2;
    } else {
        const regular = Math.min(hours, settings.bonus1After);
        const firstTier = Math.max(0, Math.min(hours, settings.bonus2After) - regular);
        const secondTier = Math.max(0, hours - settings.bonus2After);
        weightedHours = regular + firstTier * settings.bonusPay1 +
            secondTier * settings.bonusPay2;
    }
    return validateAmount(weightedHours * hourlyRate);
};

/**
 * Unrounded pay lost to the day's unpaid break compared with the same shift
 * without a break. Includes any change to overtime tiers; does not mutate day.
 */
export const calculateBreakLoss = (
    basePay: string,
    day: hoursWorked,
    dayIndex: number,
    settings: PaySettings,
): number => {
    const paid = calculateDailyPay(basePay, day, dayIndex, settings);
    const withoutBreak = calculateDailyPay(basePay, { ...day, break_time: 0 }, dayIndex, settings);
    return validateAmount(withoutBreak - paid);
};

/** Gross weekly pay for seven entries ordered Monday–Sunday, rounded to cents. */
export const calculateWeeklyPay = (
    basePay: string,
    weeklyHours: readonly hoursWorked[],
    settings: PaySettings,
): number => {
    if (weeklyHours.length !== 7) {
        throw new RangeError("Weekly hours must contain seven days, Monday through Sunday.");
    }
    const total = validateAmount(weeklyHours.reduce(
        (sum, day, index) => sum + calculateDailyPay(basePay, day, index, settings),
        0,
    ));
    return Math.round((total + Number.EPSILON) * 100) / 100;
};
