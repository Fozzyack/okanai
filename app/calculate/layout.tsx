import Link from "next/link";
import CalculatorHelp from "./help-modal";

const CalculateLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white relative min-h-screen w-full flex flex-col items-center justify-center">
            <div className="absolute inset-4">
                {" "}
                <Link href={"/"} className="">
                    {"<-"} Home
                </Link>
            </div>
            <div className="absolute bottom-4 right-4">
                <CalculatorHelp />
            </div>
            {children}
        </div>
    );
};

export default CalculateLayout;
