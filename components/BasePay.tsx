"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import StepHeader from "./StepHeader";
import { BasePayInputProps } from "@/types/props";
import Button from "./ui/Button";

gsap.registerPlugin(useGSAP);

const BasePayInput = ({
    pay,
    onChangePay,
    onNext,
    errMsg,
}: BasePayInputProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    useGSAP(
        () => {
            const media = gsap.matchMedia();
            media.add(
                "(prefers-reduced-motion: no-preference)",
                () => {
                    gsap.timeline({ defaults: { ease: "power3.out" } })
                        .from("[data-step-header-line]", {
                            y: 16,
                            opacity: 0,
                            duration: 0.55,
                            stagger: 0.1,
                            clearProps: "transform,opacity",
                        })
                        .from(
                            "[data-step-header-underline]",
                            {
                                scaleX: 0,
                                transformOrigin: "left center",
                                duration: 0.45,
                                ease: "back.out(1.4)",
                                clearProps: "transform,transformOrigin",
                            },
                            0.25,
                        )
                        .from(
                            "[data-pay-reveal]",
                            {
                                y: 14,
                                opacity: 0,
                                duration: 0.5,
                                stagger: 0.12,
                                clearProps: "transform,opacity",
                            },
                            0.2,
                        );
                },
                formRef,
            );

            return () => media.revert();
        },
        { scope: formRef },
    );

    return (
        <form
            ref={formRef}
            className="mx-auto flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-8 py-12 sm:gap-10"
        >
            <StepHeader text="Enter Base" text_highlight="Pay" />
            <div data-pay-reveal className="w-full space-y-3">
                <label
                    htmlFor="base-pay"
                    className="block pl-1 text-sm font-semibold text-[#182b51]"
                >
                    Base hourly rate
                </label>
                <div className="flex items-center gap-3 rounded-3xl border-2 border-[#315de8]/25 bg-white px-6 py-5 shadow-[4px_5px_0_#edf2ff] duration-200 hover:border-[#315de8]/50 focus-within:border-[#315de8] focus-within:shadow-[4px_5px_0_#dce5ff] focus-within:-translate-y-1 focus-within:scale-105 transition-all">
                    <span className="text-2xl font-bold text-[#315de8]">$</span>
                    <input
                        id="base-pay"
                        value={pay}
                        onChange={(e) => onChangePay(e.target.value)}
                        type="number"
                        aria-label="Base hourly rate in Australian dollars"
                        aria-invalid={Boolean(errMsg)}
                        aria-describedby={errMsg ? "base-pay-error" : undefined}
                        placeholder="0.00"
                        style={{ outline: "none" }}
                        className="w-full min-w-0 bg-transparent text-left text-4xl font-medium leading-tight tabular-nums tracking-[-0.04em] text-[#182b51] outline-none placeholder:text-[#182b51]/25"
                    />
                    <span className="shrink-0 text-xs font-semibold tracking-wide text-[#65718a]">
                        AUD
                    </span>
                </div>
                <p
                    id="base-pay-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="min-h-5 pl-1 text-sm font-medium text-red-600"
                >
                    {errMsg}
                </p>
            </div>
            <div data-pay-reveal>
                <Button fullWidth onClick={onNext}>
                    Next
                </Button>
            </div>
        </form>
    );
};

export default BasePayInput;
