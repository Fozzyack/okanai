"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import type { hoursWorked, PaySettings } from "@/types/calculate";
import { Steps, stepToText } from "@/lib/calculate";
import { calculateBreakLoss, calculateDailyHours, calculateDailyPay, calculateWeeklyPay } from "@/lib/pay";
import { formatDuration, formatTime } from "@/lib/time";
import StepHeader from "./StepHeader";

gsap.registerPlugin(useGSAP);

type SummaryProps = {
    weeklyHours: hoursWorked[];
    basePay: string;
    settings: PaySettings;
};

const currency = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
});

const hourNumber = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 });

const getSummary = ({ weeklyHours, basePay, settings }: SummaryProps) => {
    try {
        const totalPay = calculateWeeklyPay(basePay, weeklyHours, settings);
        const days = weeklyHours.map((day, index) => ({
            ...day,
            name: stepToText(Steps.MONDAY + index),
            pay: calculateDailyPay(basePay, day, index, settings),
            breakLoss: calculateBreakLoss(basePay, day, index, settings),
            hours: calculateDailyHours(day, index, settings),
            paidMinutes: day.end - day.start - day.break_time,
            isScheduled: day.start !== day.end,
            isWeekend: index >= 5,
        }));
        return {
            error: null,
            totalPay,
            days,
            paidMinutes: days.reduce((sum, day) => sum + day.paidMinutes, 0),
            breakLoss: days.reduce((sum, day) => sum + day.breakLoss, 0),
            daysWorked: days.filter((day) => day.isScheduled).length,
            maxDailyPay: Math.max(...days.map((day) => day.pay)),
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Please check your pay settings." };
    }
};

const Summary = (props: SummaryProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const summary = getSummary(props);

    useGSAP(
        () => {
            const media = gsap.matchMedia();
            media.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.from("[data-summary-reveal]", {
                    y: 18,
                    opacity: 0,
                    duration: 0.55,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "power3.out",
                    clearProps: "transform,opacity",
                });
            }, sectionRef);
            return () => media.revert();
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="mx-auto w-[calc(100vw-3rem)] max-w-3xl space-y-8 py-12 sm:space-y-10">
            <div className="space-y-4">
                <StepHeader text="Your Week" text_highlight="At a glance" />
                <p className="text-center text-sm leading-relaxed text-[#65718a] sm:text-base">
                    Every shift, every hour. Here’s how your week adds up.
                </p>
            </div>

            {summary.error !== null ? (
                <div role="alert" className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
                    <h3 className="mb-2 font-bold">Check your settings</h3>
                    <p>{summary.error}</p>
                    <p className="mt-2">Open Settings above to adjust your rates and thresholds.</p>
                </div>
            ) : (
                <>
                    <div data-summary-reveal className="grid gap-5 sm:grid-cols-2">
                        <div className="relative overflow-hidden rounded-3xl bg-[#315de8] p-6 text-white shadow-[0_6px_0_#2348ba] sm:p-7">
                            <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-[#f7d9e5]/20" />
                            <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Estimated weekly pay</p>
                            <p className="relative mt-4 break-all text-4xl font-bold leading-tight tabular-nums tracking-[-0.045em] sm:text-5xl">
                                {currency.format(summary.totalPay)}
                            </p>
                            <p className="mt-2 text-xs text-blue-100">AUD · gross pay before tax</p>
                            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/20 pt-4 text-sm">
                                <span className="text-blue-100">Base hourly rate</span>
                                <span className="font-semibold tabular-nums">{currency.format(Number(props.basePay))}/hr</span>
                            </div>
                        </div>

                        <div className="rounded-3xl border-2 border-[#315de8]/15 bg-[#fffaf8] p-6 shadow-[4px_5px_0_#f7d9e5]">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-bold text-[#182b51]">Daily earnings</h3>
                                <span className="text-xs font-medium text-[#65718a]">Mon–Sun</span>
                            </div>
                            <ul aria-label="Daily earnings chart" className="mt-5 grid grid-cols-7 gap-2">
                                {summary.days.map((day) => (
                                    <li key={day.name} aria-label={`${day.name}: ${currency.format(day.pay)}`} className="min-w-0">
                                        <div aria-hidden="true" className="flex h-28 items-end overflow-hidden rounded-lg bg-[#edf2ff]">
                                            <div
                                                className={`w-full rounded-lg transition-[height] duration-500 ${day.is_public_holiday ? "bg-[#efb2cd]" : "bg-[#315de8]"}`}
                                                style={{ height: summary.maxDailyPay > 0 ? `${(day.pay / summary.maxDailyPay) * 100}%` : "0%" }}
                                            />
                                        </div>
                                        <p aria-hidden="true" className="mt-2 text-center text-[10px] font-semibold text-[#65718a] sm:text-xs">{day.name.slice(0, 1)}</p>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-xs text-[#65718a]">After unpaid breaks · pink marks holidays</p>
                        </div>
                    </div>

                    <dl data-summary-reveal className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
                        {[
                            { label: "Paid hours", value: formatDuration(summary.paidMinutes), note: "Breaks excluded" },
                            { label: "Days scheduled", value: `${summary.daysWorked} / 7`, note: "Across your week" },
                            { label: "Unpaid break cost", value: currency.format(summary.breakLoss), note: "Compared with no breaks" },
                        ].map(({ label, value, note }) => (
                            <div key={label} className={`rounded-2xl border p-4 ${label === "Paid hours" ? "border-[#efb2cd]/50 bg-[#fff2f7]" : "border-[#315de8]/15 bg-white"}`}>
                                <dt className="text-xs font-medium text-[#65718a]">{label}</dt>
                                <dd className="mt-2 break-words text-xl font-bold tabular-nums tracking-tight text-[#182b51] sm:text-2xl">{value}</dd>
                                <dd className="mt-1 text-[11px] leading-relaxed text-[#65718a]">{note}</dd>
                            </div>
                        ))}
                    </dl>

                    <div data-summary-reveal className="overflow-hidden rounded-3xl border-2 border-[#315de8]/15 bg-white shadow-[4px_5px_0_#edf2ff]">
                        <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6 border-b border-[#315de8]/15">
                            <h3 className="text-lg font-bold tracking-tight text-[#182b51]">The daily breakdown</h3>
                        </div>
                        <ul className="divide-y divide-[#182b51]/8">
                            {summary.days.map((day) => (
                                <li key={day.name} className={`px-5 py-5 sm:px-6 ${day.isScheduled ? "" : "bg-slate-50/60"}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-sm font-bold text-[#182b51]">{day.name}</h4>
                                                {day.isScheduled && (day.is_public_holiday || day.isWeekend) && (
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${day.is_public_holiday ? "bg-[#f7d9e5] text-[#763c55]" : "bg-[#edf2ff] text-[#315de8]"}`}>
                                                        {day.is_public_holiday ? "Public holiday" : "Weekend"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs tabular-nums text-[#65718a]">
                                                {day.isScheduled ? `${formatTime(day.start)} – ${formatTime(day.end)}` : "Not scheduled"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`break-all text-lg font-bold tabular-nums tracking-tight ${day.isScheduled ? "text-[#182b51]" : "text-[#65718a]"}`}>{currency.format(day.pay)}</p>
                                            {day.isScheduled && <p className="mt-1 text-xs text-[#65718a]">{formatDuration(day.paidMinutes)} paid</p>}
                                        </div>
                                    </div>
                                    <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#65718a]">
                                        <div className="flex items-center gap-2">
                                            <dt className="text-[#65718a]">Normal hours</dt>
                                            <dd className="tabular-nums">{hourNumber.format(day.hours.normalHours)}h</dd>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <dt className="text-[#65718a]">Overtime hours</dt>
                                            <dd className="tabular-nums">{hourNumber.format(day.hours.overtimeHours)}h</dd>
                                        </div>
                                    </dl>
                                    {day.isScheduled && (
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-[#65718a]">
                                            <span>{day.break_time > 0 ? `${day.break_time} min unpaid break` : "No unpaid break"}</span>
                                            {day.break_time > 0 && <span className="tabular-nums">Break cost: {currency.format(day.breakLoss)}</span>}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center justify-between gap-4 border-t border-[#315de8]/15 bg-[#edf2ff] px-5 py-5 sm:px-6">
                            <span className="text-sm font-bold text-[#182b51]">Weekly total</span>
                            <span className="break-all text-xl font-bold tabular-nums tracking-tight text-[#315de8]">{currency.format(summary.totalPay)}</span>
                        </div>
                    </div>
                    <p className="px-2 text-center text-xs leading-relaxed text-[#65718a]">
                        An estimate based on your entered rates. Breaks are unpaid, and public-holiday rates replace other rates.
                        Normal hours include the first weekend tier and all public-holiday hours; the remaining paid hours are overtime.
                        Daily amounts are displayed to cents; the weekly total is rounded once, so a small difference may occur.
                    </p>
                </>
            )}
        </section>
    );
};

export default Summary;
