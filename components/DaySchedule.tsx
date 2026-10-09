import { DayScheduleProps } from "@/types/props";
import { stepToText } from "@/lib/calculate";
import StepHeader from "./StepHeader";

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
        </div>
    );
};
export default DaySchedule;
