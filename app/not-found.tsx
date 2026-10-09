import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page not found — Okanai",
    description: "This page could not be found. Head home or start calculating your weekly pay.",
};

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 sm:px-10 lg:px-20">
            <main className="flex flex-1 flex-col items-center justify-center py-12 text-center sm:py-16">
                <Link href="/" aria-label="Okanai home" className="mb-6 rounded-lg sm:mb-8">
                    <Image
                        src="/logo.svg"
                        alt="Okanai"
                        width={266}
                        height={64}
                        className="h-9 w-auto sm:h-10"
                    />
                </Link>
                <svg
                    aria-hidden="true"
                    viewBox="0 0 360 260"
                    fill="none"
                    className="w-full max-w-[320px] sm:max-w-[360px]"
                >
                    <ellipse cx="180" cy="236" rx="98" ry="10" fill="#edf2ff" />
                    <circle cx="194" cy="124" r="106" fill="#f7d9e5" opacity="0.5" />
                    <circle cx="72" cy="172" r="17" fill="#edf2ff" />
                    <circle cx="290" cy="72" r="8" fill="#efb2cd" />
                    <path d="M58 75h16M66 67v16M294 181h18M303 172v18" stroke="#efb2cd" strokeWidth="3" strokeLinecap="round" />
                    <path d="M90 44l-10-7M271 34l8-11" stroke="#315de8" strokeWidth="3" strokeLinecap="round" />
                    <g transform="rotate(-10 180 130)">
                        <path d="m136 202-12 25M224 202l12 25" stroke="#2348ba" strokeWidth="10" strokeLinecap="round" />
                        <path d="M113 66c-11-22 7-40 28-31M219 35c21-9 39 9 28 31" fill="#315de8" />
                        <circle cx="180" cy="135" r="85" fill="#2348ba" />
                        <circle cx="180" cy="127" r="85" fill="#315de8" />
                        <circle cx="180" cy="127" r="71" fill="#fffaf8" />
                        <circle cx="180" cy="127" r="64" stroke="#edf2ff" strokeWidth="2" />
                        <path d="M180 66v7M180 181v7M119 127h7M234 127h7M137 84l5 5M218 165l5 5M137 170l5-5M218 89l5-5" stroke="#315de8" strokeWidth="3" strokeLinecap="round" />
                        <path d="M180 127V88M180 127l23 30" stroke="#182b51" strokeWidth="6" strokeLinecap="round" />
                        <path d="m180 127-28 14" stroke="#efb2cd" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="180" cy="127" r="7" fill="#315de8" />
                        <circle cx="180" cy="127" r="3" fill="#fffaf8" />
                    </g>
                    <path d="M280 120c17 9 20 27 8 41" stroke="#315de8" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
                </svg>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#65718a]">
                    404 — Page not found
                </p>
                <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.045em] text-[#182b51] sm:text-5xl">
                    This page has clocked out.
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[#65718a] sm:text-base">
                    The page you’re looking for may have moved or doesn’t exist.
                    Let’s get you back on track.
                </p>
                <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
                    <Link
                        href="/"
                        className="rounded-3xl bg-[#315de8] px-8 py-4 text-sm font-bold text-white shadow-[0_5px_0_#2348ba] transition-[background-color,box-shadow,translate] duration-200 hover:bg-[#254cc9] hover:shadow-[0_7px_0_#2348ba] motion-safe:hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-[#f7d9e5] active:shadow-[0_1px_0_#2348ba] motion-safe:active:translate-y-1"
                    >
                        Back home
                    </Link>
                    <Link
                        href="/calculate"
                        className="rounded-3xl border border-[#315de8]/20 px-8 py-4 text-sm font-semibold text-[#315de8] transition-colors hover:border-[#315de8]/50 hover:bg-[#edf2ff] focus-visible:outline-4 focus-visible:outline-[#f7d9e5]"
                    >
                        Calculate your pay <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </main>
            <footer className="border-t border-[#182b51]/10 py-6 text-center text-xs text-[#65718a]">
                Your hard work. Your pay. Made simple.
            </footer>
        </div>
    );
}
