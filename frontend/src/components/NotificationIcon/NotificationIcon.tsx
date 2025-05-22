import { useEffect, useState, type FC } from "react";
import { GrNotification } from "react-icons/gr";
import NotificationCard from "./NotificationCard/NotificationCard";
import { sendRequest } from "../../calls/base";
import { getDateDifference } from "../../utils/converter";
import { useAuth } from "../../hooks/auth";
import { NotificationType } from "../../types/auth";
import { showNotification } from "./Notification";

interface NotificationIconProps {}

const NotificationIcon: FC<NotificationIconProps> = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [hasNew,setHasNew]= useState(false);
    const [refresh , setRefresh] = useState(false);
    const {auth} = useAuth()
    const fetcher = ()=>{
            sendRequest({
                url:"api/treasury/my-notification",
                method:"GET"
            }).then((data)=>{
                setNotifications(data);
                const _ = data as NotificationType[]

                if(_.filter(noti=>!noti.seen_by_users.includes(auth.uuid)).length > 0){  
                    setHasNew(true);
                }else{
                    setHasNew(false);
                }
                _.filter(noti=>!noti.seen_by_users.includes(auth.uuid)).forEach(noti=>{
                    showNotification(noti.message,noti.uuid)
                })
            }).catch((error)=>{
                console.log(error);
            })
        }
    useEffect(()=>{
        fetcher()
        const interval = setInterval(fetcher,50000);
        return ()=> clearInterval(interval);
    },[refresh])
    return (
        <>
            <div className="flex flex-row justify-end items-center h-full w-fit ">
                <GrNotification
                    className="opacity-80 h-7 md:h-8 w-fit"
                    onClick={() => {
                        setShowMenu(!showMenu);
                    }}
                />

                {/* Notification Dot */}
                <div className="relative top-2 w-3 h-full">
                    <span className={`${hasNew?"bg-btns-colors-secondry" : ""} block relative w-3 h-3 animate-bounce rounded-lg text-[black] text-center`}></span>
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
                                {
                                    notifications?.map(notification => <NotificationCard
                                        setRefresh={setRefresh}
                                        key={notification.uuid}
                                        text={notification.message}
                                        uuid={notification.uuid}
                                        time={`${getDateDifference(new Date(notification.created_at), new Date())} hrs`}
                                        seen={notification.seen_by_users.includes(auth.uuid)}
                                    />)
                                }
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationIcon;
