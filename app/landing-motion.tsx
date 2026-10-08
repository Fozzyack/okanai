"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

export default function LandingMotion({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const media = gsap.matchMedia();
            media.add(
                "(prefers-reduced-motion: no-preference)",
                () => {
                    const intro = gsap.timeline({
                        defaults: { ease: "power2.out" },
                    });

                    intro
                        .from("[data-hero-reveal]", {
                            y: 18,
                            opacity: 0,
                            duration: 0.65,
                            stagger: 0.09,
                            clearProps: "transform,opacity",
                        })
                        .from(
                            "[data-hero-illustration]",
                            {
                                y: 24,
                                opacity: 0,
                                duration: 0.9,
                                clearProps: "transform,opacity",
                            },
                            0.18,
                        )
                        .to(
                            "[data-hero-accent]",
                            {
                                y: -6,
                                duration: 1.2,
                                ease: "sine.inOut",
                                repeat: 1,
                                yoyo: true,
                                clearProps: "transform",
                            },
                            0.9,
                        );
                },
                root,
            );

            return () => {
                media.revert();
            };
        },
        { scope: root },
    );

    return (
        <div ref={root} className={className}>
            {children}
        </div>
    );
}
