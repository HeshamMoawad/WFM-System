import { createContext,useEffect,useState } from "react";
import Authintication  ,{} from '../types/auth';
import { loadLogin, saveLogin } from "../utils/storage";
import { ChildrenType } from "../types/base";
import { sendRequest } from "../calls/base";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    auth : Authintication ,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>;
}

interface AuthContextProviderProps extends ChildrenType {
}

const login = loadLogin()

const AuthContext = createContext<AuthContextType>({auth:login, setAuth:()=>{} });



const AuthContextProvider = ({children}:AuthContextProviderProps) => {
  const [auth, setAuth] = useState<Authintication>(login);
  useEffect(()=>{
    console.log("relogin")
      sendRequest({
        url: "api/users/login",
        method: "POST",
        reloadWhenUnauthorized: false,
    })
        .then((data) => {
            setAuth({...data,_password:null});
            saveLogin({...data,_password:null});
        })
        .catch((err) => {
          if (!window.location.href.includes("login")){
            window.location.href = "/login"
          }
        })
  },[])
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