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
    const additionalFilter = ()=>{
        let result = {status:"PENDING"}
        if (auth.role === "OWNER" || auth.is_superuser || auth.role === "HR") {
            return result
        }
        if (auth.role === "MANAGER") {
            return {...result , user__department__name:auth.department.name}
        }
        return result
    }

    const {data , loading} = useRequest<RequestType>({
        url:"api/users/request",
        method:"GET",
        params: additionalFilter()
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
