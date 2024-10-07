import  {useState, type FC } from 'react';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import AdvanceForm from '../../components/AdvanceForm/AdvanceForm';
import AdvanceHandling from '../../components/AdvanceHandling/AdvanceHandling';
// import { Link  } from 'react-router-dom';
interface AdvancesProps {}

const Advances: FC<AdvancesProps> = () => {
    const {auth} = useAuth()
    const [refresh,setRefresh] = useState(false)
    return (
        <div className='grid justify-items-center md:grid-cols-3'>
            <AdvanceForm className={` ${auth.role === "OWNER" || auth.is_superuser ? "col-span-1" : "col-span-full md:max-w-[400px]"}`} setRefresh={setRefresh} />
            {
                auth.role === "OWNER" || auth.is_superuser ? (
                <>
                    <AdvanceHandling className='col-span-2' refresh={refresh} setRefresh={setRefresh} url='api/treasury/advance' />
                </>
                ) : null
            }
            <AdvancesTable className='col-span-full' refresh={refresh} setRefresh={setRefresh} canDelete={auth.role === "OWNER" || auth.is_superuser}/>
            
        </div>
    );
}

export default Advances;
