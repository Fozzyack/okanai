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
            <input
                id="break-minutes"
                type="number"
                min={0}
                max={maxMinutes}
                step={1}
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
                className="w-full rounded-3xl border-2 border-[#315de8]/25 bg-white px-6 py-5 text-4xl font-medium tabular-nums text-[#182b51] shadow-[4px_5px_0_#edf2ff] focus:border-[#315de8]"
            />
            <p id="break-help" className="pl-1 text-sm text-[#65718a]">
                Enter 0 for no break. Maximum: {maxMinutes} minutes.
            </p>
        </div>
    );
};

export default BreakDurationSection;
