import  {useState, type FC } from 'react';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import AdvanceForm from '../../components/AdvanceForm/AdvanceForm';
import AdvanceHandling from '../../components/AdvanceHandling/AdvanceHandling';
import { checkPermission } from '../../utils/permissions/permissions';
// import { Link  } from 'react-router-dom';
interface AdvancesProps {}

const Advances: FC<AdvancesProps> = () => {
    const {auth} = useAuth()
    const [refresh,setRefresh] = useState(false)
    return (
        <div className='grid justify-items-center md:grid-cols-3'>
            {
                checkPermission(auth,"add_advance") ?
                <AdvanceForm className={` ${auth.role === "OWNER" || auth.is_superuser ? "col-span-1" : "col-span-full md:max-w-[400px]"}`} setRefresh={setRefresh} />
                :null
            }
            {
                checkPermission(auth,"handle_advance") ?
                <AdvanceHandling className='col-span-2' refresh={refresh} setRefresh={setRefresh} url='api/treasury/advance' />
                : null
            }
            {
                checkPermission(auth,"view_advance") ? 
                <AdvancesTable className='col-span-full' refresh={refresh} setRefresh={setRefresh} canDelete={auth.role === "OWNER" || auth.is_superuser}/>
                :null
            }
            
        </div>
    );
}

export default Advances;
