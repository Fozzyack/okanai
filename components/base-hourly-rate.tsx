"use client";

import styles from "./base-hourly-rate.module.css";

type BaseHourlyRateProps = {
    value: string;
    error: string;
    onChange: (value: string) => void;
};

export default function BaseHourlyRate({
    value,
    error,
    onChange,
}: BaseHourlyRateProps) {
    return (
        <div data-calculator-reveal>
            <label htmlFor="base-pay" className={styles.label}>
                Base hourly pay (AUD)
            </label>
            <div className={styles.payInput}>
                <span aria-hidden="true">$</span>
                <input
                    id="base-pay"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    required
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby="calculator-error"
                />
                <span>AUD / hr</span>
            </div>
        </div>
    );
}
