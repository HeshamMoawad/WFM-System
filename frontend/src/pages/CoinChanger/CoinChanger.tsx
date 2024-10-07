import { useState, type FC } from 'react';
import CoinChangerForm from '../../components/CoinChangerForm/CoinChangerForm';
import CoinChangerTable from '../../components/CoinChangerTable/CoinChangerTable';

interface CoinChangerProps {}

const CoinChanger: FC<CoinChangerProps> = () => {
    const [refresh , setRefresh] = useState(false);
    return (
    <div className='flex flex-col justify-center items-center'>
        <CoinChangerForm setRefresh={setRefresh}/>
        <CoinChangerTable setRefresh={setRefresh} refresh={refresh}/>
    </div>
    );
}

export default CoinChanger;
