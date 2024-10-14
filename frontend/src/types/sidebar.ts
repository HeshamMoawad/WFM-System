import type { IconType } from "react-icons";


export interface Perm {
    role: string;
    departments: string[];
    titles?:string[];
}


interface SideSection{
    name:string ,
    href:string, 
    Icon?:IconType ,
    permissions:Perm[]

}


interface SideItem {
    index?:number
    name : string ,
    Icon : IconType ,
    sections:SideSection[] ,
    permissions?:string[]

}


export type {
    SideSection ,
    SideItem
}