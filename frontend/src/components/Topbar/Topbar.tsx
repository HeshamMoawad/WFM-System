import type { FC } from 'react';
import UserIcon from './UserIcon/UserIcon';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import LanguageChanger from '../LanguageChanger/LanguageChanger';
import Azkar from '../Azkar/Azkar';

interface TopbarProps {}

const Topbar: FC<TopbarProps> = () => {
    return (
    <div className='top-bar z-10 fixed w-screen top-0 flex flex-row h-16 min-h-16 md:h-[4.8rem] md:min-h-[4.5rem] shadow-sm bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg'>
        <div className="empty w-[100px] h-full md:w-[95px]">
        </div>
        <div className="top-bar-body flex gap-1 md:gap-2 flex-row-reverse items-center w-full h-full">
            <UserIcon/>
            <span className='bg-[gray] opacity-80 w-px h-2/3'></span>
            <NotificationIcon/>
            <LanguageChanger/>

        </div>
    </div>
    );
}

export default Topbar;
