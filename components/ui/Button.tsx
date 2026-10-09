import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
    fullWidth?: boolean;
    variant?: "primary" | "secondary" | "ghost" | "link";
};

const buttonStyles =
    "text-center transition-[color,background-color,box-shadow,transform] duration-200 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315de8] disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer";

const raisedButtonStyles =
    "rounded-3xl px-8 py-4 text-base font-bold hover:-translate-y-0.5 active:translate-y-1";

const variantStyles = {
    primary:
        "bg-[#315de8] text-white shadow-[0_5px_0_#2348ba] hover:bg-[#254cc9] hover:shadow-[0_7px_0_#2348ba] active:shadow-[0_1px_0_#2348ba]",
    secondary:
        "bg-slate-100 text-slate-700 shadow-[0_5px_0_#cbd5e1] hover:bg-slate-200 hover:shadow-[0_7px_0_#cbd5e1] active:shadow-[0_1px_0_#cbd5e1]",
    ghost: "rounded-xl bg-transparent px-4 py-3 text-sm font-semibold text-[#315de8] hover:bg-blue-50 active:bg-blue-100",
    link: "rounded-lg bg-transparent px-3 py-3 text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-700 active:text-slate-900",
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

const Button = ({
    className,
    children,
    fullWidth = false,
    variant = "primary",
    type = "button",
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            style={{ outline: "none" }}
            className={[
                buttonStyles,
                (variant === "primary" || variant === "secondary") &&
                    raisedButtonStyles,
                variantStyles[variant],
                fullWidth && "w-full",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
