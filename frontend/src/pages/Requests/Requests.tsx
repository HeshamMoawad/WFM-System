import  {type FC , useState} from 'react';
import RequestTable from '../../components/RequestTable/RequestTable';
import RequestHandling from '../../components/RequestHandling/RequestHandling';
import RequestAddForm from '../../components/RequestAddForm/RequestAddFrom';
// import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import { checkPermission } from '../../utils/permissions/permissions';

interface RequestsProps {}

const Requests: FC<RequestsProps> = () => {
    const [refresh , setRefresh ]= useState<boolean>(false)
    const {auth} = useAuth()
    return (
    <div className='w-full grid grid-cols-1 gap-5 md:grid-flow-row md:grid-cols-9 px-5 '> 
        {
            checkPermission(auth,"add_request") ? 
                <RequestAddForm setRefresh={setRefresh} className={`${checkPermission(auth,"handle_request") ? "md:col-span-4  "  : "md:col-span-full max-w-[400px] md:max-w-[400px]"} md:min-w-[30rem]  justify-self-center h-fit relative`}/> 
                : null
        }
        {
            checkPermission(auth,"handle_request") ? 
                <>
                    <RequestHandling refresh={refresh} setRefresh={setRefresh} className='md:col-span-5 place-self-center max-w-[45rem] max-h-[450px] h-fit min-h-[100px] relative'/>
                </>
                : null
        }
        {
            checkPermission(auth,"view_request") ? 
                <RequestTable refresh={refresh} setRefresh={setRefresh} className='md:col-span-9 place-self-center h-fit min-h-[100px] relative'/>
                : null
        }

        

     </div>);
}

export default Requests;
