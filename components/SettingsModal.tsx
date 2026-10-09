"use client";

import { useEffect, useRef, useState } from "react";
import { PaySettings } from "@/types/calculate";
import Button from "./ui/Button";


type SettingsModalProps = {
    values: PaySettings;
    onSave: (settings: PaySettings) => void;
};

const groups: {
    title: string;
    fields: { name: keyof PaySettings; label: string; unit: "×" | "hours" }[];
}[] = [
    {
        title: "Weekday overtime",
        fields: [
            { name: "bonusPay1", label: "First pay multiplier (overtime)", unit: "×" },
            { name: "bonus1After", label: "First rate starts after ", unit: "hours" },
            { name: "bonusPay2", label: "Second pay multiplier (overtime 2)", unit: "×" },
            { name: "bonus2After", label: "Second rate starts after", unit: "hours" },
        ],
    },
    {
        title: "Weekend rates",
        fields: [
            { name: "weekendBonus1", label: "First pay multiplier", unit: "×" },
            { name: "weekendBonus2", label: "Second pay multiplier", unit: "×" },
            { name: "weekendOvertimeAfter", label: "Overtime starts after", unit: "hours" },
        ],
    },
    {
        title: "Public holidays",
        fields: [
            { name: "publicHolidayBonus", label: "Pay multiplier", unit: "×" },
        ],
    },
];

const SettingsModal = ({ values, onSave }: SettingsModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return (
        <>
            <Button
                variant="ghost"
                aria-haspopup="dialog"
                onClick={() => {
                    formRef.current?.reset();
                    setIsOpen(true);
                }}
                className="inline-flex items-center gap-2"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" d="M4 7h16M4 17h16" />
                    <circle cx="9" cy="7" r="3" fill="var(--background)" />
                    <circle cx="15" cy="17" r="3" fill="var(--background)" />
                </svg>
                Settings
            </Button>
            <dialog
                ref={dialogRef}
                aria-labelledby="pay-settings-title"
                aria-describedby="pay-settings-description"
                onCancel={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (
                        event.clientX < bounds.left || event.clientX > bounds.right ||
                        event.clientY < bounds.top || event.clientY > bounds.bottom
                    ) setIsOpen(false);
                }}
                className="m-auto max-h-[85dvh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto rounded-3xl border-2 border-[#315de8]/20 bg-[#fffaf8] p-0 text-[#182b51] shadow-2xl backdrop:bg-[#182b51]/40 backdrop:backdrop-blur-sm"
            >
                <form
                    ref={formRef}
                    className="space-y-6 p-6 sm:p-8"
                    onSubmit={(event) => {
                        event.preventDefault();
                        const data = new FormData(event.currentTarget);
                        const settings = { ...values };
                        for (const { fields } of groups) {
                            for (const { name, unit } of fields) {
                                const value = Number(data.get(name));
                                if (!Number.isFinite(value) || value < (unit === "×" ? 0.01 : 0)) return;
                                settings[name] = value;
                            }
                        }
                        onSave(settings);
                        setIsOpen(false);
                    }}
                >
                    <header className="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="pay-settings-title" className="text-3xl font-bold tracking-tight">Pay settings</h2>
                            <p id="pay-settings-description" className="mt-2 text-sm leading-relaxed text-[#65718a]">
                                Adjust your rates and overtime thresholds. Multipliers are applied to your base pay.
                            </p>
                        </div>
                        <Button variant="ghost" aria-label="Close settings" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true" className="text-xl">×</span>
                        </Button>
                    </header>
                    {groups.map(({ title, fields }) => (
                        <fieldset key={title} className="space-y-3">
                            <legend className="mb-3 text-sm font-bold text-[#315de8]">{title}</legend>
                            <div className="grid grid-cols-1 gap-4">
                                {fields.map(({ name, label, unit }) => (
                                    <div key={name} className="space-y-2">
                                        <label htmlFor={`settings-${name}`} className="block pl-1 text-sm font-semibold">{label}</label>
                                        <div className="flex items-center gap-3 rounded-2xl border-2 border-[#315de8]/25 bg-white px-4 py-3 shadow-[3px_4px_0_#edf2ff] transition-colors hover:border-[#315de8]/50 focus-within:border-[#315de8]">
                                            <input
                                                id={`settings-${name}`}
                                                name={name}
                                                type="number"
                                                required
                                                min={unit === "×" ? 0.01 : 0}
                                                step="any"
                                                defaultValue={values[name]}
                                                className="w-full min-w-0 bg-transparent text-2xl font-medium tabular-nums outline-none"
                                            />
                                            <span className="shrink-0 text-xs font-semibold text-[#65718a]">{unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    ))}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#315de8]/15 pt-6 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit">Save settings</Button>
                    </div>
                </form>
            </dialog>
        </>
    );
};

export default SettingsModal;
