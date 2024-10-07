import { createContext, useState } from "react";
import type { FC } from 'react';
import { ChildrenType } from "../types/base";


type Showed = number|null;

interface SidebarContextType {
    showed:Showed,
    setShowed:React.Dispatch<React.SetStateAction<Showed>>;
}

export const SidebarContext = createContext<SidebarContextType>({showed:null,setShowed:()=>{}})

interface SidebarContextProviderProps extends ChildrenType {}

const SidebarContextProvider: FC<SidebarContextProviderProps> = ({children}:SidebarContextProviderProps) => {
    const [showed , setShowed] = useState<Showed>(null)
    return (
    <SidebarContext.Provider value={{showed , setShowed}}>
        {children}
    </SidebarContext.Provider>);
}

export default SidebarContextProvider;
