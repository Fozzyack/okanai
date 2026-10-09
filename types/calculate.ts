export type hoursWorked = {
    // Minutes since midnight (0–1439). Equal times represent no scheduled time.
    start: number;
    end: number;
    // Break duration in minutes, not a time of day.
    break_time: number;
    is_public_holiday: boolean;
};

export type PaySettings = {
    bonusPay1: number;
    bonusPay2: number;
    bonus1After: number;
    bonus2After: number;
    weekendBonus1: number;
    weekendBonus2: number;
    weekendOvertimeAfter: number;
    publicHolidayBonus: number;
};
