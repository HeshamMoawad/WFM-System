import { useState,useCallback, type FC, useContext } from 'react';
import './Sidebar.css'
import SidebarItem from '../SidebarItem/SidebarItem';
import SVGIcon from '../SVGIcon/SVGIcon';
import type {SideItem} from '../../types/sidebar';
import {SidebarContext} from '../../contexts/SidebarContext';

import {RxDashboard} from 'react-icons/rx';
import {PiFingerprint , PiWallet , PiUserList , PiUsersThree} from 'react-icons/pi';
import {LiaUsersCogSolid} from 'react-icons/lia';
import {RiListSettingsLine} from 'react-icons/ri';
import {VscGitPullRequestNewChanges} from 'react-icons/vsc';
import {BsPersonWorkspace,BsSafe , BsBuildingAdd , BsDatabaseAdd} from 'react-icons/bs';
import {IoCalendarNumberOutline} from 'react-icons/io5';
import {RiCustomerService2Line , RiUserAddLine} from 'react-icons/ri';
import {CgUserList} from 'react-icons/cg';
import {PiChartLine} from 'react-icons/pi';


const Items : SideItem[] = [
    {
        name : "Dashboard" ,
        Icon : RxDashboard ,
        sections:[
            {
                name:'Dashboard',
                href:'/dashboard',
                Icon:RxDashboard
            },
        ]
    },
    {
        name : 'FP Details',
        Icon : PiFingerprint ,
        sections:[
            {
                name:'Requests',
                href:'#p',
                Icon:VscGitPullRequestNewChanges
            },
            {
                name:'Attendance Details',
                href:'#p',
                Icon:IoCalendarNumberOutline
            }
        ]

    },
    {
        name : 'Salary',
        Icon:PiWallet ,
        sections:[
            {
                name:'Marketing',
                href:'#p',
                Icon:BsPersonWorkspace
            },
            {
                name:'Sales',
                href:'#p',
                Icon:RiCustomerService2Line
            },
            {
                name:'Technichal',
                href:'#p',
                Icon:PiChartLine
            },
            {
                name:'General',
                href:'#p',
                Icon:CgUserList
            },
            {
                name:'All',
                href:'#p',
                Icon:PiUsersThree
            },
        ]

    },
    {
        name : "Users",
        Icon : LiaUsersCogSolid ,
        sections:[
            {
                name:'Add User',
                href:'#p',
                Icon:RiUserAddLine
            },
            {
                name:'Users List',
                href:'#p',
                Icon:PiUserList
            },
        ]

    },
    {
        name : "General",
        Icon:RiListSettingsLine ,
        sections:[
            {
                name:'Add Project',
                href:'#p',
                Icon:BsBuildingAdd
            },
            {
                name:'Add Treasury',
                href:'#p',
                Icon:BsDatabaseAdd
            },
        ]

    },
    {
        name:"Treasury",
        Icon:BsSafe,
        sections:[
            {
                name:'Treasury List',
                href:'#p',
                Icon:BsSafe
            }
        ]

    }
]


interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    const [opened , setOpened] = useState<boolean>(false)
    const {setShowed} = useContext(SidebarContext)
    const toggleSidebar = useCallback(() => {
        setOpened(prevOpened => !prevOpened);
        if (opened) {
            setShowed(null);
        }
    }, [opened]);
    return (

        <div className={`side-bar ${opened ? 'h-screen bg-light-colors-dashboard-forth-bg' : 'h-[63px] md:h-[72px] bg-transparent' }`}>
            <div className="project-logo"  onClick={toggleSidebar}>
                <SVGIcon className={`cursor-pointer h-12 md:h-14 ${opened ? 'fill-[white]' : 'fill-[black] dark:fill-[white]'}`} pathfilling={`${opened ? 'fill-light-colors-dashboard-forth-bg' : 'fill-light-colors-dashboard-primary-bg dark:fill-light-colors-dashboard-forth-bg'}`}/>
            </div>
            <span className='text-xs font-bold block'>WFM-System</span>

            <nav>
                {
                    Items.map((item,index)=>{
                        return (
                        <SidebarItem key={index}  {...{...item , index }}/>
                        )
                    })
                }
            </nav>

        </div>

    );
}

export default Sidebar;
