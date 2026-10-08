"use client";

import { useRef } from "react";
import styles from "./help-modal.module.css";

export default function CalculatorHelp() {
    const dialog = useRef<HTMLDialogElement>(null);

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
                                For each day, drag the blue clock-in and
                                clock-out handles. You can also use arrow keys
                                or enter times directly. Check Public holiday if
                                it applies to that day. Choose Next: unpaid
                                break to open the separate break step without
                                saving.
                            </li>
                            <li>
                                Enter unpaid break minutes, then save the day to
                                continue, or skip from either step for days you
                                didn’t work. Previous traverses both steps
                                without clearing your details. After editing
                                breaks, times or the holiday checkbox, save
                                again to include that day.
                            </li>
                            <li>
                                After Sunday, see your weekly total and edit any
                                day or your base rate.
                            </li>
                        </ol>
                    </section>
                    <section>
                        <h3>Choosing your times</h3>
                        <p>
                            Times use 15-minute increments. Shifts must start
                            and finish within the same day; midnight clock-out
                            means 12:00 AM the next day. Overnight shifts beyond
                            midnight aren’t supported yet. Your last saved
                            worked times carry forward to later untouched days;
                            edited drafts, saved days, and days off are kept.
                            Skipping doesn’t change your remembered times.
                            Public holiday selections stay with their own day
                            and never carry forward. Suggestions only count once
                            you save the day. A fresh week resets to 9 AM–5 PM
                            and clears all holiday selections. Each day's values
                            are retained when skipped or revisited. Summary
                            Previous returns to Sunday's break; Edit opens a
                            day's time step.
                        </p>
                    </section>
                    <section>
                        <h3>Public holidays</h3>
                        <p>
                            Check Public holiday for a day to pay all paid hours
                            at 2× your base rate. Public holidays override
                            weekday and weekend tiers, and all paid hours appear
                            as overtime in the breakdown. Multipliers do not
                            stack.
                        </p>
                    </section>
                    <section>
                        <h3>How the demo estimate works</h3>
                        <p>
                            Monday–Friday: the first 8 hours pay 1× your base
                            rate, the next 2 hours pay 1.5×, and all remaining
                            hours pay 2×. Saturday and Sunday: all hours are
                            overtime, with the first 3 hours at 1.5× and all
                            remaining hours at 2×. No weekly overtime rule is
                            applied.
                        </p>
                    </section>
                    <section>
                        <h3>Unpaid breaks</h3>
                        <p>
                            Breaks default to 0 and must be whole minutes from 0
                            up to the elapsed shift duration; an entire-shift
                            break is allowed. Your last saved worked break
                            prefills later untouched days; change it as needed.
                            Edited drafts, saved days, and days off keep their
                            own values. Skipping doesn’t change your remembered
                            break, and a fresh week resets breaks to 0. If you
                            shorten a shift below its suggested break, correct
                            it on the break step; it is never automatically
                            reduced.
                        </p>
                        <p>
                            Tiers are allocated from elapsed time before breaks:
                            unpaid time removes regular 1× hours first, then
                            1.5× hours, then 2× hours when the lower tier is
                            exhausted. Totals show paid hours and gross pay
                            after breaks; break deductions are already included,
                            not subtracted again.
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
