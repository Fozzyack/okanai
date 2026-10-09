"use client";

import type { StepHeaderProps } from "@/types/props";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const StepHeader = ({ text, text_highlight }: StepHeaderProps) => {
    const headerRef = useRef<HTMLHeadingElement>(null);

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
                        );
                },
                headerRef,
            );

            return () => media.revert();
        },
        {
            scope: headerRef,
            dependencies: [text, text_highlight],
            revertOnUpdate: true,
        },
    );

    return (
        <h2
            ref={headerRef}
            className="text-5xl font-bold leading-[1.15] tracking-[-0.045em] text-black sm:text-6xl text-center"
        >
            <span data-step-header-line className="block">{text}</span>
            <span data-step-header-line className="mt-1 block text-[#315de8]">
                <span className="relative inline-block">
                    <span
                        aria-hidden="true"
                        data-step-header-underline
                        className="absolute -bottom-1 -left-2 -right-2 h-3 -rotate-3 rounded-full bg-[#f7d9e5]"
                    />
                    <span className="relative">{text_highlight}</span>
                </span>
            </span>
        </h2>
    );
};

export default StepHeader;
