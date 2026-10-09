import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
    fullWidth?: boolean;
};

const buttonStyles =
    "rounded-3xl bg-[#315de8] px-8 py-4 text-center text-base font-bold text-white shadow-[0_5px_0_#2348ba] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#254cc9] hover:shadow-[0_7px_0_#2348ba] active:translate-y-1 active:shadow-[0_1px_0_#2348ba] motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315de8] disabled:pointer-events-none disabled:opacity-50";

const Button = ({
    className,
    children,
    fullWidth = false,
    type = "button",
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={[buttonStyles, fullWidth && "w-full", className]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
