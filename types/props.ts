import { hoursWorked } from "./calculate";

export type StepHeaderProps = {
    text: string;
    text_highlight: string;
};

export type BasePayInputProps = {
    pay: string;
    errMsg: string;

    onChangePay: (amount: string) => void;
    onNext: () => void;
};

export type DayScheduleProps = {
    step: number;
    weeklyHours: hoursWorked[];
    errMsg: string;

    updateWeeklyHours: (index: number, start: number, end: number) => void;
    onNext: () => void;
};
