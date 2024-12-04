import { useState, type FC } from 'react';
import CoinChangerForm from '../../components/CoinChangerForm/CoinChangerForm';
import CoinChangerTable from '../../components/CoinChangerTable/CoinChangerTable';
import { useAuth } from '../../hooks/auth';
import { checkPermission } from '../../utils/permissions/permissions';

interface CoinChangerProps {}

const CoinChanger: FC<CoinChangerProps> = () => {
    const [refresh , setRefresh] = useState(false);
    const {auth} = useAuth()
    return (
    <div className='flex flex-col justify-center items-center'>
        {
            checkPermission(auth,"add_coinchanger") ?
            <CoinChangerForm setRefresh={setRefresh}/>
            :null
        }
        {
            checkPermission(auth,"view_coinchanger") ?
            <CoinChangerTable setRefresh={setRefresh} refresh={refresh}/>
            :null
        }
        
    </div>
    );
}

export default CoinChanger;
