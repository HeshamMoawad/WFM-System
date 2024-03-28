import type { FC } from "react";

interface NotificationCardProps {
    text:string ,
    time:string
}

const NotificationCard: FC<NotificationCardProps> = ({text , time}) => {
    return (
        <div className="flex justify-center items-center w-full bg-light-colors-dashboard-primary-bg dark:bg-dark-colors-dashboard-secondry-bg border-r-4 border-primary rounded-lg h-fit px-4 py-2 ">
            <span className="w-3/12 md:w-2/12 text-sm text-left text-primary">
                {time}
            </span>
            <span className="w-9/12 md:w-10/12">
                {text}
            </span>
        </div>
    );
};

export default NotificationCard;
