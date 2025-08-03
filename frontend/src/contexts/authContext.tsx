import { createContext,useEffect,useState } from "react";
import Authintication  ,{} from '../types/auth';
import { loadLogin, saveLogin } from "../utils/storage";
import { ChildrenType } from "../types/base";
import { sendRequest } from "../calls/base";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    auth : Authintication ,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>;
    loading: boolean;
}

interface AuthContextProviderProps extends ChildrenType {
}

const login = loadLogin()

const AuthContext = createContext<AuthContextType>({auth:login, setAuth:()=>{}, loading: true });



const AuthContextProvider = ({children}:AuthContextProviderProps) => {
  const [auth, setAuth] = useState<Authintication>(login);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
          console.error("Login failed on mount:", err);
          if (!window.location.pathname.includes("login")) {
            navigate("/login");
          }
        })
        .finally(() => {
            setLoading(false);
        })
  },[navigate])
  return (
    <AuthContext.Provider value={{auth , setAuth, loading}}>
        {children}
    </AuthContext.Provider>
  );

}

export {
  AuthContext , 
};
export default AuthContextProvider;