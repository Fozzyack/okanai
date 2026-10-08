import { formatTime, type Shift } from "@/lib/payroll";
import styles from "./daily-schedule.module.css";

type DailyBreakProps = {
    shift: Shift;
    hours: number;
    paidHours?: number;
    error: string;
    onChange: (breakMinutes: number) => void;
};

export default function DailyBreak({ shift, hours, paidHours, error, onChange }: DailyBreakProps) {
    return (
        <>
            <p className={styles.recap} data-calculator-reveal>
                {formatTime(shift.start)} – {formatTime(shift.end)}
                {shift.publicHoliday ? " · Public holiday" : ""}
            </p>
            <div className={styles.breakField} data-calculator-reveal>
                <label htmlFor="unpaid-break" className={styles.label}>Unpaid break (minutes)</label>
                <input
                    id="unpaid-break"
                    type="number"
                    min="0"
                    max={hours * 60}
                    step="1"
                    required
                    value={Number.isFinite(shift.breakMinutes ?? 0) ? shift.breakMinutes ?? 0 : ""}
                    aria-invalid={Boolean(error)}
                    aria-describedby="break-description calculator-error"
                    onChange={(event) => onChange(event.target.value === "" ? NaN : event.target.valueAsNumber)}
                />
                <p id="break-description">Whole minutes, up to {hours * 60} minutes (your elapsed shift). Deducted from 1× hours first, then 1.5×, then 2×. Your last saved break is suggested for untouched days; change it here if needed.</p>
            </div>
            <p className={styles.duration} data-calculator-reveal>
                {hours} elapsed hours · {paidHours === undefined ? "—" : Number(paidHours.toFixed(2))} paid hours
            </p>
        </>
    );
}
