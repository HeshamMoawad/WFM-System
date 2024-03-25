import { useState, type FC } from 'react';
import DefaultProfilePic from '../DefaultProfilePic/DefaultProfilePic';
import { CgProfile , CgLogOut  } from "react-icons/cg";

interface UserIconProps {}

const UserIcon: FC<UserIconProps> = () => {
    const [showMenu , setShowMenu] = useState<boolean>(false)
    return (
    <div className='user-icon w-7/12 h-full md:w-[15%] cursor-pointer' onClick={e=>setShowMenu(!showMenu)}>
        <div className='container flex flex-row w-full h-full'>
            <div className="icon flex flex-col justify-center  w-[35%] md:w-3/12">
                <div className="flex justify-center items-center rounded-full h-14 w-14 md:w-14 md:h-14 bg-[#c4cce3]">
                    <DefaultProfilePic width={'48'}  />
                </div>
            </div>
            <div className="info flex flex-col justify-center px-2 text-xs md:text-lg">
                <span className='block'>Ahmed Gamal </span>
                <span className='block opacity-55'>Sales</span>
            </div>
        </div>
        <div id="dropdownDots" className={`${showMenu ? '' : 'hidden'} mt-1 z-10 w-40 md:w-52 rounded-lg bg-[white] shadow-md dark:bg-dark-colors-login-secondry-bg`}>
            <ul className="py-2 text-base flex flex-col justify-center items-center" aria-labelledby="dropdownMenuIconButton">
                <li>
                    <a href="#s" className="flex justify-center items-center gap-3 px-4 py-2 ">
                        <CgProfile />
                        <span>Profile</span>
                    </a>
                </li>
                <span className='block w-10/12 h-[1px] px-3 bg-[gray] opacity-30'></span>
                <li>
                    <a href="#s" className="flex justify-center items-center gap-3 px-4 py-2">
                        <CgLogOut />
                        <span>Logout</span>
                    </a>
                </li>


            </ul>
        </div>

        {/* <div className="relative bg-[red]">
            tttt
            <ul className='absolute bg-[green]'>
                <li>ttt</li>
                <li>ttt</li>
                <li>ttt</li>
                <li>ttt</li>
            </ul>
        </div> */}
    </div>
    );
}

export default UserIcon;
