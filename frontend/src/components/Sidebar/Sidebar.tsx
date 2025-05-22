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
import {IoCalendarNumberOutline , IoStatsChartOutline } from 'react-icons/io5';
import {RiCustomerService2Line , RiUserAddLine , RiListSettingsLine , RiTeamLine} from 'react-icons/ri';
import {CgUserList} from 'react-icons/cg';
import { useAuth } from '../../hooks/auth';
import { GrNotification } from "react-icons/gr";
import { BiDevices , BiSolidUserDetail  } from "react-icons/bi";
import {FaHandHoldingUsd} from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { TRANSLATIONS } from '../../utils/constants';
import { textToNumber } from '../../utils/converter';
import { LanguageContext } from '../../contexts/LanguageContext';
import { HiOutlineDocumentReport , HiOutlineDocumentAdd , HiOutlineDocumentText   } from "react-icons/hi";
import { MdOutlineAnalytics , MdDirectionsRun } from "react-icons/md";
import { IconType } from 'react-icons';
import { checkPagePermission } from '../../utils/permissions/permissions';
import { AiOutlineUserDelete } from "react-icons/ai";
import { TbCalendarDollar } from "react-icons/tb";
import { MdOutlineMoneyOff } from "react-icons/md";




interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    const {lang} = useContext(LanguageContext)

    const Items:SideItem[] = [
        {
            name : TRANSLATIONS.SideBar.DashBoard.title[lang] ,
            Icon : RxDashboard ,
            page_index:textToNumber("main-dashboard"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.DashBoard.title[lang],
                    href:'/dashboard',
                    Icon:RxDashboard , 
                    page_index:textToNumber("dashboard"),
                },
                {
                    name:TRANSLATIONS.SideBar.DashBoard.market[lang],
                    href:'/dashboard-market',
                    Icon:MdOutlineAnalytics ,
                    page_index:textToNumber("market-dashboard"),
                },
            ]
        },
        {
            name : TRANSLATIONS.SideBar.FPDetails.title[lang],
            Icon : PiFingerprint ,
            page_index:textToNumber("main-fp-details"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.FPDetails.Requests[lang],
                    href:'/requests',
                    Icon:VscGitPullRequestNewChanges,
                    page_index:textToNumber("requests"),
                },
                {
                    name:TRANSLATIONS.SideBar.FPDetails.AttendanceDetails[lang],
                    href:'/attendance-details',
                    page_index:textToNumber("fp-details"),
                    Icon:IoCalendarNumberOutline,
                },
                {
                    name:TRANSLATIONS.SideBar.FPDetails.AttendanceDetailsLated[lang],
                    href:'/attendance-details-lated',
                    page_index:textToNumber("fp-details-lated"),
                    Icon:MdDirectionsRun,
                },
                {
                    name:TRANSLATIONS.ActionPlan.title[lang],
                    href:'/my-action-plans',
                    page_index:textToNumber("my-action-plans"),
                    Icon:MdOutlineMoneyOff,
                },
                {
                    name:TRANSLATIONS.SideBar.FPDetails.SalaryList[lang],
                    href:'/my-salary-list',
                    page_index:textToNumber("my-salary-list"),
                    Icon:FaHandHoldingUsd,
                },
                {
                    name:TRANSLATIONS.SideBar.Treasury.Advance[lang],
                    href:'/advances',
                    page_index:textToNumber("my-advances"),
                    Icon:PiHandCoins ,    
                }

            ]
        },
        {
            name:TRANSLATIONS.SideBar.ReportSocial.title[lang],
            Icon:HiOutlineDocumentReport ,
            page_index:textToNumber("main-report-social"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.ReportSocial.report[lang],
                    href:'/add-report-social',
                    page_index:textToNumber("add-report-social"),
                    Icon:HiOutlineDocumentAdd,
                },
                {
                    name:TRANSLATIONS.SideBar.ReportSocial.view[lang],
                    href:'/reports',
                    page_index:textToNumber("show-report-social"),
                    Icon:HiOutlineDocumentText,
                },
                {
                    name:TRANSLATIONS.SideBar.ReportSocial.oldlead[lang],
                    href:'/old-lead',
                    page_index:textToNumber("add-old-lead"),
                    Icon:AiOutlineUserDelete,
                },

            ]
        },
        {
            name : TRANSLATIONS.SideBar.Basic.title[lang],
            Icon:PiMoney ,
            page_index:textToNumber("main-basic"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Basic.title[lang],
                    href:'/basic',
                    page_index:textToNumber("basic"),
                    Icon:PiMoney,
                },
                {
                    name:TRANSLATIONS.SideBar.Basic.actionPlan[lang],
                    href:'/action-plans',
                    page_index:textToNumber("action-plans"),
                    Icon:MdOutlineMoneyOff,
                },
            ]
    
        },
        {
            name : TRANSLATIONS.SideBar.Commission.title[lang],
            Icon:PiWallet ,
            page_index:textToNumber("main-commission"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Commission.Marketing[lang],
                    href:'/salary-marketing',
                    page_index:textToNumber("market-commission"),
                    Icon:BsPersonWorkspace ,
                },{
                    name:TRANSLATIONS.SideBar.Commission.Sales[lang],
                    href:'/salary-sales',
                    page_index:textToNumber("sales-commission"),
                    Icon:RiCustomerService2Line ,
    
                },{
                    name:TRANSLATIONS.SideBar.Commission.Technical[lang],
                    href:'/salary-technichal',
                    page_index:textToNumber("technical-commission"),
                    Icon:PiChartLine ,
                },{
                    name:TRANSLATIONS.SideBar.Commission.General[lang],
                    href:'/salary-general',
                    page_index:textToNumber("general-commission"),
                    Icon:CgUserList ,
                },{
                    name:TRANSLATIONS.SideBar.Commission.All[lang],
                    href:'/salary-all',
                    page_index:textToNumber("all-commission"),
                    Icon:PiUsersThree ,
                },{
                    name:TRANSLATIONS.SideBar.Commission.CoinChanger[lang],
                    href:'/coin-changer',
                    page_index:textToNumber("coin-changer"),
                    Icon:BsCashCoin ,
                },{
                    name:TRANSLATIONS.SideBar.Commission.Leads[lang],
                    href:'/leads',
                    page_index:textToNumber("market-leads"),
                    Icon:FaUsersLine, 
                }
            ]
    
        },
        {
            name : TRANSLATIONS.SideBar.Users.title[lang],
            Icon : LiaUsersCogSolid ,
            page_index:textToNumber("main-users"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Users.AddUser[lang],
                    href:'/add-user',
                    page_index:textToNumber("add-user"),
                    Icon:RiUserAddLine ,
                },
                {
                    name:TRANSLATIONS.SideBar.Users.UsersList[lang],
                    href:'/users-list',
                    page_index:textToNumber("users-list"),
                    Icon:PiUserList ,
                },
                {
                    name:TRANSLATIONS.SideBar.Users.DeviceAccess[lang],
                    href:'/devices-access',
                    page_index:textToNumber("devices-access"),
                    Icon:BiDevices ,
                },
                {
                    name:TRANSLATIONS.SideBar.Users.Teams[lang],
                    href:'/teams',
                    page_index:textToNumber("teams"),
                    Icon:RiTeamLine ,
                },
                {
                    name:TRANSLATIONS.SideBar.Users.TeamsPreview[lang],
                    href:'/teams-details',
                    page_index:textToNumber("teams-details"),
                    Icon:BiSolidUserDetail ,
                },
            ]
    
        },
        {
            name : TRANSLATIONS.SideBar.General.title[lang],
            Icon:RiListSettingsLine ,
            page_index:textToNumber("main-general"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.General.Notification[lang],
                    href:'/notifications',
                    page_index:textToNumber("notification"),////////////////////////////
                    Icon:GrNotification,     
                },
                {
                    name:TRANSLATIONS.SideBar.General.SalaryHistory[lang],
                    href:'/salary-history',
                    page_index:textToNumber("salary-history"),////////////////////////////
                    Icon:TbCalendarDollar ,     
                },
            ]
    
        },
        {
            name:TRANSLATIONS.SideBar.Treasury.title[lang],
            Icon:BsSafe,
            page_index:textToNumber("main-treasury"),
            sections:[
                {
                    name:TRANSLATIONS.SideBar.Treasury.title[lang],
                    href:'/treasury',
                    Icon:BsSafe ,
                    page_index:textToNumber("treasury"),
                },
                {
                    name:TRANSLATIONS.SideBar.Treasury.treasuryProjects[lang],
                    href:'/treasury-projects',
                    Icon:IoStatsChartOutline ,
                    page_index:textToNumber("treasury-projects"),
                },
                {
                    name:TRANSLATIONS.SideBar.Treasury.Advance[lang],
                    href:'/advances',
                    page_index:textToNumber("advances"),
                    Icon:PiHandCoins ,
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
                        if (checkPagePermission(auth,item.page_index)){
                            return (
                                <SidebarItem  key={index}  {...{...item , index }} setOpened={setOpened}/>
                                )
                        }
                    })
                }
            </nav>

        </div>

    );
}

export default Sidebar;
