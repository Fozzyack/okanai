type StepHeaderProps = {
    text: string;
    text_highlight: string;
};
const StepHeader = ({ text, text_highlight }: StepHeaderProps) => {
    return (
        <h2 className="text-5xl font-bold leading-[1.15] tracking-[-0.045em] text-black sm:text-6xl text-center">
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
