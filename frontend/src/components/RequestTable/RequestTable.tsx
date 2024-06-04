import React, { SetStateAction, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import Table from '../TableCard/Table/Table';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { RequestType } from '../../types/auth';
import useRequest from '../../hooks/calls';
import { useAuth } from '../../hooks/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import {FiRefreshCw} from "react-icons/fi"
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';

interface RequestTableProps {
    className?:string;
    refresh:object;
    setRefresh:React.Dispatch<SetStateAction<object>>;
}

const RequestTable: FC<RequestTableProps> = ({className , refresh , setRefresh}) => {
    const {auth} = useAuth()
    const {data , loading } = useRequest<RequestType>({
        url:"api/users/request",
        method:"GET",
        params:auth.role === "OWNER" || auth.role === "MANAGER" ? undefined : {user__uuid:auth.uuid}
    },[refresh])
    return (
    <Container className={`${className}`}>
        {
            loading ? <LoadingComponent/> : <></>
        }

        <div className='flex flex-row justify-between items-center'>
            <h1>Request Table</h1>
            <button onClick={e=>setRefresh({data:{}})} className='rounded-md bg-btns-colors-primary p-1'><FiRefreshCw className='h-[25px] w-[25px]'/></button>
        </div>
        {
            data ? (
            <>
                <Table
                    className='mb-5'
                    key={Math.random()}
                    headers={["username","type","status","details","note","delete"]}
                    data={convertObjectToArrays<RequestType>(
                        data.results,
                        [
                            // {
                            //     key:"user",
                            //     method : (_)=>{
                            //         const item = _ as any; 
                            //         return (<div className='flex justify-center items-center bg-[red]'>
                            //         <img src={getFullURL(item.profile.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/>
                            //         </div>)
                            //         // return item.username
                            //     },
                            // },
                            {
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return item ? item.username : "-"
                                },
                            },
                            {
                                key:"type",
                                method : null
                            },
                            {
                                key:"status",
                                method : (_)=>{
                                    return <td key={Math.random()} className={`px-3 py-1 ${_ === "PENDING" ?  "text-[rgb(234,179,8)]" : _ === "REJECTED" ? "text-[red]" : _ === "ACCEPTED" ? "text-[green]" : "" }`}>{_}</td>
                                }
                            },
                            {
                                key:"details",
                                method : null
                            },
                            {
                                key:"note",
                                method : (_)=> _ ? _ : "-"
                            },
                            {
                                key:"uuid",
                                method : (uuid)=>{
                                    return (
                                        <td key={Math.random()} className='px-3 py-1 flex justify-center items-center'>
                                                <button onClick={(e)=>{
                                                        e.preventDefault();
                                                        sendRequest({url:"api/users/request",method:"DELETE", params: {uuid}})
                                                                .then(data => {
                                                                    Swal.fire({
                                                                        position: "center",
                                                                        icon: "success",
                                                                        title: "Deleted Successfully",
                                                                        showConfirmButton: false,
                                                                        timer: 1000
                                                                    }).then(() => setRefresh({data:{}}))
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

                        ]
                    )}
                    />
            </>
            ): <></>
        }

    </Container>
    
);
}

export default RequestTable;
