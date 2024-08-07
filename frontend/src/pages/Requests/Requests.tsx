import  {type FC , useState} from 'react';
import RequestTable from '../../components/RequestTable/RequestTable';
import RequestHandling from '../../components/RequestHandling/RequestHandling';
import RequestAddForm from '../../components/RequestAddForm/RequestAddFrom';
// import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';

interface RequestsProps {}

const Requests: FC<RequestsProps> = () => {
    const [refresh , setRefresh ]= useState<object>({})
    const {auth} = useAuth()

    return (
    <div className='w-full grid grid-cols-1 gap-5 md:grid-flow-row md:grid-cols-9 px-5 '> 

        <RequestAddForm refresh={refresh} setRefresh={setRefresh} className='md:col-span-4 justify-self-center w-full md:min-w-[30rem] h-fit relative'/>

        {
            auth.role === "OWNER" || auth.role === "MANAGER" ? 
            <>
                <RequestHandling refresh={refresh} setRefresh={setRefresh} className='md:col-span-5 place-self-center max-w-[45rem] max-h-[450px] h-fit min-h-[100px] relative'/>
            </>
            :
            null
        }
        <RequestTable refresh={refresh} setRefresh={setRefresh} className='md:col-span-9 place-self-center h-fit min-h-[100px] relative'/>

     </div>);
}

export default Requests;
