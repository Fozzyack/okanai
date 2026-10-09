"use client";

import { useState } from "react";

type BreakDurationSectionProps = {
    minutes: number;
    maxMinutes: number;
    errMsg: string;
    onChange: (minutes: number) => void;
};

const BreakDurationSection = ({
    minutes,
    maxMinutes,
    errMsg,
    onChange,
}: BreakDurationSectionProps) => {
    const [draft, setDraft] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            <label
                htmlFor="break-minutes"
                className="block pl-1 text-sm font-semibold text-[#182b51]"
            >
                Break duration (minutes)
            </label>
            <div className="flex items-center gap-3 rounded-3xl border-2 border-[#315de8]/25 bg-white px-6 py-5 shadow-[4px_5px_0_#edf2ff] transition-all duration-200 hover:border-[#315de8]/50 focus-within:border-[#315de8] focus-within:shadow-[4px_5px_0_#dce5ff] motion-safe:focus-within:-translate-y-1 motion-safe:focus-within:scale-105">
                <input
                    id="break-minutes"
                    type="number"
                    min={0}
                    max={maxMinutes}
                    step={1}
                    style={{outline: "none"}}
                    value={draft ?? minutes}
                    onChange={(event) => {
                        const value =
                            event.target.value === ""
                                ? 0
                                : event.target.valueAsNumber;
                        if (Number.isFinite(value)) {
                            const duration = Math.min(
                                maxMinutes,
                                Math.max(0, Math.floor(value)),
                            );
                            setDraft(event.target.value === "" ? "" : null);
                            onChange(duration);
                        }
                    }}
                    aria-describedby="break-help schedule-error"
                    aria-invalid={Boolean(errMsg)}
                    className="w-full min-w-0 bg-transparent text-left text-4xl font-medium leading-tight tabular-nums tracking-[-0.04em] text-[#182b51] outline-none placeholder:text-[#182b51]/25"
                />
                <span className="shrink-0 text-xs font-semibold tracking-wide text-[#65718a]">
                    MIN
                </span>
            </div>
            <p id="break-help" className="pl-1 text-sm text-[#65718a]">
                Enter 0 for no break. Maximum: {maxMinutes} minutes.
            </p>
        </div>
    );
};

export default BreakDurationSection;
