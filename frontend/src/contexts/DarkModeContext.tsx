import { createContext,useState } from "react";
import  {DarkModeType} from '../types/base';
import { loadMode } from "../utils/storage";
import { ChildrenType } from "../types/base";

type ModeContextType = {
    mode : DarkModeType ,
    setMode: React.Dispatch<React.SetStateAction<DarkModeType>>;
}

interface ModeContextProviderProps extends ChildrenType {
}

const savedMode = loadMode()

const ModeContext = createContext<ModeContextType>({mode:savedMode, setMode:()=>{} });



const ModeContextProvider = ({children}:ModeContextProviderProps) => {
  const [mode, setMode] = useState<DarkModeType>(savedMode);
  return (
    <ModeContext.Provider value={{mode, setMode}}>
        {children}
    </ModeContext.Provider>
  );
}

export {
    ModeContext , 
};
export default ModeContextProvider;