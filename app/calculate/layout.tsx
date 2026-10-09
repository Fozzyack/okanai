import Link from "next/link";

const CalculateLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-white relative min-h-screen w-full flex flex-col items-center justify-center">
            <div className="absolute inset-4 md:inset-8">
                {" "}
                <Link href={"/"} className="">
                    {"<-"} Home
                </Link>
            </div>
            {children}
        </div>
    );
};

export default CalculateLayout;
