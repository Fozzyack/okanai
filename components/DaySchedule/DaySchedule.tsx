"use client";

import type { DayScheduleProps } from "@/types/props";
import type { hoursWorked } from "@/types/calculate";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Steps, stepToText } from "@/lib/calculate";
import StepHeader from "../StepHeader";
import Button from "../ui/Button";
import ScheduleTimeSection from "./ScheduleTimeSection";
import BreakDurationSection from "./BreakDurationSection";

gsap.registerPlugin(useGSAP);

const DaySchedule = ({
    step,
    weeklyHours,
    updateWeeklyHours,
    onNext,
    errMsg,
}: DayScheduleProps) => {
    const [isBreakSection, setIsBreakSection] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const dayIndex = step - Steps.MONDAY;
    const [draft, setDraft] = useState<hoursWorked>(() => {
        const day = weeklyHours[dayIndex];
        const isUnset = day.start === 0 && day.end === 0;
        const previousSchedule = weeklyHours
            .slice(0, dayIndex)
            .reverse()
            .find((previousDay) => !(previousDay.start === 0 && previousDay.end === 0));
        const start = isUnset ? (previousSchedule?.start ?? 9 * 60) : day.start;
        const end = isUnset ? (previousSchedule?.end ?? 17 * 60) : day.end;
        const breakSource = isUnset ? (previousSchedule ?? day) : day;
        const duration = Math.min(
            end - start,
            Math.max(0, breakSource.break_time),
        );
        return {
            ...day,
            start,
            end,
            break_time: duration,
        };
    });
    const { start, end } = draft;

    useGSAP(
        () => {
            const media = gsap.matchMedia();
            media.add(
                "(prefers-reduced-motion: no-preference)",
                () => {
                    gsap.timeline({ defaults: { ease: "power3.out" } })
                        .from(
                            "[data-schedule-reveal]",
                            {
                                y: 14,
                                opacity: 0,
                                duration: 0.5,
                                stagger: 0.08,
                                clearProps: "transform,opacity",
                            },
                            0.2,
                        );
                },
                sectionRef,
            );

            return () => media.revert();
        },
        {
            scope: sectionRef,
            dependencies: [step, isBreakSection],
            revertOnUpdate: true,
        },
    );

    const updateSchedule = (scheduleStart: number, scheduleEnd: number) => {
        setDraft((previous) => {
            const duration = Math.min(
                scheduleEnd - scheduleStart,
                Math.max(0, previous.break_time),
            );
            return {
                ...previous,
                start: scheduleStart,
                end: scheduleEnd,
                break_time: duration,
            };
        });
    };

    const handleNext = () => {
        if (isBreakSection) {
            updateWeeklyHours(
                dayIndex,
                draft.start,
                draft.end,
                draft.break_time,
                draft.is_public_holiday,
            );
            onNext();
        } else {
            setIsBreakSection(true);
        }
    };

    const skipStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        updateWeeklyHours(dayIndex, 0, 0, 0, false);
        onNext();
    };

    return (
        <div
            ref={sectionRef}
            className="mx-auto flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-8 py-12 sm:gap-10"
        >
            <StepHeader
                text={isBreakSection ? "Set Break for" : "Set Schedule for"}
                text_highlight={stepToText(step)}
            />

            {isBreakSection ? (
                <BreakDurationSection
                    minutes={draft.break_time}
                    maxMinutes={end - start}
                    errMsg={errMsg}
                    onChange={(duration) =>
                        setDraft((previous) => ({
                            ...previous,
                            break_time: duration,
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

            <Button data-schedule-reveal fullWidth onClick={handleNext}>
                Next
            </Button>
            {isBreakSection && (
                <Button
                    data-schedule-reveal
                    variant="ghost"
                    onClick={() => setIsBreakSection(false)}
                >
                    Back to schedule
                </Button>
            )}
            <div data-schedule-reveal className="flex items-center justify-center">
                <Button variant="link" onClick={skipStep}>
                    Skip Day {"->"}
                </Button>
            </div>
        </div>
    );
};

export default DaySchedule;
