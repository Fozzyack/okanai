"use client";

import { useId, useState } from "react";
import {
    clockInput,
    formatTime,
    timeInputMinutes,
    type Day,
    type Shift,
} from "@/lib/payroll";
import styles from "./daily-schedule.module.css";

type DailyScheduleProps = {
    day: Day;
    shift: Shift;
    hours: number;
    error: string;
    onTimeChange: (key: "start" | "end", value: number) => void;
    onHolidayChange: (publicHoliday: boolean) => void;
};

export default function DailySchedule({
    day,
    shift,
    hours,
    error,
    onTimeChange,
    onHolidayChange,
}: DailyScheduleProps) {
    const holidayTipId = useId();
    const [holidayTipOpen, setHolidayTipOpen] = useState(false);

    return (
        <>
            <div className={styles.timeFields}>
                {(["start", "end"] as const).map((key) => (
                    <div key={key} data-calculator-reveal>
                        <label htmlFor={`${key}-time`} className={styles.label}>
                            {key === "start" ? "Clock in" : "Clock out"}
                        </label>
                        <p className={styles.timeDisplay}>
                            {formatTime(shift[key]).split(" ")[0]}{" "}
                            <span>{formatTime(shift[key]).split(" ")[1]}</span>
                        </p>
                        <input
                            id={`${key}-time`}
                            type="time"
                            step="900"
                            required
                            value={clockInput(shift[key])}
                            aria-invalid={Boolean(error)}
                            aria-describedby="calculator-error"
                            onChange={(event) => {
                                const minutes = timeInputMinutes(
                                    event.target.value,
                                    key,
                                );
                                if (minutes !== undefined)
                                    onTimeChange(key, minutes);
                            }}
                        />
                        {key === "end" && shift.end === 1440 && (
                            <small>Midnight · next day</small>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.rangeArea}>
                <div className={styles.rail} aria-hidden="true">
                    <span
                        style={{
                            left: `${shift.start / 14.4}%`,
                            width: `${Math.max(0, shift.end - shift.start) / 14.4}%`,
                        }}
                    />
                </div>
                {(["start", "end"] as const).map((key) => (
                    <input
                        key={key}
                        className={styles.range}
                        type="range"
                        min="0"
                        max="1440"
                        step="15"
                        value={shift[key]}
                        aria-label={`${day} ${key === "start" ? "clock in" : "clock out"}`}
                        aria-valuetext={formatTime(shift[key])}
                        onChange={(event) =>
                            onTimeChange(
                                key,
                                key === "start"
                                    ? Math.max(
                                          0,
                                          Math.min(
                                              Number(event.target.value),
                                              Math.ceil(shift.end / 15) * 15 -
                                                  15,
                                          ),
                                      )
                                    : Math.min(
                                          1440,
                                          Math.max(
                                              Number(event.target.value),
                                              Math.floor(shift.start / 15) *
                                                  15 +
                                                  15,
                                          ),
                                      ),
                            )
                        }
                    />
                ))}
            </div>
            <div className={styles.ticks} aria-hidden="true">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
            </div>
            <p className={styles.duration} data-calculator-reveal>
                {error ? "Check your times" : `${hours} elapsed hours`}
            </p>
            <div className={styles.holiday} data-calculator-reveal>
                <label htmlFor="public-holiday">
                    <input
                        id="public-holiday"
                        type="checkbox"
                        checked={shift.publicHoliday ?? false}
                        onChange={(event) =>
                            onHolidayChange(event.target.checked)
                        }
                    />
                    Public holiday
                </label>
                <span
                    className={styles.holidayHint}
                    onPointerEnter={() => setHolidayTipOpen(true)}
                    onPointerLeave={() => setHolidayTipOpen(false)}
                >
                    <button
                        type="button"
                        className={styles.holidayInfo}
                        aria-label="Public holiday pay rate"
                        aria-describedby={
                            holidayTipOpen ? holidayTipId : undefined
                        }
                        onFocus={() => setHolidayTipOpen(true)}
                        onBlur={() => setHolidayTipOpen(false)}
                        onClick={() => setHolidayTipOpen(true)}
                        onKeyDown={(event) => {
                            if (event.key === "Escape")
                                setHolidayTipOpen(false);
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            />
                            <path
                                d="M12 11v6"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="12"
                                cy="7.5"
                                r="1"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                    {holidayTipOpen && (
                        <span
                            id={holidayTipId}
                            role="tooltip"
                            className={styles.holidayTooltip}
                        >
                            2x base pay!!!
                        </span>
                    )}
                </span>
            </div>
        </>
    );
}
