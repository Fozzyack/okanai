import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "./calculator";
import CalculatorHelp from "./help-modal";

export const metadata: Metadata = {
  title: "Payroll calculator | okanai",
  description: "Build your week, one shift at a time. Estimate weekly gross pay with clear weekend and daily overtime assumptions.",
};

export default function CalculatePage() {
  return (
    <div className="relative min-h-svh text-[#182b51]">
      <Link href="/" className="absolute left-6 top-6 rounded-full px-3 py-2 text-xs font-medium text-[#65718a] transition-colors hover:bg-[#edf2ff] hover:text-[#315de8] sm:left-8 sm:top-8"><span aria-hidden="true">← </span>Home</Link>
      <main className="flex min-h-svh items-center justify-center px-5 py-24 sm:px-8">
        <Calculator />
      </main>
      <CalculatorHelp />
    </div>
  );
}
