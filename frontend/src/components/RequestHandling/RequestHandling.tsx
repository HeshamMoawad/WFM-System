import type { FC, SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import RequestCard from '../RequestCard/RequestCard';
import useRequest from '../../hooks/calls';
import { RequestType } from '../../types/auth';
import { useAuth } from '../../hooks/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

interface RequestHandlingProps {
    className?: string;
    refresh:object;
    setRefresh:React.Dispatch<SetStateAction<object>>;

}

const RequestHandling: FC<RequestHandlingProps> = ({className , refresh , setRefresh}) => {
    const {auth} = useAuth()
    const {data , loading} = useRequest<RequestType>({
        url:"api/users/request",
        method:"GET",
        params:auth.role === "OWNER" || auth.role === "MANAGER"? {status:"PENDING"} : {user__uuid:auth.uuid , status:"PENDING"}
    },[refresh],15000)
    return (
    <Container className={`${className}`}>
        {
            loading ? <LoadingComponent/> : <></>
        }
        <div className='request-container flex flex-col gap-6'>
            {
                data?.results.map((request)=>{
                    return <RequestCard key={request.uuid} request={request} setRefresh={setRefresh} refresh={refresh}/>
                })
            }
        </div>
    </Container>
    );
}

export default RequestHandling;
