import  { useContext,type FC, useMemo } from 'react';
import {SidebarContext} from '../../../contexts/SidebarContext';
import { SideSection } from '../../../types/sidebar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth';
import { checkPermissions } from '../../../utils/params';

interface SidebarPopupProps {
    name:string,
    index:number , 
    sections:SideSection[] ,
    setOpened?:React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarPopup: FC<SidebarPopupProps> = ({name,index,sections , setOpened }:SidebarPopupProps) => {
    const {showed , setShowed} = useContext(SidebarContext)
    const {auth} = useAuth()
    const style = useMemo(()=>{
        return showed === index ? 'w-60 md:w-72':'w-0 opacity-0 overflow-hidden'
    },[showed])
    return (
    <div className={`${style} h-screen transition-all duration-1000 fixed top-16 left-[5.6rem] md:top-[4.5rem] md:left-[6.1rem] bg-light-colors-login-secondry-bg dark:bg-dark-colors-dashboard-forth-bg`}>
        <div className="container opacity-80 text-[black] dark:text-[white]">
        <h1 className="text-lg pt-4 pl-5">{name.toLocaleUpperCase()}</h1>
        <ul className="pt-6 space-y-6">
            {
                sections.map((section,index)=>{
                    if (checkPermissions(auth,section.permissions)) {

                        return (
                            <li key={index}>
                                <Link 
                                    to={section.href}
                                    className="pl-10 md:pl-16 flex justify-start items-center gap-3 hover:text-primary hover:fill-primary"
                                    onClick={e=>{
                                        if(setOpened){setOpened(prev=>!prev)} 
                                        setShowed(null)
                                    }}
                                    >
                                        {
                                            section.Icon ? (
                                                <section.Icon className="w-6 h-6 opacity-80"/>
                                            ):
                                            null
                                        }
                                    <span className="text-lg">{section.name}</span>
                                </Link>
                            </li>                    
                        );
                    }
                    return null;
                })
            }
        </ul>
        </div>
    </div>
);
}

export default SidebarPopup;
