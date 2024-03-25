import { useState, type FC, useEffect } from 'react';
import './Sidebar.css'
import SidebarItem from '../SidebarItem/SidebarItem';
import SVGIcon from '../SVGIcon/SVGIcon';
import type { IconType } from 'react-icons';
import {RxDashboard} from 'react-icons/rx';
import {PiFingerprint , PiWallet} from 'react-icons/pi';
import {LiaUsersCogSolid} from 'react-icons/lia';
import {RiListSettingsLine} from 'react-icons/ri';
import {BsSafe} from 'react-icons/bs';


interface SideItem {
    name : string ,
    Icon? : IconType ,
}


const Items : SideItem[] = [
    {
        name : "Dashboard" ,
        Icon : RxDashboard ,
    },
    {
        name : 'FP Details',
        Icon : PiFingerprint
    },
    {
        name : 'Salary',
        Icon:PiWallet
    },
    {
        name : "Users",
        Icon : LiaUsersCogSolid
    },
    {
        name : "General",
        Icon:RiListSettingsLine

    },
    {
        name:"Treasury",
        Icon:BsSafe
    }
]



interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    const [opened , setOpened] = useState<boolean>(false)
    useEffect(()=>{
        console.log(`${opened}`)
    },[opened])
    
    return (
        <div className={`side-bar ${opened ? 'h-screen bg-light-colors-dashboard-forth-bg' : 'h-[63px] md:h-[72px] bg-transparent' }`}>
            <div className="project-logo"  onClick={()=>setOpened(!opened)}>
                <SVGIcon className={`cursor-pointer h-12 md:h-14 ${opened ? 'fill-[white]' : 'fill-[black] dark:fill-[white]'}`} pathFilling={`${opened ? 'fill-light-colors-dashboard-forth-bg' : 'fill-light-colors-dashboard-primary-bg dark:fill-light-colors-dashboard-forth-bg'}`}/>
            </div>
            <span className='text-xs font-bold block '>WFM-System</span>
            <nav>
                {
                    Items.map(item=>{
                        return (
                        <>
                        <span className='w-full h-[1px] bg-[gray] opacity-30'></span>
                        <SidebarItem {...item}/>
                        </>
                        )
                    })
                }
            </nav>
        </div>
    );
}

export default Sidebar;
