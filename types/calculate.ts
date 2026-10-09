export type hoursWorked = {
    // Minutes since midnight (0–1439). Equal times represent no scheduled time.
    start: number;
    end: number;
    // Break duration in minutes, not a time of day.
    break_time: number;
    is_public_holiday: boolean;
};
