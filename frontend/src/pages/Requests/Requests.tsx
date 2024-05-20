import  {type FC , useState} from 'react';
import RequestTable from '../../components/RequestTable/RequestTable';
import RequestHandling from '../../components/RequestHandling/RequestHandling';
import RequestAddForm from '../../components/RequestAddForm/RequestAddFrom';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';

interface RequestsProps {}

const Requests: FC<RequestsProps> = () => {
    const [refresh , setRefresh ]= useState<object>({})
    const {auth} = useAuth()

    return (
    <div className='grid grid-flow-row md:grid-flow-col md:grid-cols-5 place-content-center justify-items-center'> 
        <RequestAddForm refresh={refresh} setRefresh={setRefresh} className='col-span-2 h-fit w-[35rem] relative '/>
        <div className='col-span-3 flex flex-col gap-5'>
            <RequestTable refresh={refresh} setRefresh={setRefresh} className='w-[900px] max-h-[600px] h-fit min-h-[100px] relative'/>
            {
                auth.role === "OWNER" || auth.role === "MANAGER" ? 
                <>
                    <RequestHandling refresh={refresh} setRefresh={setRefresh} className='w-[900px] max-h-[1000px] h-fit min-h-[500px] relative'/>

                </>

                :
                null
            }
        </div>
     </div>);
}

export default Requests;
