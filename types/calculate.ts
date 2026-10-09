export type hoursWorked = {
    // Minutes since midnight (0–1439). Equal times represent no scheduled time.
    start: number;
    end: number;
    break_start: number;
    break_end: number;
    is_public_holiday: boolean;
};
