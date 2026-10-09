import { hoursWorked } from "@/types/calculate";

export const Steps = Object.freeze({
    PAY: 0,
    MONDAY: 1,
    TUESAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
    SUMMARY: 8,
});

export const stepToText = (step: number) => {
    switch (step) {
        case Steps.MONDAY:
            return "Monday";
        case Steps.TUESAY:
            return "Tuesday";
        case Steps.WEDNESDAY:
            return "Wednesday";
        case Steps.THURSDAY:
            return "Thursday";
        case Steps.FRIDAY:
            return "Friday";
        case Steps.SATURDAY:
            return "Saturday";
        case Steps.SUNDAY:
            return "Sunday";
        default:
            throw new Error("Invalid step");
    }
};

export let init_hours: hoursWorked[] = [
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
    {
        start: 540,
        end: 1020,
        break_start: 0,
        break_end: 0,
        is_public_holiday: false,
    },
];
