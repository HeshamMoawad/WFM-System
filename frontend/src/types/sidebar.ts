import type { IconType } from "react-icons";



interface SideSection{
    name:string ,
    href:string, 
    Icon?:IconType ,

}


interface SideItem {
    index?:number
    name : string ,
    Icon : IconType ,
    sections:SideSection[]

}


export type {
    SideSection ,
    SideItem
}