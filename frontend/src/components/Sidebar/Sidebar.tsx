import { useState,useCallback, type FC, useContext } from 'react';
import './Sidebar.css'
import SidebarItem from './SidebarItem/SidebarItem';
import SVGIcon from './SVGIcon/SVGIcon';
import type {SideItem} from '../../types/sidebar';
import {SidebarContext} from '../../contexts/SidebarContext';
import {RxDashboard} from 'react-icons/rx';
import {PiFingerprint , PiWallet , PiUserList , PiUsersThree , PiMoney , PiHandCoins , PiChartLine} from 'react-icons/pi';
import {LiaUsersCogSolid} from 'react-icons/lia';
import {VscGitPullRequestNewChanges} from 'react-icons/vsc';
import {BsPersonWorkspace,BsSafe , BsCashCoin } from 'react-icons/bs';
import {IoCalendarNumberOutline} from 'react-icons/io5';
import {RiCustomerService2Line , RiUserAddLine , RiListSettingsLine} from 'react-icons/ri';
import {CgUserList} from 'react-icons/cg';
import { useAuth } from '../../hooks/auth';
import { GrNotification } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import {FaHandHoldingUsd} from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";

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
                href:'/requests',
                Icon:VscGitPullRequestNewChanges
            },
            {
                name:'Attendance Details',
                href:'/attendance-details',
                Icon:IoCalendarNumberOutline
            },
            {
                name:'My Salary List',
                href:'/attendance-details',
                Icon:FaHandHoldingUsd
            }
        ]

    },{
        name : 'Basic',
        Icon:PiMoney ,
        permissions:[
            "OWNER",
            // "MANAGER",
            // "AGENT",
            "HR",
        ],
        sections:[
            {
                name:'Basic',
                href:'/basic',
                Icon:PiMoney
            },
        ]

    },{
        name : 'Commission',
        Icon:PiWallet ,
        permissions:[
            "OWNER",
            // "MANAGER",
            // "AGENT",
            // "HR",
        ],
        sections:[
            {
                name:'Marketing',
                href:'#p',
                Icon:BsPersonWorkspace
            },{
                name:'Sales',
                href:'#p',
                Icon:RiCustomerService2Line
            },{
                name:'Technichal',
                href:'#p',
                Icon:PiChartLine
            },{
                name:'General',
                href:'#p',
                Icon:CgUserList
            },{
                name:'All',
                href:'/salary-all',
                Icon:PiUsersThree
            },{
                name:'Coin Changer',
                href:'/coin-changer',
                Icon:BsCashCoin
            },
        ]

    },{
        name : "Users",
        Icon : LiaUsersCogSolid ,
        permissions:[
            "OWNER",
            "MANAGER",
            // "AGENT",
            "HR",
        ],
        sections:[
            {
                name:'Add User',
                href:'/add-user',
                Icon:RiUserAddLine
            },
            {
                name:'Users List',
                href:'/users-list',
                Icon:PiUserList
            },
            {
                name:'Devices Access',
                href:'/devices-access',
                Icon:BiDevices
            },
        ]

    },
    {
        name : "General",
        Icon:RiListSettingsLine ,
        permissions:[
            "OWNER",
            // "MANAGER",
            // "AGENT",
            "HR",
        ],
        sections:[
            {
                name:'General Settings',
                href:'#p',
                Icon:RiListSettingsLine,//BsBuildingAdd
            },
            {
                name:'Notifications',
                href:'/notifications',
                Icon:GrNotification,//BsBuildingAdd
            },
            {
                name:'Leads',
                href:'/leads',
                Icon:FaUsersLine,//BsBuildingAdd
            }
        ]

    },
    {
        name:"Treasury",
        Icon:BsSafe,
        permissions:[
            "OWNER",
            // "MANAGER",
            // "AGENT",
            // "HR",
        ],
        sections:[
            {
                name:'Treasury',
                href:'/treasury',
                Icon:BsSafe
            },
            {
                name:'Advances',
                href:'/advances',
                Icon:PiHandCoins
            }
        ]

    }
]


interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    const [opened , setOpened] = useState<boolean>(false)
    const {auth} = useAuth()
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

                        if (!item.permissions) {
                            return (
                                <SidebarItem  key={index}  {...{...item , index }} setOpened={setOpened}/>
                                )
                        }else {
                            if (item.permissions.includes(auth.role) || auth.is_superuser) {
                                return (
                                    <SidebarItem  key={index}  {...{...item , index }} setOpened={setOpened}/>
                                )
                            }else {
                                return null
                            }
                        }
                    })
                }
            </nav>

        </div>

    );
}

export default Sidebar;
