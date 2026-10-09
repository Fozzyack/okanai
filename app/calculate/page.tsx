"use client";
import BasePayInput from "@/components/BasePay";
import DaySchedule from "@/components/DaySchedule";
import Summary from "@/components/Summary";
import { isValidBasePay } from "@/lib/BasePay";
import { hoursWorked } from "@/types/calculate";
import { init_hours, Steps } from "@/lib/calculate";
import { useState } from "react";
import Button from "@/components/ui/Button";
import SettingsModal from "@/components/SettingsModal";
import { PaySettings } from "@/types/calculate";
import CalculatorHelp from "./help-modal";

export default function CalculatePage() {
    // Variables for main steps
    const [step, setStep] = useState<number>(Steps.PAY);
    const [basePay, setBasePay] = useState<string>("");
    const [weeklyHours, setWeeklyHours] = useState<hoursWorked[]>(init_hours);
    const [errMsg, setErrorMsg] = useState<string>("");

    // Variables for settings menu
    const [bonusPay1, setBonusPay1] = useState<number>(1.5);
    const [bonusPay2, setBonusPay2] = useState<number>(2);
    const [bonus1After, setBonus1After] = useState<number>(8);
    const [bonus2After, setBonus2After] = useState<number>(10);

    const [weekendBonus1, setWeekendBonus1] = useState<number>(1.5);
    const [weekendBonus2, setWeekendBonus2] = useState<number>(2);
    const [weekendOvertimeAfter, setWeekendOvertimeAfter] = useState<number>(3);

    const [publicHolidayBonus, setPublicHolidayBonus] = useState<number>(2);
    const [breaksOnlyDeductBasePay, setBreaksOnlyDeductBasePay] =
        useState(false);

    const settings: PaySettings = {
        bonusPay1,
        bonusPay2,
        bonus1After,
        bonus2After,
        weekendBonus1,
        weekendBonus2,
        weekendOvertimeAfter,
        publicHolidayBonus,
        breaksOnlyDeductBasePay,
    };

    const onChangePay = (amount: string) => {
        setBasePay(amount);
    };

    const updateWeeklyHours = (
        index: number,
        start?: number,
        end?: number,
        breakTime?: number,
        isPublicHoliday?: boolean,
    ) => {
        const newWeeklyHours = [...weeklyHours];
        newWeeklyHours[index] = {
            start: start ?? newWeeklyHours[index].start,
            end: end ?? newWeeklyHours[index].end,
            break_time: breakTime ?? newWeeklyHours[index].break_time,
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
        if (step == Steps.PAY) return;
        setStep(step - 1);
    };

    const onSave = (settings: PaySettings) => {
        setBonusPay1(settings.bonusPay1);
        setBonusPay2(settings.bonusPay2);
        setBonus1After(settings.bonus1After);
        setBonus2After(settings.bonus2After);
        setWeekendBonus1(settings.weekendBonus1);
        setWeekendBonus2(settings.weekendBonus2);
        setWeekendOvertimeAfter(settings.weekendOvertimeAfter);
        setPublicHolidayBonus(settings.publicHolidayBonus);
        setBreaksOnlyDeductBasePay(settings.breaksOnlyDeductBasePay);
    };

    const startAgain = () => {
        setBasePay("");
        setWeeklyHours(init_hours.map((day) => ({ ...day })));
        setErrorMsg("");
        setStep(Steps.PAY);
    };

    return (
        <div className="z-10">
            <CalculatorHelp settings={settings} />
            <div className="mt-6 flex items-center justify-between gap-4">
                {step != Steps.PAY && (
                    <Button variant="secondary" onClick={onPrev}>
                        {"<-"} Back
                    </Button>
                )}
                <div className="ml-auto">
                    <SettingsModal values={settings} onSave={onSave} />
                </div>
            </div>
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
                    key={step}
                    step={step}
                    weeklyHours={weeklyHours}
                    updateWeeklyHours={updateWeeklyHours}
                    errMsg={errMsg}
                    onNext={onNext}
                />
            )}
            {step == Steps.SUMMARY && (
                <Summary
                    weeklyHours={weeklyHours}
                    basePay={basePay}
                    settings={settings}
                    onStartAgain={startAgain}
                />
            )}
        </div>
    );
}
