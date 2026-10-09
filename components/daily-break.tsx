import styles from "./daily-break.module.css";
import scheduleStyles from "./daily-schedule.module.css";

type Shift = {
    start: number;
    end: number;
    publicHoliday?: boolean;
    breakMinutes?: number;
};

function formatTime(minutes: number) {
    return new Intl.DateTimeFormat("en-AU", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(0, 0, 0, 0, minutes));
}

type DailyBreakProps = {
    shift: Shift;
    hours: number;
    paidHours?: number;
    error: string;
    onChange: (breakMinutes: number) => void;
};

export default function DailyBreak({
    shift,
    hours,
    paidHours,
    error,
    onChange,
}: DailyBreakProps) {
    return (
        <>
            <p className={scheduleStyles.recap} data-calculator-reveal>
                {formatTime(shift.start)} – {formatTime(shift.end)}
                {shift.publicHoliday ? " · Public holiday" : ""}
            </p>
            <div data-calculator-reveal>
                <label
                    id="unpaid-break-label"
                    htmlFor="unpaid-break"
                    className={styles.label}
                >
                    Unpaid break
                </label>
                <div className={styles.breakInput}>
                    <input
                        id="unpaid-break"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max={hours * 60}
                        step="1"
                        required
                        value={
                            Number.isFinite(shift.breakMinutes ?? 0)
                                ? (shift.breakMinutes ?? 0)
                                : ""
                        }
                        aria-invalid={Boolean(error)}
                        aria-labelledby="unpaid-break-label unpaid-break-unit"
                        aria-describedby="calculator-error"
                        onChange={(event) =>
                            onChange(
                                event.target.value === ""
                                    ? NaN
                                    : event.target.valueAsNumber,
                            )
                        }
                    />
                    <span id="unpaid-break-unit">minutes</span>
                </div>
            </div>
            <p className={scheduleStyles.duration} data-calculator-reveal>
                {hours} elapsed hours ·{" "}
                {paidHours === undefined ? "—" : Number(paidHours.toFixed(2))}{" "}
                paid hours
            </p>
        </>
    );
}
