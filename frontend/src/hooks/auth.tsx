import  { useContext} from 'react';
import Authintication from '../types/auth';
import { AuthContext } from '../contexts/authContext';

interface useAuthProps {}

interface useAuthReturns {
    auth:Authintication ,
}

export const useAuth = ():useAuthReturns => {
    const {auth} = useContext(AuthContext);
    return {
        auth
    };
}

//  default useAuth;
