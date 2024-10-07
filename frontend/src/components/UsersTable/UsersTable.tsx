import  {type FC , useState, useEffect, useContext} from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Table from '../Table/Table';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { User } from '../../types/auth';
import { FaUserEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import PwdComponent from './PwdComponent/PwdComponent';
import TableFilters from './TableFilters/TableFilters';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';



interface UsersTableProps {}

const UsersTable: FC<UsersTableProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [filters,setFilters] = useState<object>({})
    const {auth} = useAuth()
    const deleteUser = (uuid:string)=>{
        sendRequest({url:"api/users/user",method:"DELETE",params:{uuid}})
            .then(data=>{
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Deleted Successfully",
                    showConfirmButton: false,
                    timer: 1000
                    }).then(() => setFilters({}))
            }).catch((error) => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Can't Deleted",
                    showConfirmButton: false,
                    timer: 1000
                    }).then(() => setFilters({}))
            })

    }
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser || auth.role === "HR" ? {} : {department__name : auth.department.name}
    const {data , loading } = useRequest<User>({
        url: 'api/users/user' ,
        method: 'GET',
        params: {...filters , ...additionalFilter , is_superuser:"False" }
    },[filters])
    useEffect(()=>{
        console.log(filters)
    },[filters])

    return (
    <Container className='w-fit md:w-screen h-fit min-h-[300px] relative gap-3 justify-center items-center'>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.UsersList.title[lang]}</h1>
        <TableFilters setFilters={setFilters}/>
        {
            loading? <LoadingComponent/> : <></>
        }
        {
            data ? (
                <>
                <Table
                    className='mb-2'
                    headers={TRANSLATIONS.UsersList.headers[lang]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"profile",
                            method : (_)=>{
                                const item = _ as any; 
                                return (
                                    item?.picture ? 
                                        <td key={Math.random()} className='flex justify-center items-center px-3 py-1'>
                                            <img src={getFullURL(item?.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/>
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
                            key:"crm_username",
                            method:null
                        },{
                            key:["password_normal" , "is_superuser" , "role"],
                            method:(_)=>{
                                const { password_normal , is_superuser = false , role = "AGENT"} = _ as any;
                                return !(is_superuser || role === "OWNER" || role === "MANAGER") ? <PwdComponent content={password_normal}/> : <td className={``} ></td>
                            }
                        },{
                            key:"is_active",
                            method:(_)=>
                            <td className='px-3 py-1'>
                                <span className={`inline-block w-3 h-3 rounded-full border ${_ ? "bg-btns-colors-primary border-btns-colors-primary " : "bg-btns-colors-secondry border-btns-colors-secondry"}`}>
                                </span>
                            </td>
                            
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
                                return depart?.name
                            }
                        },{
                            key:"project",
                            method:(item)=>{
                                const project = item as any; 
                                return project?.name
                            }
                        },{
                            key:"profile",
                            method:(item)=>{
                                const profile = item as any; 
                                return profile?.phone ? profile?.phone :"-"
                            }
                        },{
                            key:["uuid" , "is_superuser" , "role"],
                            method : (args)=>{
                                const {uuid,is_superuser=false,role = "AGENT"} = args as any;
                                return (
                                    <td key={Math.random()} className='px-3 py-1'>
                                            {!(is_superuser || role === "OWNER" || role === "MANAGER") ? (
                                                <Link className='rounded-md w-2/3 h-8' to={`/edit-user/${uuid}`} >
                                                    <FaUserEdit className='w-full h-6 text-center fill-btns-colors-primary'/>
                                                </Link>
                                            ):null}

                                    </td>
                                )
                            }
                        },{
                            key:["uuid" , "is_superuser" , "role"],
                            method : (args)=>{
                                const {uuid,is_superuser=false,role = "AGENT"} = args as any;
                                return (
                                    <td key={Math.random()} className='px-3 py-1'>
                                        {
                                            !(is_superuser || role === "OWNER" || role === "MANAGER") ? (
                                                <a onClick={(e)=>{
                                                        e.preventDefault();
                                                        Swal.fire({
                                                            title: "Are you sure?",
                                                            text: "You won't be able to revert this!",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#3085d6",
                                                            cancelButtonColor: "#d33",
                                                            confirmButtonText: "Yes, delete it!"
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                deleteUser(String(uuid))
                                                            }
                                                        });                
                                            }} className='rounded-md w-2/3 h-8' href='#0'>
                                                    <FaUserXmark className='w-full h-6 text-center fill-btns-colors-secondry'/>
                                                </a>

                                            ): null
                                        }
                                    </td>
                                )
                            }
                    }
                    ])}
                
                />
                </>
            ):<></>
        }


        

    </Container>
    );
}

export default UsersTable;
