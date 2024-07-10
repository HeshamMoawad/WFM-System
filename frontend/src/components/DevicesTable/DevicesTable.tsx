import { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import Table from '../Table/Table';
import useRequest from '../../hooks/calls';
import { DeviceAccessDetails } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { convertObjectToArrays } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import Pagination from '../Pageination/Pageination';

interface DevicesTableProps {
    refresh:number,
    setRefresh:React.Dispatch<React.SetStateAction<number>>
}

const DevicesTable: FC<DevicesTableProps> = ({refresh , setRefresh}) => {
    const [currentPage,setCurrentPage] = useState(1)
    const {data , loading } = useRequest<DeviceAccessDetails>({
        url: 'api/users/device-access' ,
        method: 'GET',
        params: {
            page:currentPage
        }
    },[refresh,currentPage])

    return (
        <Container className='relative w-full md:w-[1000px]'>
            {
                loading? <LoadingComponent/> : <></>
            }
            {
                data ? 
                (<>
                <Table
                    className='mb-2'
                    headers={["username","name","device-id" , ""]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"user",
                            method : (_)=>{
                                const item = _ as any; 
                                return item.username
                            }
                        },
                        {
                            key:"name",
                            method : (_)=>{
                                const item = _ as any; 
                                return item
                            }
                        },
                        {
                            key:"unique_id",
                            method : (_)=>{
                                const item = _ as any; 
                                return item
                            }
                        },{
                            key:"uuid",
                            method : (uuid)=>{
                                return (
                                    <td key={Math.random()} className='px-3 py-1 flex justify-center items-center'>
                                            <button onClick={(e)=>{
                                                    e.preventDefault();
                                                    sendRequest({url:"api/users/device-access",method:"DELETE", params: {uuid}})
                                                            .then(data => {
                                                                Swal.fire({
                                                                    position: "center",
                                                                    icon: "success",
                                                                    title: "Deleted Successfully",
                                                                    showConfirmButton: false,
                                                                    timer: 1000
                                                                }).then(()=>setRefresh(Math.random()))
                                                            })
                                                            .catch(err => {
                                                                Swal.fire({
                                                                    position: "center",
                                                                    icon: "error",
                                                                    title: "can't Deleted",
                                                                    showConfirmButton: false,
                                                                    timer: 1000
                                                                })
                                                            })
                                                                                    
                                        }} className='rounded-md bg-btns-colors-secondry w-2/3'>
                                                Delete
                                            </button>
                                    </td>
                                )
                            }
                        },
                    ])}

                />
                <Pagination  currentPage={currentPage} setCurrentPage={setCurrentPage} page={data}/>
                <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label htmlFor="" className='text-center'>Total : {data.total_count}</label>
                </div>

                </>):<></>
            }
                    
        </Container>
    );
}

export default DevicesTable;
