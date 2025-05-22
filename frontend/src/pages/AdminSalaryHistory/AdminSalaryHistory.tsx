import { useState, type FC } from 'react';
// import { Link } from 'react-router-dom';
// import useRequest from '../../hooks/calls';
// import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
// import { Department } from '../../types/auth';
import Container from '../../layouts/Container/Container';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { Department, Project, User } from '../../types/auth';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Table from '../../components/Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import { Link } from 'react-router-dom';


interface Filter {
    department:string|null;
    project:string|null;
}

interface AdminSalaryHistoryProps {}

const AdminSalaryHistoryProps: FC<AdminSalaryHistoryProps> = () => {
    const [filters , setFilters ] = useState<Filter>({department:null,project:null})
    const {data,loading} = useRequest<User>({url:"api/users/user",params:{
        ...(filters.department ? {department__uuid:filters.department} : {} ),
        ...(filters.project ? {project__uuid:filters.project} : {} ),
        is_superuser:"False",
        is_active : "True"

    }},[filters])
    return (
        <Container className='m-auto flex flex-col p-2 w-fit'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <SelectComponent<Department>
                    LabelName='Department' 
                    config={{value:"uuid",label:"name"}}
                    name='department'
                    url='api/users/department'
                    moreOptions={[
                        {
                            label:"-",
                            value:"*"
                        },
                    ]}
                    setSelection={(value)=>{
                        if (value === "*"){
                            setFilters((prev)=>({...prev,department:null}))
                        }else {
                            setFilters((prev)=>({...prev,department:value}))
                        }
                    }}
                    />
                <SelectComponent<Project>
                    LabelName='Project' 
                    config={{value:"uuid",label:"name"}}
                    name='department'
                    url='api/users/project'
                    moreOptions={[
                        {
                            label:"-",
                            value:"*"
                        },
                    ]}
                    setSelection={(value)=>{
                        if (value === "*"){
                            setFilters((prev)=>({...prev,project:null}))
                        }else {
                            setFilters((prev)=>({...prev,project:value}))
                        }
                    }}
                    />
            </div>
            {loading ? <LoadingComponent/> : null}
            {
                data ? (
                <Table
                    headers={["username"]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:["username","uuid"],
                            method:(item)=>{
                                const {username="" , uuid=""} = item as any;
                                return <Link className='text-primary' to={`/user-salary-history/${uuid}`}>{username}</Link>
                            }
                        },
                    ])}
                />
            ) : null
            }
        </Container>
    );
}

export default AdminSalaryHistoryProps ;
