import { useState, type FC } from "react";
import { GrNotification } from "react-icons/gr";
import NotificationCard from "../NotificationCard/NotificationCard";

interface NotificationIconProps {}

const NotificationIcon: FC<NotificationIconProps> = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    return (
        <>
            <div className="flex flex-row justify-end items-center h-full w-24 md:w-[100px]">
                <GrNotification
                    className="opacity-80 h-7 md:h-8 w-fit"
                    onClick={() => {
                        setShowMenu(!showMenu);
                    }}
                />

                {/* Notification Dot */}
                <div className="relative top-2 w-3 h-full">
                    <span className="block relative animate-ping top-2 w-2 h-2 bg-[red] rounded-full"></span>
                </div>
                
                
                {/* Notification Dropdown body */}
                <div
                    className={`${
                        showMenu ? "" : "hidden"
                    } absolute top-16 md:top-[4.5rem] right-10 md:right-60 z-10 w-72 md:w-[35rem] rounded-lg bg-light-colors-login-secondry-bg shadow-md dark:bg-dark-colors-dashboard-primary-bg`}
                >
                    <ul className="py-2 text-base flex flex-col justify-center items-center">
                        <span className="pt-5 text-xl text-primary">
                            Notifications
                        </span>
                        <span className="bg-[gray] my-5  opacity-80 w-full h-[1px]"></span>

                        <div className="flex flex-col items-center justify-start max-h-80 md:max-h-[35rem] overflow-y-auto overflow-x-hidden pb-4">
                            <div className="flex flex-col flex-nowrap gap-5 justify-center items-center text-right  px-4 py-2">
                                <NotificationCard
                                    text={`
                                 شسيشهسياخشهس شسهي شسه يتحشخس يةىحشخس هابخشهس تابشهنتس خهبش سهتاشجس بهتشسخج هبتشسج حخبشخهجس بخحه اسشخبهاشس حخهاب
                                `}
                                    time="10 hrs"
                                />
                                <NotificationCard
                                    text={`
                                 شسيشهسياخشهس شسهي شسه يتحشخس يةىحشخس هابخشهس تابشهنتس خهبش سهتاشجس بهتشسخج هبتشسج حخبشخهجس بخحه اسشخبهاشس حخهاب
                                `}
                                    time="10 hrs"
                                />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationIcon;
