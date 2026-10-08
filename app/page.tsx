import Link from "next/link";
import LandingMotion from "./landing-motion";

function Arrow({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Check() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="m5 10 3 3 7-7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Home() {
    return (
        <LandingMotion className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 sm:px-10 lg:px-20">
            <header className="flex h-24 items-center justify-between border-b border-[#182b51]/10 sm:h-28">
                <Link
                    href="/"
                    aria-label="Okanai home"
                    className="flex items-center gap-2.5"
                >
                    <span
                        className="relative flex h-8 w-8 items-center justify-center"
                        aria-hidden="true"
                    >
                        <span className="absolute left-0 top-0 h-6 w-4 -rotate-35 rounded-full bg-[#315de8]" />
                        <span className="absolute bottom-0 right-0 h-6 w-4 -rotate-35 rounded-full bg-[#eea9c6]" />
                    </span>
                    <span className="text-2xl font-bold tracking-[-1.2px]">
                        okanai<span className="text-[#315de8]">.</span>
                    </span>
                </Link>
                <nav
                    aria-label="Main navigation"
                    className="flex items-center gap-8"
                >
                    <Link
                        href="/calculate"
                        className="flex items-center gap-3 rounded-full border border-[#182b51]/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#315de8] hover:bg-[#eaf0ff]"
                    >
                        Calculate <Arrow className="h-4 w-4" />
                    </Link>
                </nav>
            </header>

            <main className="flex flex-1 flex-col">
                <section
                    aria-labelledby="hero-heading"
                    className="grid items-center gap-8 py-14 lg:min-h-[650px] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-20"
                >
                    <div className="relative z-10">
                        <div
                            data-hero-reveal
                            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#315de8]/15 bg-[#edf2ff] px-3.5 py-2 text-[11px] font-semibold tracking-[1.5px] text-[#315de8]"
                        >
                        </div>
                        <h1
                            data-hero-reveal
                            id="hero-heading"
                            className="max-w-xl text-[clamp(3.6rem,6.4vw,6.2rem)] font-semibold leading-[1.04] tracking-[-0.065em]"
                        >
                            Your hard work.
                            <br />
                            <span className="relative inline-block text-[#315de8]">
                                Your pay.
                                <svg
                                    className="absolute -bottom-3 left-0 w-full text-[#efb2cd]"
                                    height="17"
                                    viewBox="0 0 390 17"
                                    preserveAspectRatio="none"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M3 12C85 2 245 1 386 9"
                                        stroke="currentColor"
                                        strokeWidth="7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                            <br />
                            Made simple.
                        </h1>
                        <p
                            data-hero-reveal
                            className="mb-8 mt-8 max-w-[385px] text-base leading-7 text-[#65718a] sm:text-lg"
                        >
                            From weekday shifts to weekend hustle. Get a clearer
                            picture of what you earn, without the spreadsheet
                            headache.
                        </p>
                        <div data-hero-reveal className="inline-block">
                            <Link
                                href="/calculate"
                                className="inline-flex items-center gap-8 rounded-full bg-[#315de8] px-7 py-4 text-sm font-semibold text-white shadow-[0_6px_20px_#315de825] transition-all hover:-translate-y-0.5 hover:bg-[#254cc9]"
                            >
                                Calculate my pay <Arrow />
                            </Link>
                        </div>
                        <div
                            data-hero-reveal
                            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#65718a]"
                        >
                            <span className="flex items-center gap-1.5">
                                <span className="text-[#315de8]">
                                    <Check />
                                </span>{" "}
                                Free to use
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-[#315de8]">
                                    <Check />
                                </span>{" "}
                                No sign-up needed
                            </span>
                        </div>
                    </div>

                    <div
                        data-hero-illustration
                        className="relative isolate mx-auto flex min-h-[450px] w-full max-w-[570px] items-center justify-center sm:min-h-[510px]"
                        aria-label="Illustrative pay card with an example estimated gross pay of 1,632.35 AUD"
                    >
                        <div className="absolute inset-x-2 inset-y-6 -z-10 rounded-[48%_48%_42%_42%] bg-[#f6dce6] sm:inset-x-4" />
                        <div className="absolute left-1 top-14 h-24 w-24 rounded-full border-[20px] border-[#cbdcf8] sm:-left-3 sm:h-32 sm:w-32" />
                        <svg
                            data-hero-accent
                            className="absolute -right-1 top-5 h-20 w-20 text-[#315de8] sm:right-6"
                            viewBox="0 0 80 80"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="m40 5 4 26 22-15-15 22 25 3-25 4 15 22-22-15-4 24-4-24-22 15 15-22L5 41l24-3-15-22 22 15 4-26Z"
                                fill="currentColor"
                            />
                        </svg>

                        <div className="relative mx-5 w-full max-w-[350px] -rotate-3 rounded-[22px] border border-[#182b51]/5 bg-white p-6 shadow-[0_20px_55px_-15px_#734e7138] sm:p-7">
                            <div className="flex items-center justify-between border-b border-[#edf0f5] pb-5">
                                <div>
                                    <p className="text-sm font-semibold">
                                        A little clarity, at a glance
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#65718a]">
                                        Your shift, broken down.
                                    </p>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2ff] text-[#315de8]">
                                    <svg
                                        width="19"
                                        height="19"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="5"
                                            y="3"
                                            width="14"
                                            height="18"
                                            rx="3"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                            </div>
                            <div className="space-y-4 py-6 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#65718a]">
                                        Day worked
                                    </span>
                                    <span className="font-medium">
                                        Sunday{" "}
                                        <span className="ml-1 text-[#315de8]">
                                            ☀
                                        </span>
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#65718a]">
                                        Base hourly pay
                                    </span>
                                    <span className="font-medium">$25.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#65718a]">
                                        Hours worked
                                    </span>
                                    <span className="font-medium">8 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#65718a]">
                                        Weekend rates
                                    </span>
                                    <span className="rounded-full bg-[#fceaf2] px-2 py-0.5 font-semibold text-[#9e456c]">
                                        1.5× then 2×
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#edf2ff] p-4">
                                <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#65718a]">
                                    Estimated gross pay
                                </p>
                                <div className="mt-1 flex items-end justify-between">
                                    <p className="text-[42px] font-semibold leading-tight tracking-[-2px] text-[#315de8]">
                                        $1,632
                                        <span className="text-[27px]">.35</span>
                                    </p>
                                    <span className="mb-2 text-[10px] text-[#65718a]">
                                        AUD
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-center text-[10px] text-[#65718a]">
                                An example estimate. Before tax & deductions.
                            </p>
                        </div>

                        <div className="absolute -right-1 bottom-14 flex rotate-6 items-center gap-3 rounded-2xl border border-white/80 bg-[#dce9fb] px-4 py-3 shadow-[0_8px_24px_#182b5110] sm:right-0 sm:bottom-20">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#315de8]">
                                <Check />
                            </span>
                            <div>
                                <p className="text-xs font-semibold">
                                    Weekend work counts.
                                </p>
                                <p className="mt-0.5 text-[10px] text-[#65718a]">
                                    So does every extra hour.
                                </p>
                            </div>
                        </div>
                        <svg
                            className="absolute bottom-10 left-2 h-12 w-16 text-[#315de8] sm:bottom-14 sm:left-8"
                            viewBox="0 0 70 55"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M5 45C7 20 32 10 50 19m-9-13 13 15-20 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="absolute bottom-0 right-12 text-[10px] font-medium tracking-wide text-[#7d596c]">
                            BIG EFFORT. CLEAR NUMBERS.
                        </span>
                    </div>
                </section>
            </main>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#182b51]/10 py-6 text-[11px] text-[#65718a]">
                <p>Made for the hours you put in.</p>
                <p>Estimates only. Your actual payroll rules may differ.</p>
            </footer>
        </LandingMotion>
    );
}
