import  {useState, type FC } from 'react';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import AdvanceForm from '../../components/AdvanceForm/AdvanceForm';
// import { Link  } from 'react-router-dom';
interface AdvancesProps {}

const Advances: FC<AdvancesProps> = () => {
    const {auth} = useAuth()
    const [refresh,setRefresh] = useState(false)
    return (
        <div className='grid justify-items-center'>
            <AdvanceForm setRefresh={setRefresh} />
            <AdvancesTable refresh={refresh} setRefresh={setRefresh}/>

        </div>
    );
}

export default Advances;
