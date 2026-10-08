"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import BaseHourlyRate from "@/components/base-hourly-rate";
import DailySchedule from "@/components/daily-schedule";
import DailyBreak from "@/components/daily-break";
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
    updateShiftBreak,
    updateShiftTime,
    validateBreakMinutes,
    validateBasePay,
} from "@/lib/payroll";
import styles from "./calculator.module.css";

gsap.registerPlugin(useGSAP);

export default function Calculator() {
    const [step, setStep] = useState(0);
    const [pay, setPay] = useState("25");
    const [weekForm, setWeekForm] = useState(freshWeek);
    const { shifts } = weekForm;
    const [error, setError] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const root = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const initial = useRef(true);
    useGSAP(
        () => {
            const media = gsap.matchMedia();
            media.add(
                "(prefers-reduced-motion: no-preference)",
                () => {
                    // Only reveal the field cards, never the interactive range rail.
                    gsap.from("[data-calculator-reveal]", {
                        y: 14,
                        opacity: 0,
                        duration: 0.45,
                        stagger: 0.045,
                        ease: "power2.out",
                        clearProps: "transform,opacity",
                    });
                },
                root,
            );

            return () => media.revert();
        },
        { scope: root, dependencies: [step], revertOnUpdate: true },
    );

    useEffect(() => {
        if (initial.current) {
            initial.current = false;
            return;
        }
        heading.current?.focus();
    }, [step]);

    const payError = validateBasePay(pay);
    // Odd steps choose times; even steps confirm breaks and save the day.
    const dayIndex = Math.floor((step - 1) / 2);
    const isBreakStep = step > 0 && step < 15 && step % 2 === 0;
    const current = step > 0 && step < 15 ? shifts[dayIndex] : undefined;
    let currentHours = 0;
    let shiftError = "";
    let breakError = "";
    if (current) {
        try {
            currentHours = shiftHours(current.start, current.end);
        } catch (cause) {
            shiftError = (cause as Error).message;
        }
        if (isBreakStep && !shiftError) {
            try {
                validateBreakMinutes(current.breakMinutes ?? 0, currentHours);
            } catch (cause) {
                breakError = (cause as Error).message;
            }
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
    let estimate: ReturnType<typeof calculateGross> | undefined;
    if (current && isBreakStep && !shiftError && !breakError && !payError) {
        try {
            estimate = calculateGross(
                days[dayIndex],
                Number(pay),
                currentHours,
                current.publicHoliday,
                current.breakMinutes ?? 0,
            );
        } catch (cause) {
            breakError = (cause as Error).message;
        }
    }

    function go(next: number) {
        setError("");
        setStep(next);
    }
    function updateTime(key: "start" | "end", value: number) {
        setWeekForm((previous) =>
            updateShiftTime(previous, dayIndex, key, value),
        );
        setError("");
    }
    function complete(status: "worked" | "skipped") {
        if (payError || (status === "worked" && (shiftError || breakError))) {
            setError(payError || shiftError || breakError);
            return;
        }
        setWeekForm((previous) => saveShift(previous, dayIndex, status));
        setAnnouncement(
            status === "skipped"
                ? `${days[dayIndex]} marked as a day off.`
                : `${days[dayIndex]} saved: ${Number(estimate!.hours.toFixed(2))} paid hours, ${currentHours} elapsed hours, ${current!.breakMinutes ?? 0} unpaid break minutes, ${money(estimate!.gross)} AUD.`,
        );
        go(dayIndex * 2 + 3);
    }
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (step === 0) {
            if (payError) setError(payError);
            else go(1);
        } else if (!isBreakStep) {
            if (payError || shiftError) setError(payError || shiftError);
            else go(step + 1);
        } else complete("worked");
    }

    return (
        <div ref={root} className={styles.wizard}>
            <section className={styles.card} aria-labelledby="step-title">
                <h1
                    id="step-title"
                    ref={heading}
                    tabIndex={-1}
                    className={styles.title}
                    data-calculator-reveal
                >
                    {step === 0 ? (
                        <>
                            Enter your
                            <br />
                            <span>hourly pay.</span>
                        </>
                    ) : step === 15 ? (
                        <>
                            Your week.
                            <br />
                            <span>All added up.</span>
                        </>
                    ) : isBreakStep ? (
                        <>
                            Any unpaid break
                            <br />
                            <span>on {days[dayIndex]}?</span>
                        </>
                    ) : (
                        <>
                            When did you work
                            <br />
                            <span>{days[dayIndex]}?</span>
                        </>
                    )}
                </h1>

                {step < 15 ? (
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
                        ) : isBreakStep ? (
                            <DailyBreak
                                shift={current!}
                                hours={currentHours}
                                paidHours={estimate?.hours}
                                error={breakError}
                                onChange={(breakMinutes) => {
                                    setWeekForm((previous) => updateShiftBreak(previous, dayIndex, breakMinutes));
                                    setError("");
                                }}
                            />
                        ) : (
                            <DailySchedule
                                day={days[dayIndex]}
                                shift={current!}
                                hours={currentHours}
                                error={shiftError}
                                onTimeChange={updateTime}
                                onHolidayChange={(publicHoliday) => {
                                    setWeekForm((previous) =>
                                        updateShiftHoliday(
                                            previous,
                                            dayIndex,
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
                            {error || (step > 0 ? shiftError || breakError : "")}
                        </p>
                        <div className={styles.actions} data-calculator-reveal>
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
                                    : !isBreakStep
                                      ? "Next: unpaid break"
                                      : step === 14
                                      ? "See my weekly pay"
                                      : "Save & next"}
                                <span aria-hidden="true">↗</span>
                            </button>
                        </div>
                        {step > 0 && (
                            <button
                                type="button"
                                className={styles.skip}
                                data-calculator-reveal
                                onClick={() => complete("skipped")}
                            >
                                Didn’t work {days[dayIndex]}? Skip this day →
                            </button>
                        )}
                    </form>
                ) : (
                    <>
                        <p className={styles.description} data-calculator-reveal>
                            Estimated gross pay after unpaid breaks, before tax and other deductions.
                        </p>
                        <div className={styles.total} data-calculator-reveal>
                            {weekly ? money(weekly.gross) : "—"}
                            <span>AUD · {Number((weekly?.hours ?? 0).toFixed(2))} paid hours · {weekly?.shiftHours ?? 0} elapsed hours</span>
                        </div>
                        <dl className={styles.breakdown} data-calculator-reveal>
                            <div>
                                <dt>Total break time: {Number(((weekly?.breakHours ?? 0) * 60).toFixed(2))} minutes <small>Unpaid · already deducted</small></dt>
                                <dd>−{weekly ? money(weekly.breakDeduction) : "—"}</dd>
                            </div>
                            <div>
                                <dt>
                                    Regular{" "}
                                    <small>
                                        {Number((weekly?.regularHours ?? 0).toFixed(2))} hours · 1×
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
                                        {Number((weekly?.overtime150Hours ?? 0).toFixed(2))} hrs at
                                        1.5× · {Number((weekly?.overtime200Hours ?? 0).toFixed(2))} hrs
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
                                <div
                                    key={day}
                                    className={styles.dailyRow}
                                    data-calculator-reveal
                                >
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
                                        {shifts[index].status === "worked" && (
                                            <p className={styles.breakTime}>
                                                Break time: {shifts[index].breakMinutes ?? 0} minutes
                                            </p>
                                        )}
                                    </div>
                                    <span>
                                        {Number((weekly?.entries[index].hours ?? 0).toFixed(2))} paid hrs
                                        <small>{weekly?.entries[index].shiftHours ?? 0} elapsed hrs · −{weekly ? money(weekly.entries[index].breakDeduction) : "—"} already deducted</small>
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
                                        onClick={() => go(index * 2 + 1)}
                                        aria-label={`Edit ${day}`}
                                        className={styles.edit}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.actions} data-calculator-reveal>
                            <button
                                className={styles.secondary}
                                onClick={() => go(14)}
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
                            data-calculator-reveal
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
