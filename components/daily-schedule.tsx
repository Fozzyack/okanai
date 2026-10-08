"use client";

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
    paidHours?: number;
    error: string;
    breakError: string;
    onTimeChange: (key: "start" | "end", value: number) => void;
    onHolidayChange: (publicHoliday: boolean) => void;
    onBreakChange: (breakMinutes: number) => void;
};

export default function DailySchedule({
    day,
    shift,
    hours,
    paidHours,
    error,
    breakError,
    onTimeChange,
    onHolidayChange,
    onBreakChange,
}: DailyScheduleProps) {
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
                                              Math.ceil(shift.end / 15) * 15 - 15,
                                          ),
                                      )
                                    : Math.min(
                                          1440,
                                          Math.max(
                                              Number(event.target.value),
                                              Math.floor(shift.start / 15) * 15 +
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
                {error ? "Check your times" : `${hours} elapsed hours · ${paidHours === undefined ? "—" : Number(paidHours.toFixed(2))} paid hours`}
            </p>
            <div className={styles.breakField} data-calculator-reveal>
                <label htmlFor="unpaid-break" className={styles.label}>Unpaid break (minutes)</label>
                <input
                    id="unpaid-break"
                    type="number"
                    min="0"
                    max={Math.max(0, shift.end - shift.start)}
                    step="1"
                    required
                    value={Number.isFinite(shift.breakMinutes ?? 0) ? shift.breakMinutes ?? 0 : ""}
                    aria-invalid={Boolean(breakError)}
                    aria-describedby="break-description calculator-error"
                    onChange={(event) => onBreakChange(event.target.value === "" ? NaN : event.target.valueAsNumber)}
                />
                <p id="break-description">Whole minutes, up to {Math.max(0, shift.end - shift.start)} minutes (your elapsed shift). Deducted from 1× hours first, then 1.5×, then 2×.</p>
            </div>
            <div className={styles.holiday} data-calculator-reveal>
                <label htmlFor="public-holiday">
                    <input
                        id="public-holiday"
                        type="checkbox"
                        checked={shift.publicHoliday ?? false}
                        aria-describedby="public-holiday-description"
                        onChange={(event) =>
                            onHolidayChange(event.target.checked)
                        }
                    />
                    Public holiday
                </label>
                <p id="public-holiday-description">All paid hours at 2×</p>
            </div>
        </>
    );
}
