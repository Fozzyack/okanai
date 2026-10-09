import type { hoursWorked } from "@/types/calculate";
import { Steps, stepToText } from "@/lib/calculate";
import StepHeader from "./StepHeader";

type SummaryProps = {
    weeklyHours: hoursWorked[];
};

const formatTime = (minutes: number): string =>
    `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${(minutes % 60)
        .toString()
        .padStart(2, "0")}`;

const Summary = ({ weeklyHours }: SummaryProps) => (
    <section className="mx-auto flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-8 py-12 sm:gap-10">
        <StepHeader text="Your Week" text_highlight="Summary" />
        <ul className="space-y-4">
            {weeklyHours.map((day, index) => (
                <li
                    key={index}
                    className="rounded-3xl border-2 border-[#315de8]/25 bg-white px-6 py-5 shadow-[4px_5px_0_#edf2ff]"
                >
                    <h3 className="mb-3 text-lg font-bold text-[#315de8]">
                        {stepToText(Steps.MONDAY + index)}
                    </h3>
                    <dl className="space-y-2 text-sm text-[#182b51]">
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-[#65718a]">Shift</dt>
                            <dd className="text-right font-semibold tabular-nums">
                                {day.start === day.end
                                    ? "Not scheduled"
                                    : `${formatTime(day.start)} – ${formatTime(day.end)}`}
                            </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-[#65718a]">Break</dt>
                            <dd className="text-right font-semibold tabular-nums">
                                {day.break_time === 0
                                    ? "No break"
                                    : `${day.break_time} min`}
                            </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                            <dt className="text-[#65718a]">Public holiday</dt>
                            <dd className="font-semibold">
                                {day.is_public_holiday ? "Yes" : "No"}
                            </dd>
                        </div>
                    </dl>
                </li>
            ))}
        </ul>
    </section>
);

export default Summary;
