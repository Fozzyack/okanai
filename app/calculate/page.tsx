"use client";
import BasePayInput from "@/components/BasePay";
import { isValidBasePay } from "@/lib/BasePay";
import { hoursWorked } from "@/types/calculate";
import { useState } from "react";

const Steps = Object.freeze({
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

const stepToText = (step: number) => {
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

export default function CalculatePage() {
    const [step, setStep] = useState<number>(Steps.PAY);
    const [basePay, setBasePay] = useState<string>("");
    const [weeklyHours, setWeeklyHours] = useState<hoursWorked[]>([{start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}]);
    const [errMsg, setErrorMsg] = useState<string>("");

    const onChangePay = (amount: string) => {
        setBasePay(amount);
    };

    const onNext = () => {
        if (step == Steps.PAY && !isValidBasePay(basePay)) {
            setErrorMsg("Invalid Base Pay Entered");
            return;
        }
        setErrorMsg("");
        setStep(step + 1);
    };

    const onPrev = () => {
        if (step == Steps.PAY || step == Steps.SUMMARY) return;
        setStep(step - 1);
    };

    return (
        <div className="z-10">
            {step == Steps.PAY && (
                <BasePayInput
                    pay={basePay}
                    errMsg={errMsg}
                    onChangePay={onChangePay}
                    onNext={onNext}
                />
            )}
            {step != Steps.PAY && step != Steps.SUMMARY && (
                <div>
                    <span>Go back to </span>{" "}
                    <button
                        className="underline hover:cursor-pointer"
                        onClick={onPrev}
                    >
                        {" "}
                        previous step{" "}
                    </button>
                </div>
            )}
        </div>
    );
}
