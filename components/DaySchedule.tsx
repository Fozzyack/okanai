"use client";

import type { DayScheduleProps } from "@/types/props";
import { Steps, stepToText } from "@/lib/calculate";
import StepHeader from "./StepHeader";
import Button from "./ui/Button";
import styles from "./DaySchedule.module.css";

const LAST_MINUTE = 23 * 60 + 59;

const formatTime = (minutes: number): string =>
    `${Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const DaySchedule = ({
    step,
    weeklyHours,
    updateWeeklyHours,
    onNext,
    errMsg,
}: DayScheduleProps) => {
    const dayIndex = step - Steps.MONDAY;
    const { start, end } = weeklyHours[dayIndex];

    const updateStart = (minutes: number) => {
        updateWeeklyHours(dayIndex, minutes, Math.max(minutes, end));
    };

    const updateEnd = (minutes: number) => {
        updateWeeklyHours(dayIndex, Math.min(start, minutes), minutes);
    };

    return (
        <div className="mx-auto flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-8 py-12 sm:gap-10">
            <StepHeader
                text="Set Schedule for"
                text_highlight={stepToText(step)}
            />

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {(
                        [
                            {
                                name: "start",
                                label: "Start time",
                                value: start,
                                update: updateStart,
                            },
                            {
                                name: "end",
                                label: "End time",
                                value: end,
                                update: updateEnd,
                            },
                        ] as const
                    ).map(({ name, label, value, update }) => (
                        <div key={name} className="min-w-0 space-y-3">
                            <label
                                htmlFor={`schedule-${name}`}
                                className="block pl-1 text-sm font-semibold text-[#182b51]"
                            >
                                {label}
                            </label>
                            <input
                                id={`schedule-${name}`}
                                type="time"
                                min="00:00"
                                max="23:59"
                                step={60}
                                value={formatTime(value)}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        update(
                                            timeToMinutes(event.target.value),
                                        );
                                    }
                                }}
                                aria-invalid={Boolean(errMsg)}
                                aria-describedby={
                                    errMsg ? "schedule-error" : undefined
                                }
                                className="w-full min-w-0 rounded-3xl border-2 border-[#315de8]/25 bg-white px-3 py-5 text-lg font-medium tabular-nums text-[#182b51] shadow-[4px_5px_0_#edf2ff] focus:border-[#315de8]"
                            />
                        </div>
                    ))}
                </div>

                <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-[#182b51]">
                        Adjust time range
                    </legend>
                    <div className="relative mx-3 h-10">
                        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#edf2ff]" />
                        <div
                            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#315de8]"
                            style={{
                                left: `${(start / LAST_MINUTE) * 100}%`,
                                width: `${((end - start) / LAST_MINUTE) * 100}%`,
                            }}
                        />
                        <input
                            type="range"
                            min={0}
                            max={LAST_MINUTE}
                            step={1}
                            value={start}
                            onChange={(event) =>
                                updateStart(Number(event.target.value))
                            }
                            aria-label="Start time"
                            aria-valuetext={formatTime(start)}
                            className={styles.range}
                        />
                        <input
                            type="range"
                            min={0}
                            max={LAST_MINUTE}
                            step={1}
                            value={end}
                            onChange={(event) =>
                                updateEnd(Number(event.target.value))
                            }
                            aria-label="End time"
                            aria-valuetext={formatTime(end)}
                            className={styles.range}
                        />
                    </div>
                    <div className="flex justify-between text-xs font-semibold tabular-nums text-[#65718a]">
                        <span>00:00</span>
                        <span>23:59</span>
                    </div>
                    <p className="text-center text-sm font-medium text-[#182b51]">
                        {Math.floor((end - start) / 60)}h {(end - start) % 60}m
                        scheduled
                    </p>
                </fieldset>
                <p
                    id="schedule-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="min-h-5 pl-1 text-sm font-medium text-red-600"
                >
                    {errMsg}
                </p>
            </div>

            <Button fullWidth onClick={onNext}>
                Next
            </Button>
        </div>
    );
};
export default DaySchedule;
