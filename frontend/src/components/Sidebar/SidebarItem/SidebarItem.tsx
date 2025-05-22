import { useCallback, type FC, useContext } from "react";
import type {  SideItem } from '../../../types/sidebar';
import {SidebarContext} from '../../../contexts/SidebarContext';
import SidebarPopup from "../SidebarPopup/SidebarPopup";
import { Link } from "react-router-dom";

interface SidebarItemProps extends  SideItem{
    href?: string;
    setOpened?: React.Dispatch<React.SetStateAction<boolean>>;
    index?:number
}


const SidebarItem: FC<SidebarItemProps> = ({
            Icon,
            name = "",
            href = "#s",
            index = 0,
            sections,
            setOpened
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
                <div className="hover:fill-primary hover:text-primary cursor-grab">
                    <Icon className="w-full h-7"/>
                    <span className="text-sm opacity-80">{name}</span>
                </div>
            </li>
            <SidebarPopup setOpened={setOpened} index={index} name={name} sections={sections} />

        </>
    );
};

export default SidebarItem;
