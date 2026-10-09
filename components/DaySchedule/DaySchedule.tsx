"use client";

import type { DayScheduleProps } from "@/types/props";
import type { hoursWorked } from "@/types/calculate";
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
    const [draft, setDraft] = useState<hoursWorked>(() => {
        const day = weeklyHours[dayIndex];
        const isUnset = day.start === 0 && day.end === 0;
        const start = isUnset ? 9 * 60 : day.start;
        const end = isUnset ? 17 * 60 : day.end;
        const duration = Math.min(
            end - start,
            Math.max(0, day.break_end - day.break_start),
        );
        const breakStart = Math.min(
            end - duration,
            Math.max(start, day.break_start),
        );
        return {
            ...day,
            start,
            end,
            break_start: breakStart,
            break_end: breakStart + duration,
        };
    });
    const { start, end } = draft;
    const breakMinutes = draft.break_end - draft.break_start;

    const updateSchedule = (scheduleStart: number, scheduleEnd: number) => {
        setDraft((previous) => {
            const duration = Math.min(
                scheduleEnd - scheduleStart,
                Math.max(0, previous.break_end - previous.break_start),
            );
            const breakStart = Math.min(
                scheduleEnd - duration,
                Math.max(scheduleStart, previous.break_start),
            );
            return {
                ...previous,
                start: scheduleStart,
                end: scheduleEnd,
                break_start: breakStart,
                break_end: breakStart + duration,
            };
        });
    };

    const handleNext = () => {
        if (isBreakSection) {
            updateWeeklyHours(
                dayIndex,
                draft.start,
                draft.end,
                draft.break_start,
                draft.break_end,
                draft.is_public_holiday,
            );
            onNext();
        } else {
            setIsBreakSection(true);
        }
    };

    const skipStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNext();
    }

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
                        setDraft((previous) => ({
                            ...previous,
                            break_start: previous.start,
                            break_end: previous.start + duration,
                        }))
                    }
                />
            ) : (
                <ScheduleTimeSection
                    start={start}
                    end={end}
                    errMsg={errMsg}
                    isPublicHoliday={draft.is_public_holiday}
                    onChangePublicHoliday={() =>
                        setDraft((previous) => ({
                            ...previous,
                            is_public_holiday: !previous.is_public_holiday,
                        }))
                    }
                    onChangeStart={(minutes) =>
                        updateSchedule(minutes, Math.max(minutes, end))
                    }
                    onChangeEnd={(minutes) =>
                        updateSchedule(Math.min(start, minutes), minutes)
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
                <Button
                    variant="ghost"
                    onClick={() => setIsBreakSection(false)}
                >
                    Back to schedule
                </Button>
            )}
            <div className="flex items-center justify-center">
                <Button variant="link" onClick={skipStep}>
                    Skip Day {"->"}
                </Button>
            </div>
        </div>
    );
};

export default DaySchedule;
