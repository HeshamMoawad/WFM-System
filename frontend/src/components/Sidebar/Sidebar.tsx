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
import {RiCustomerService2Line , RiUserAddLine , RiListSettingsLine , RiTeamLine} from 'react-icons/ri';
import {CgUserList} from 'react-icons/cg';
import { useAuth } from '../../hooks/auth';
import { GrNotification } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import {FaHandHoldingUsd} from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import { HiOutlineDocumentReport , HiOutlineDocumentAdd , HiOutlineDocumentText   } from "react-icons/hi";




interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    const {lang} = useContext(LanguageContext)
    const Items : SideItem[] = [
        {
            name : TRANSLATIONS.SideBar.DashBoard.title[lang] ,
            Icon : RxDashboard ,
            permissions:[
                "OWNER",
                "MANAGER",
                "AGENT",
                "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.DashBoard.title[lang],
                    href:'/dashboard',
                    Icon:RxDashboard , 
                    permissions:[
                        {role : "AGENT" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
                },
            ]
        },
        {
            name : TRANSLATIONS.SideBar.FPDetails.title[lang],
            Icon : PiFingerprint ,
            sections:[
                {
                    name:TRANSLATIONS.SideBar.FPDetails.Requests[lang],
                    href:'/requests',
                    Icon:VscGitPullRequestNewChanges,
                    permissions:[
                        {role : "*" , departments : ["*"]} ,
                    ],
                },
                {
                    name:TRANSLATIONS.SideBar.FPDetails.AttendanceDetails[lang],
                    href:'/attendance-details',
                    Icon:IoCalendarNumberOutline,
                    permissions:[
                        {role : "*" , departments : ["*"]} ,
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.FPDetails.SalaryList[lang],
                    href:'/my-salary-list',
                    Icon:FaHandHoldingUsd,
                    permissions:[
                        {role : "AGENT" , departments : ["*"]} ,
    
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.Treasury.Advance[lang],
                    href:'/advances',
                    Icon:PiHandCoins ,
                    permissions:[
                        {role : "AGENT" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                }

            ]
    
        },
        {
            name:TRANSLATIONS.SideBar.ReportSocial.title[lang],
            Icon:HiOutlineDocumentReport ,
            permissions:[
                "OWNER",
                "MANAGER",
                "AGENT",
                ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.ReportSocial.report[lang],
                    href:'/add-report-social',
                    Icon:HiOutlineDocumentAdd,
                    permissions:[
                        {role : "OWNER" , departments : ["Marketing"]} ,
                        {role : "MANAGER" , departments : ["Marketing"]} ,
                        {role : "AGENT" , departments : ["Marketing"]} ,
                    ],
                },
                {
                    name:TRANSLATIONS.SideBar.ReportSocial.view[lang],
                    href:'/reports',
                    Icon:HiOutlineDocumentText,
                    permissions:[
                        {role : "OWNER" , departments : ["Marketing"]} ,
                        {role : "MANAGER" , departments : ["Marketing"]} ,
                        {role : "AGENT" , departments : ["Marketing"]} ,
                    ],
                },

            ]
        },
        {
            name : TRANSLATIONS.SideBar.Basic.title[lang],
            Icon:PiMoney ,
            permissions:[
                "OWNER",
                // "MANAGER",
                // "AGENT",
                "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Basic.title[lang],
                    href:'/basic',
                    Icon:PiMoney,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                },
            ]
    
        },{
            name : TRANSLATIONS.SideBar.Commission.title[lang],
            Icon:PiWallet ,
            permissions:[
                "OWNER",
                "MANAGER",
                // "AGENT",
                // "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Commission.Marketing[lang],
                    href:'/salary-marketing',
                    Icon:BsPersonWorkspace ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["Marketing"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.Sales[lang],
                    href:'/salary-sales',
                    Icon:RiCustomerService2Line ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["Sales"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.Technical[lang],
                    href:'/salary-technichal',
                    Icon:PiChartLine ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["Technical"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.General[lang],
                    href:'/salary-general',
                    Icon:CgUserList ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["General"]} ,
    
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.All[lang],
                    href:'/salary-all',
                    Icon:PiUsersThree ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.CoinChanger[lang],
                    href:'/coin-changer',
                    Icon:BsCashCoin ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["Sales"]} ,
                    ],
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.Leads[lang],
                    href:'/leads',
                    Icon:FaUsersLine, 
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["Marketing"]} ,
                    ],
    
                }
    
    
            ]
    
        },{
            name : TRANSLATIONS.SideBar.Users.title[lang],
            Icon : LiaUsersCogSolid ,
            permissions:[
                "OWNER",
                "MANAGER",
                // "AGENT",
                "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Users.AddUser[lang],
                    href:'/add-user',
                    Icon:RiUserAddLine ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.Users.UsersList[lang],
                    href:'/users-list',
                    Icon:PiUserList ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.Users.DeviceAccess[lang],
                    href:'/devices-access',
                    Icon:BiDevices ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        // {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.Users.Teams[lang],
                    href:'/teams',
                    Icon:RiTeamLine ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        // {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
    
                },
            ]
    
        },
        {
            name : TRANSLATIONS.SideBar.General.title[lang],
            Icon:RiListSettingsLine ,
            permissions:[
                "OWNER",
                // "MANAGER",
                // "AGENT",
                "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.General.Notification[lang],
                    href:'/notifications',
                    Icon:GrNotification, 
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                        {role : "HR" , departments : ["*"]} ,
                        {role : "MANAGER" , departments : ["*"]} ,
                    ],
    
                },
            ]
    
        },
        {
            name:TRANSLATIONS.SideBar.Treasury.title[lang],
            Icon:BsSafe,
            permissions:[
                "OWNER",
                // "MANAGER",
                // "AGENT",
                // "HR",
            ],
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Treasury.title[lang],
                    href:'/treasury',
                    Icon:BsSafe ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                    ],
    
                },
                {
                    name:TRANSLATIONS.SideBar.Treasury.Advance[lang],
                    href:'/advances',
                    Icon:PiHandCoins ,
                    permissions:[
                        {role : "OWNER" , departments : ["*"]} ,
                    ],
    
                }
            ]
    
        }
    ]
    
    const [opened , setOpened] = useState<boolean>(false)
    const {auth} = useAuth()
    const {setShowed} = useContext(SidebarContext)
    const toggleSidebar = useCallback(() => {
        setOpened(prevOpened => !prevOpened);
        if (opened) {
            setShowed(null);
        }
    }, [opened,setShowed]);
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
