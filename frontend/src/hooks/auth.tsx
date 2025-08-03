import  { useContext} from 'react';
import Authintication from '../types/auth';
import { AuthContext } from '../contexts/authContext';

interface useAuthProps {}

interface useAuthReturns {
    auth:Authintication ,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>;
    loading: boolean;
}

export const useAuth = ():useAuthReturns => {
    const {auth , setAuth, loading} = useContext(AuthContext);
    return {
        auth ,
        setAuth,
        loading
    };
}

//  default useAuth;
