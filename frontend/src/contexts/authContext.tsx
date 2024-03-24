import { createContext,useState } from "react";
import Authintication  ,{} from '../types/auth';
import { loadLogin } from "../utils/storage";

type AuthContextType = {
    auth : Authintication ,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>;
}

interface AuthContextProviderProps {
    children?: string | JSX.Element | JSX.Element[] ;
}

const login = loadLogin()

const AuthContext = createContext<AuthContextType>({auth:login, setAuth:()=>{} });



const AuthContextProvider = ({children}:AuthContextProviderProps) => {
  const [auth, setAuth] = useState<Authintication>(login);
  return (
    <AuthContext.Provider value={{auth , setAuth}}>
        {children}
    </AuthContext.Provider>
  );
}

export {
  AuthContext , 
};
export default AuthContextProvider;