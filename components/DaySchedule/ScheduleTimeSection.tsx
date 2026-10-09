"use client";

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

type ScheduleTimeSectionProps = {
    start: number;
    end: number;
    errMsg: string;
    onChangeStart: (minutes: number) => void;
    onChangeEnd: (minutes: number) => void;
};

const ScheduleTimeSection = ({
    start,
    end,
    errMsg,
    onChangeStart,
    onChangeEnd,
}: ScheduleTimeSectionProps) => (
    <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            {([
                {
                    name: "start",
                    label: "Start time",
                    value: start,
                    update: onChangeStart,
                },
                {
                    name: "end",
                    label: "End time",
                    value: end,
                    update: onChangeEnd,
                },
            ] as const).map(({ name, label, value, update }) => (
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
                                    Math.min(
                                        LAST_MINUTE,
                                        Math.max(0, timeToMinutes(event.target.value)),
                                    ),
                                );
                            }
                        }}
                        aria-invalid={Boolean(errMsg)}
                        aria-describedby={errMsg ? "schedule-error" : undefined}
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
                    onChange={(event) => onChangeStart(Number(event.target.value))}
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
                    onChange={(event) => onChangeEnd(Number(event.target.value))}
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
                {Math.floor((end - start) / 60)}h {(end - start) % 60}m scheduled
            </p>
        </fieldset>
    </div>
);

export default ScheduleTimeSection;
