import { useCallback, type FC, useContext } from "react";
import type {  SideItem } from '../../types/sidebar';
import {SidebarContext} from '../../contexts/SidebarContext';
import SidebarPopup from "../SidebarPopup/SidebarPopup";

interface SidebarItemProps extends  SideItem{
    href?: string;
}


const SidebarItem: FC<SidebarItemProps> = ({
            Icon,
            name = "",
            href = "#s",
            index = 0,
            sections,
        }: SidebarItemProps) => {
    const { setShowed } = useContext(SidebarContext)
    const toggleLi = useCallback(()=>{
        setShowed(prev => {
            if (prev === null){
                return index
            }else if (prev === index){
                return null
            }
            return index
        })        
    },[])
    return (
        <>
            <span className="w-full h-[1px] bg-[gray] opacity-30"></span>
            <li className="block w-full text-center overflow-hidden" onClick={toggleLi}>
                <a href={href} className="hover:fill-primary hover:text-primary">
                    <Icon className="w-full h-7"/>
                    <span className="text-sm opacity-80">{name}</span>
                </a>
            </li>
            <SidebarPopup index={index} name={name} sections={sections} />

        </>
    );
};

export default SidebarItem;
