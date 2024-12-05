import { useContext, useState, type FC, type SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import RequestCard from '../RequestCard/RequestCard';
import useRequest from '../../hooks/calls';
import { RequestType } from '../../types/auth';
import { useAuth } from '../../hooks/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import SelectComponent from '../SelectComponent/SelectComponent';
import { TRANSLATIONS } from '../../utils/constants';
import {LanguageContext} from '../../contexts/LanguageContext';

interface RequestHandlingProps {
    className?: string;
    refresh:boolean;
    setRefresh:React.Dispatch<SetStateAction<boolean>>;
    url?:string;
}

const RequestHandling: FC<RequestHandlingProps> = ({className , refresh , setRefresh , url="api/users/request"}) => {
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const refreshRate = 4000;
    const [filters,setFilters] = useState<Record<string,any>>({})
    const {data , loading} = useRequest<RequestType>({
        url:url,
        method:"GET",
        params: {status:"PENDING",page_size:1000 , ...filters}
    },[refresh,filters],refreshRate)
    return (
    <Container className={`${className}`}>
        {
            loading ? <LoadingComponent/> : <></>
        }
        <div className='flex flex-row'>
            <div className='w-full flex justify-evenly gap-3 items-center'>
                <SelectComponent 
                    url='api/users/department'
                    LabelName={TRANSLATIONS.UsersList.filters.department[lang]}
                    config={{label: 'name' , value: 'uuid'}}
                    name='user'
                    setSelection={(user__department__uuid:string)=>{
                        if (user__department__uuid === "*"){
                            setFilters(prev => {
                                const { user__department__uuid ,...newFilters } = prev;
                                return newFilters;
                            })
                        }else {
                            setFilters(prev => ({...prev, user__department__uuid}))
                        }
                    }}
                    moreOptions={[{label:"All",value:"*"}]}
                    refresh={refresh}
                    />
            </div>
            <div className='w-full flex justify-evenly gap-3 items-center'>
                <SelectComponent 
                    url='api/users/project'
                    LabelName={TRANSLATIONS.UsersList.filters.project[lang]}
                    config={{label: 'name' , value: 'uuid'}}
                    name='project'
                    setSelection={(user__project__uuid:string)=>{
                        if (user__project__uuid === "*"){
                            setFilters(prev => {
                                const { user__project__uuid , ...newFilters } = prev;
                                return newFilters;                
                            })
                        }else {
                            setFilters(prev => ({...prev, user__project__uuid}))
                        }
                    }}
                    moreOptions={[{label:"All",value:"*"}]}
                    refresh={refresh}
                    />
            </div>
            <div className='w-2/6 flex justify-evenly gap-3 items-center'>
                <span className='bg-[transparent] '/>
                {
                     "Every " + String(refreshRate/1000) + " Sec"
                }
                <span/>
            </div>

        </div>
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
