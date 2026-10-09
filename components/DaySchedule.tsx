import { DayScheduleProps } from "@/types/props";
import { stepToText } from "@/lib/calculate";

const DaySchedule = ({ step, pay, weeklyHours, updateWeeklyHours, onNext }: DayScheduleProps) => {
    return <div>
        {stepToText(step)}
    </div>;
}
export default DaySchedule;
