"use client";

import { useRef } from "react";
import type { PaySettings } from "@/types/calculate";
import styles from "./help-modal.module.css";

export default function CalculatorHelp({ settings }: { settings: PaySettings }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const thresholdHours = settings.breaksOnlyDeductBasePay ? "shift hours" : "paid hours";

    return (
        <>
            <button
                type="button"
                className={styles.trigger}
                aria-label="Open calculator help"
                aria-haspopup="dialog"
                onClick={() => dialog.current?.showModal()}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <path
                        d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 1.5-2.5 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
            </button>
            <dialog
                ref={dialog}
                className={styles.dialog}
                aria-labelledby="help-title"
                onClick={(event) => {
                    if (event.target === event.currentTarget)
                        dialog.current?.close();
                }}
            >
                <div className={styles.content}>
                    <div className={styles.heading}>
                        <h2 id="help-title">A little help.</h2>
                        <button
                            type="button"
                            autoFocus
                            className={styles.close}
                            aria-label="Close calculator help"
                            onClick={() => dialog.current?.close()}
                        >
                            ×
                        </button>
                    </div>
                    <section>
                        <h3>Build your week</h3>
                        <ol>
                            <li>
                                Enter your base hourly pay in Australian dollars
                                (AUD).
                            </li>
                            <li>
                                For each day, enter start and end times or adjust
                                the time-range sliders. You can also use arrow
                                keys on the sliders. Check Public holiday if it
                                applies. Choose Next to open the break step
                                without saving the day yet.
                            </li>
                            <li>
                                Enter unpaid break minutes, then choose Next to
                                save the day and continue. Back to schedule lets
                                you adjust that day’s times without losing its
                                draft. Skip Day from either step marks the day
                                as not scheduled, clearing its times, break,
                                and public-holiday selection.
                            </li>
                            <li>
                                After Sunday, see your weekly total and daily
                                breakdown. Open Settings at any step to adjust
                                your pay multipliers and overtime thresholds;
                                Save settings updates the estimate and this help.
                                Cancel leaves your saved settings unchanged.
                            </li>
                        </ol>
                    </section>
                    <section>
                        <h3>Choosing your times</h3>
                        <p>
                            Times use one-minute increments from 00:00 to 23:59.
                            Shifts must start and finish within the same day;
                            overnight shifts aren’t supported. An untouched day
                            suggests the most recent non-skipped day’s saved
                            times, or 09:00–17:00 if none exists. Skipped days stay
                            at 0, 0 and don’t replace those suggestions. Saved
                            schedules keep their own values when revisited.
                            Public-holiday selections never carry forward.
                            Suggestions only count once you save the day.
                        </p>
                    </section>
                    <section>
                        <h3>Public holidays</h3>
                        <p>
                            Check Public holiday for a day to pay all paid hours
                            at {settings.publicHolidayBonus}× your base rate.
                            Public holidays override weekday and weekend tiers;
                            multipliers do not stack. All paid holiday hours are
                            shown as normal hours, with no separate overtime tier.
                        </p>
                    </section>
                    <section>
                        <h3>Your current pay rules</h3>
                        <p>
                            Monday–Friday: normal hours pay 1× your base rate up
                            to {settings.bonus1After} {thresholdHours} per day. Hours
                            after {settings.bonus1After} and up to {settings.bonus2After} pay{" "}
                            {settings.bonusPay1}×; hours beyond {settings.bonus2After} pay{" "}
                            {settings.bonusPay2}×.
                        </p>
                        <p>
                            Saturday and Sunday: the first {settings.weekendOvertimeAfter} {thresholdHours}
                            {" "}per day pay {settings.weekendBonus1}× and are
                            shown as normal hours. Remaining paid hours pay{" "}
                            {settings.weekendBonus2}× and are shown as overtime.
                            Thresholds apply per day, not across the week.{" "}
                            {settings.breaksOnlyDeductBasePay
                                ? "For pay calculations, thresholds use the full shift before the base-rate break deduction. Hour breakdowns still use hours excluding breaks."
                                : "Thresholds use paid hours after subtracting breaks."}
                        </p>
                    </section>
                    <section>
                        <h3>Unpaid breaks</h3>
                        <p>
                            Breaks are whole minutes from 0 up to the shift
                            duration; an entire-shift break is allowed. An
                            untouched day suggests the most recent non-skipped
                            day’s saved break, or 0 if none exists. Saved days
                            keep their own breaks. A suggested break is capped at
                            the shift length, and shortening a shift automatically
                            reduces a break that no longer fits.
                        </p>
                        <p>
                            {settings.breaksOnlyDeductBasePay
                                ? "Breaks only deduct base pay is on. Calculate the full shift’s pay using its applicable rates, then deduct break hours × your base hourly rate. Overtime, weekend, and holiday multipliers do not increase that deduction. The deduction is capped at the full shift’s pay so the result cannot be negative."
                                : "Breaks only deduct base pay is off. Unpaid breaks are subtracted before applying daily overtime thresholds. Break cost is the difference between the same shift’s pay with and without its break, including any change in overtime tiers."}
                        </p>
                        <p>
                            Pay totals already include the break deduction;
                            don’t subtract its cost again. Daily amounts are
                            displayed to cents, while the weekly total is
                            rounded only once.
                        </p>
                    </section>
                    <section>
                        <h3>All amounts are AUD</h3>
                        <p>
                            This is a demo gross estimate, not legal payroll
                            advice. Taxes, other deductions, superannuation, and
                            award-specific rules aren’t included. Your actual
                            pay depends on your employment terms and applicable
                            rules.
                        </p>
                        <p>
                            No sign-up is needed. Details aren’t saved and will
                            reset when you reload.
                        </p>
                    </section>
                </div>
            </dialog>
        </>
    );
}
