"use client";

import type { DayScheduleProps } from "@/types/props";
import { useState } from "react";
import { Steps, stepToText } from "@/lib/calculate";
import StepHeader from "../StepHeader";
import Button from "../ui/Button";
import ScheduleTimeSection from "./ScheduleTimeSection";
import BreakDurationSection from "./BreakDurationSection";

const DaySchedule = ({
    step,
    weeklyHours,
    updateWeeklyHours,
    onNext,
    errMsg,
}: DayScheduleProps) => {
    const [isBreakSection, setIsBreakSection] = useState(false);
    const dayIndex = step - Steps.MONDAY;
    const day = weeklyHours[dayIndex];
    const { start, end } = day;
    const breakMinutes = day.break_end - day.break_start;

    const saveSchedule = (scheduleStart: number, scheduleEnd: number) => {
        const duration = Math.min(
            scheduleEnd - scheduleStart,
            Math.max(0, breakMinutes),
        );
        const breakStart = Math.min(
            scheduleEnd - duration,
            Math.max(scheduleStart, day.break_start),
        );
        updateWeeklyHours(
            dayIndex,
            scheduleStart,
            scheduleEnd,
            breakStart,
            breakStart + duration,
        );
    };

    const handleNext = () => {
        if (isBreakSection) {
            onNext();
        } else {
            saveSchedule(start, end);
            setIsBreakSection(true);
        }
    };

    return (
        <div className="mx-auto flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-8 py-12 sm:gap-10">
            <StepHeader
                text={isBreakSection ? "Set Break for" : "Set Schedule for"}
                text_highlight={stepToText(step)}
            />

            {isBreakSection ? (
                <BreakDurationSection
                    minutes={breakMinutes}
                    maxMinutes={end - start}
                    errMsg={errMsg}
                    onChange={(duration) =>
                        updateWeeklyHours(
                            dayIndex,
                            undefined,
                            undefined,
                            start,
                            start + duration,
                        )
                    }
                />
            ) : (
                <ScheduleTimeSection
                    start={start}
                    end={end}
                    errMsg={errMsg}
                    onChangeStart={(minutes) =>
                        saveSchedule(minutes, Math.max(minutes, end))
                    }
                    onChangeEnd={(minutes) =>
                        saveSchedule(Math.min(start, minutes), minutes)
                    }
                />
            )}
            <p
                id="schedule-error"
                aria-live="polite"
                aria-atomic="true"
                className="min-h-5 pl-1 text-sm font-medium text-red-600"
            >
                {errMsg}
            </p>

            <Button fullWidth onClick={handleNext}>
                Next
            </Button>
            {isBreakSection && (
                <button
                    type="button"
                    onClick={() => setIsBreakSection(false)}
                    className="text-sm font-semibold text-[#315de8] underline underline-offset-4"
                >
                    Back to schedule
                </button>
            )}
        </div>
    );
};

export default DaySchedule;
