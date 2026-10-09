import { DayScheduleProps } from "@/types/props";
import { stepToText } from "@/lib/calculate";
import StepHeader from "./StepHeader";
import Button from "./ui/Button";

const DaySchedule = ({
    step,
    pay,
    weeklyHours,
    updateWeeklyHours,
    onNext,
    errMsg,
}: DayScheduleProps) => {
    return (
        <div>
            <StepHeader
                text="Set Schedule for"
                text_highlight={stepToText(step)}
            />

            <Button fullWidth onClick={onNext}>
                Next
            </Button>
        </div>
    );
};
export default DaySchedule;
