import type { FC } from 'react';
import UserIcon from '../UserIcon/UserIcon';

interface TopbarProps {}

const Topbar: FC<TopbarProps> = () => {
    return (
    <div className='top-bar fixed w-screen top-0 flex flex-row h-16 min-h-16 md:h-[4.5rem] md:min-h-[4.5rem] shadow-sm bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg'>
        <div className="empty w-[100px] h-full md:w-[95px]">
        </div>
        <div className="top-bar-body flex flex-row-reverse w-full h-full">
            <UserIcon/>
        </div>
    </div>
    );
}

export default Topbar;
