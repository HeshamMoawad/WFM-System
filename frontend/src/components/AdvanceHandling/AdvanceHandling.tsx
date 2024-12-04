import type { FC, SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import { AdvanceType } from '../../types/auth';
import { useAuth } from '../../hooks/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import AdvanceCard from '../AdvanceCard/AdvanceCard';
import { checkPermission } from '../../utils/permissions/permissions';

interface AdvanceHandlingProps {
    className?: string;
    refresh:boolean;
    setRefresh:React.Dispatch<SetStateAction<boolean>>;
    url?:string;
}

const AdvanceHandling: FC<AdvanceHandlingProps> = ({className , refresh , setRefresh , url="api/treasury/advance"}) => {
    const {auth} = useAuth()
    const {data , loading} = useRequest<AdvanceType>({
        url:url,
        method:"GET",
        params: {status:"PENDING"}
    },[refresh],5000)
    return (
    <Container className={`${className}`}>
        {
            loading ? <LoadingComponent/> : <></>
        }
        <div className='request-container flex flex-col gap-6'>
            {
                checkPermission(auth,"handle_advance")?
                data?.results.map((advance)=>{
                    return <AdvanceCard key={advance.uuid} advance={advance} setRefresh={setRefresh} refresh={refresh}/>
                })
                : null
            }
        </div>
    </Container>
    );
}

export default AdvanceHandling;
