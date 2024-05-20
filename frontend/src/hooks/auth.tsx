import  { useContext} from 'react';
import Authintication from '../types/auth';
import { AuthContext } from '../contexts/authContext';

interface useAuthProps {}

interface useAuthReturns {
    auth:Authintication ,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>;
}

export const useAuth = ():useAuthReturns => {
    const {auth , setAuth} = useContext(AuthContext);
    return {
        auth ,
        setAuth
    };
}

//  default useAuth;
