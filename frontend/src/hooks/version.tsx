import  { useContext} from 'react';
import { VersionContext } from '../contexts/versionContext';

interface useVersionProps {}

interface useVersionReturns {
    version:string ,
    setVersion: React.Dispatch<React.SetStateAction<string>>;
}

export const useAuth = ():useVersionReturns => {
    const {version , setVersion} = useContext(VersionContext);
    return {
        version ,
        setVersion
    };
}

//  default useAuth;
