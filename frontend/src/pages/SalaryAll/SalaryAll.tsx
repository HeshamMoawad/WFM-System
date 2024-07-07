import  {type FC , useState, useEffect} from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { User } from '../../types/auth';
import { FaUserEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import TableFilters from '../../components/UsersTable/TableFilters/TableFilters';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Table from '../../components/Table/Table';
import PwdComponent from '../../components/UsersTable/PwdComponent/PwdComponent';

interface SalaryAllProps {}

const SalaryAll: FC<SalaryAllProps> = () => {
    const [filters,setFilters] = useState<object>({})
    const {data , loading } = useRequest<User>({
        url: 'api/users/user' ,
        method: 'GET',
        params: {is_active:"True",...filters}
    },[filters])
    useEffect(()=>{
        console.log(filters)
    },[filters])



    return (<div className='flex justify-center'>
        
        <Container className='w-fit md:w-screen h-fit min-h-[300px] relative flex flex-col gap-3 justify-center items-center '>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Salary For Users</h1>
        <TableFilters setFilters={setFilters}/>
        {
            loading? <LoadingComponent/> : <></>
        }

        {
            data ? (
                <>
                <Table
                    className='mb-2'
                    headers={["picture","username","role","title","department","project","Basic" , "Commission"]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"profile",
                            method : (_)=>{
                                const item = _ as any; 
                                return (
                                    item.picture ? 
                                        <td key={Math.random()} className='flex justify-center items-center px-3 py-1'>
                                            <img src={getFullURL(item.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/>
                                        </td>
                                        : 
                                        <td key={Math.random()} className='text-center w-[40px] h-[40px] px-3 py-1'>
                                            -
                                            {/* <img src={getFullURL(item.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/> */}
                                        </td>

                                )}
    
                        },{
                            key:"username",
                            method:null
                        },{
                            key:"role",
                            method:null
                        },{
                            key:"title",
                            method:null
                        },{
                            key:"department",
                            method:(item)=>{
                                const depart = item as any; 
                                return depart.name
                            }
                        },{
                            key:"project",
                            method:(item)=>{
                                const project = item as any; 
                                return project.name
                            }
                        },{
                            key:["uuid" , "is_superuser" , "role"],
                            method : (args)=>{
                                const {uuid,is_superuser,role} = args as any;
                                return (
                                    <td key={Math.random()} className='px-3 py-1'>
                                            {!(is_superuser || role === "OWNER") ? (
                                                <Link className='rounded-md w-2/3 h-8' to={`/edit-user/${uuid}`} >
                                                    <FaUserEdit className='w-full h-6 text-center fill-btns-colors-primary'/>
                                                </Link>
                                            ):null}

                                    </td>
                                )
                            }
                        },
                    ])}
                
                />
                </>
            ):<></>
        }


        

    </Container>
    </div>);
}

export default SalaryAll;
