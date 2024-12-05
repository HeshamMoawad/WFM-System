import { createContext,useEffect,useState } from "react";
import { AUTH_KEY, loadVersion, VERSION_KEY } from "../utils/storage";
import { ChildrenType } from "../types/base";
import { CURRENT_VERSION } from "../utils/constants";

type VersionContextType = {
    version : string ,
    setVersion: React.Dispatch<React.SetStateAction<string>>;
}

interface VersionContextProviderProps extends ChildrenType {
}

const cVersion = loadVersion()

const VersionContext = createContext<VersionContextType>({version:cVersion, setVersion:()=>{} });



const VersionContextProvider = ({children}:VersionContextProviderProps) => {
  const [version, setVersion] = useState<string>(cVersion);
  if (version === "" || version !== CURRENT_VERSION ){
      localStorage.removeItem(AUTH_KEY)
      console.log("deleted",version)
      localStorage.setItem(VERSION_KEY,CURRENT_VERSION)
  }
  return (
    <VersionContext.Provider value={{version , setVersion}}>
        {children}
    </VersionContext.Provider>
  );
}

export {
  VersionContext , 
};
export default VersionContextProvider;