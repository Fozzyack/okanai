"use client";
import BasePayInput from "@/components/BasePay";
import DaySchedule from "@/components/DaySchedule";
import { isValidBasePay } from "@/lib/BasePay";
import { hoursWorked } from "@/types/calculate";
import { init_hours, Steps } from "@/lib/calculate";
import { useState } from "react";

export default function CalculatePage() {
    const [step, setStep] = useState<number>(Steps.PAY);
    const [basePay, setBasePay] = useState<string>("");
    const [weeklyHours, setWeeklyHours] = useState<hoursWorked[]>(init_hours);
    const [errMsg, setErrorMsg] = useState<string>("");

    const onChangePay = (amount: string) => {
        setBasePay(amount);
    };

    const updateWeeklyHours = (
        index: number,
        start?: number,
        end?: number,
        startBreak?: number,
        endBreak?: number,
        isPublicHoliday?: boolean,
    ) => {
        const newWeeklyHours = [...weeklyHours];
        newWeeklyHours[index] = {
            start: start ?? newWeeklyHours[index].start,
            end: end ?? newWeeklyHours[index].end,
            break_start: startBreak ?? newWeeklyHours[index].break_start,
            break_end: endBreak ?? newWeeklyHours[index].break_end,
            is_public_holiday:
                isPublicHoliday ?? newWeeklyHours[index].is_public_holiday,
        };
        setWeeklyHours(newWeeklyHours);
        return;
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
            {step > Steps.PAY && step < Steps.SUMMARY && (
                <DaySchedule
                    step={step}
                    weeklyHours={weeklyHours}
                    updateWeeklyHours={updateWeeklyHours}
                    errMsg={errMsg}
                    onNext={onNext}
                />
            )}
            {step != Steps.PAY && step != Steps.SUMMARY && (
                <div className="text-center mt-12">
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
