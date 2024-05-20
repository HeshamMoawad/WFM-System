import { createContext,useState } from "react";
import  {Language} from '../types/base';
import { loadLang } from "../utils/storage";
import { ChildrenType } from "../types/base";


interface LanguageContextType {
    lang : Language ,
    setLang: React.Dispatch<React.SetStateAction<Language>>;
}


interface LanguageContextProviderProps extends ChildrenType {

}

const savedLang = loadLang()

const LanguageContext = createContext<LanguageContextType>({lang:savedLang,setLang:()=>{}});



const LanguageContextProvider = ({children}:LanguageContextProviderProps) => {
  const [lang, setLang] = useState<Language>(savedLang);
  return (
    <LanguageContext.Provider value={{lang,setLang}}>
        {children}
    </LanguageContext.Provider>
  );
}

export {
    LanguageContext , 
};
export default LanguageContextProvider;


