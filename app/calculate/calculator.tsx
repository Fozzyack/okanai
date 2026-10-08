"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import BaseHourlyRate from "@/components/base-hourly-rate";
import DailySchedule from "@/components/daily-schedule";
import {
    calculateGross,
    calculateWeek,
    days,
    formatTime,
    freshWeek,
    money,
    saveShift,
    shiftHours,
    updateShiftHoliday,
    updateShiftTime,
    validateBasePay,
} from "@/lib/payroll";
import styles from "./calculator.module.css";

export default function Calculator() {
    const [step, setStep] = useState(0);
    const [pay, setPay] = useState("25");
    const [weekForm, setWeekForm] = useState(freshWeek);
    const { shifts } = weekForm;
    const [error, setError] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const heading = useRef<HTMLHeadingElement>(null);
    const initial = useRef(true);
    useEffect(() => {
        if (initial.current) {
            initial.current = false;
            return;
        }
        heading.current?.focus();
    }, [step]);

    const payError = validateBasePay(pay);
    const current = shifts[step - 1];
    let currentHours = 0;
    let shiftError = "";
    if (current) {
        try {
            currentHours = shiftHours(current.start, current.end);
        } catch (cause) {
            shiftError = (cause as Error).message;
        }
    }
    let weekly: ReturnType<typeof calculateWeek> | undefined;
    if (!payError) {
        try {
            weekly = calculateWeek(Number(pay), shifts);
        } catch {
            /* Invalid edited shifts never show stale totals. */
        }
    }
    const estimate =
        current && !shiftError && !payError
            ? calculateGross(
                  days[step - 1],
                  Number(pay),
                  currentHours,
                  current.publicHoliday,
              )
            : undefined;

    function go(next: number) {
        setError("");
        setStep(next);
    }
    function updateTime(key: "start" | "end", value: number) {
        setWeekForm((previous) =>
            updateShiftTime(previous, step - 1, key, value),
        );
        setError("");
    }
    function complete(status: "worked" | "skipped") {
        if (payError || (status === "worked" && shiftError)) {
            setError(payError || shiftError);
            return;
        }
        setWeekForm((previous) => saveShift(previous, step - 1, status));
        setAnnouncement(
            status === "skipped"
                ? `${days[step - 1]} marked as a day off.`
                : `${days[step - 1]} saved: ${currentHours} hours, ${money(estimate!.gross)} AUD.`,
        );
        go(step + 1);
    }
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (step === 0) {
            if (payError) setError(payError);
            else go(1);
        } else complete("worked");
    }

    return (
        <div className={styles.wizard}>
            <section className={styles.card} aria-labelledby="step-title">
                <h1
                    id="step-title"
                    ref={heading}
                    tabIndex={-1}
                    className={styles.title}
                >
                    {step === 0 ? (
                        <>
                            Enter your
                            <br />
                            <span>hourly pay.</span>
                        </>
                    ) : step === 8 ? (
                        <>
                            Your week.
                            <br />
                            <span>All added up.</span>
                        </>
                    ) : (
                        <>
                            When did you work
                            <br />
                            <span>{days[step - 1]}?</span>
                        </>
                    )}
                </h1>

                {step < 8 ? (
                    <form onSubmit={submit} noValidate>
                        {step === 0 ? (
                            <BaseHourlyRate
                                value={pay}
                                error={error}
                                onChange={(value) => {
                                    setPay(value);
                                    setError("");
                                }}
                            />
                        ) : (
                            <DailySchedule
                                day={days[step - 1]}
                                shift={current}
                                hours={currentHours}
                                error={shiftError}
                                onTimeChange={updateTime}
                                onHolidayChange={(publicHoliday) => {
                                    setWeekForm((previous) =>
                                        updateShiftHoliday(
                                            previous,
                                            step - 1,
                                            publicHoliday,
                                        ),
                                    );
                                    setError("");
                                }}
                            />
                        )}
                        <p
                            id="calculator-error"
                            role="alert"
                            className={styles.error}
                        >
                            {error || (step > 0 ? shiftError : "")}
                        </p>
                        <div className={styles.actions}>
                            {step > 0 && (
                                <button
                                    type="button"
                                    className={styles.secondary}
                                    onClick={() => go(step - 1)}
                                >
                                    ← Previous
                                </button>
                            )}
                            <button type="submit" className={styles.primary}>
                                {step === 0
                                    ? "Let’s start"
                                    : step === 7
                                      ? "See my weekly pay"
                                      : "Save & next"}
                                <span aria-hidden="true">↗</span>
                            </button>
                        </div>
                        {step > 0 && (
                            <button
                                type="button"
                                className={styles.skip}
                                onClick={() => complete("skipped")}
                            >
                                Didn’t work {days[step - 1]}? Skip this day →
                            </button>
                        )}
                    </form>
                ) : (
                    <>
                        <p className={styles.description}>
                            Estimated gross pay, before tax and deductions.
                        </p>
                        <div className={styles.total}>
                            {weekly ? money(weekly.gross) : "—"}
                            <span>AUD · {weekly?.hours ?? 0} hours</span>
                        </div>
                        <dl className={styles.breakdown}>
                            <div>
                                <dt>
                                    Regular{" "}
                                    <small>
                                        {weekly?.regularHours ?? 0} hours · 1×
                                        base rate
                                    </small>
                                </dt>
                                <dd>
                                    {weekly ? money(weekly.regularPay) : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt>
                                    Overtime{" "}
                                    <small>
                                        {weekly?.overtime150Hours ?? 0} hrs at
                                        1.5× · {weekly?.overtime200Hours ?? 0} hrs
                                        at 2× (including public holidays)
                                    </small>
                                </dt>
                                <dd>
                                    {weekly ? money(weekly.overtimePay) : "—"}
                                </dd>
                            </div>
                        </dl>
                        <div className={styles.dailyRows}>
                            {days.map((day, index) => (
                                <div key={day} className={styles.dailyRow}>
                                    <div>
                                        <strong>{day}</strong>
                                        <small>
                                            {shifts[index].status === "worked"
                                                ? `${formatTime(shifts[index].start)} – ${formatTime(shifts[index].end)}${shifts[index].publicHoliday ? " · Public holiday" : ""}`
                                                : shifts[index].status ===
                                                    "skipped"
                                                  ? "Day off"
                                                  : "Not completed · not counted"}
                                        </small>
                                    </div>
                                    <span>
                                        {weekly?.entries[index].hours ?? 0} hrs
                                        <br />
                                        <strong>
                                            {weekly
                                                ? money(
                                                      weekly.entries[index]
                                                          .gross,
                                                  )
                                                : "—"}
                                        </strong>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => go(index + 1)}
                                        aria-label={`Edit ${day}`}
                                        className={styles.edit}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.secondary}
                                onClick={() => go(7)}
                            >
                                ← Previous
                            </button>
                            <button
                                className={styles.primary}
                                onClick={() => go(0)}
                            >
                                Edit base pay ↗
                            </button>
                        </div>
                        <button
                            className={styles.skip}
                            onClick={() => {
                                setPay("25");
                                setWeekForm(freshWeek());
                                setAnnouncement(
                                    "A fresh week started. Previous shifts cleared.",
                                );
                                go(0);
                            }}
                        >
                            Start a fresh week →
                        </button>
                    </>
                )}
            </section>

            <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </p>
        </div>
    );
}
