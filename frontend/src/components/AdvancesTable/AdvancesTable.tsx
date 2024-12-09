import React, { useContext, useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
// import { useAuth } from '../../hooks/auth';
import useRequest from '../../hooks/calls';
import { Advance } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Table from '../Table/Table';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { TRANSLATIONS } from '../../utils/constants';
import {LanguageContext} from '../../contexts/LanguageContext';
import Pageination from '../Pageination/Pageination';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { Status } from '../../types/base';
import { useAuth } from '../../hooks/auth';
// import SelectComponent from '../SelectComponent/SelectComponent';
// import { LanguageContext } from '../../contexts/LanguageContext';

interface AdvancesTableProps {
    user_uuid?: string ;
    date?:Date;
    refresh?:boolean;
    setRefresh?:React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
    canDelete?:boolean;
    setTotal?:React.Dispatch<React.SetStateAction<number|null>>;
    status?:string;
}   

const AdvancesTable: FC<AdvancesTableProps> = ({status,user_uuid , date , refresh , setRefresh ,setTotal,className , canDelete}) => {
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const [currentPage, setCurrentPage] = useState(1)
    const user__uuid = user_uuid ? {user__uuid:user_uuid} : {}
    // const user__uuid = (
    //     auth.is_superuser || auth.role === "OWNER"
    // ) ? 
    // user_uuid ? {user__uuid:user_uuid ? user_uuid : auth.uuid} : {} :  {user__uuid:user_uuid ? user_uuid : auth.uuid}
    
    const dates = date ? {
        created_at__date__gte: `${date.getFullYear()}-${date.getMonth()+1}-1`,
        created_at__date__lte: `${date.getMonth() !== 11 ? date.getFullYear() : date.getFullYear()+1}-${date.getMonth() !== 11 ? date.getMonth() + 2 : 1}-1`,

    } : {}
    const status_f = status ? {status} : {}
    const {data , loading} = useRequest<Advance>({
        url:"api/treasury/advance",
        method:"GET",
        params: {
            ...user__uuid,
            ...dates,
            ...status_f,
            page:currentPage ,
        } 
    },[user_uuid , currentPage , refresh , date])
    let totalAdvance = 0

    useEffect(()=>{
        if(data?.results && setTotal){
            let local_total = 0;
            data?.results.forEach((val, inx) => {
                local_total += val.amount
            }, 0);
            setTotal(local_total)
        }
    },[data])
    return (
        <Container className={`${className} md:w-2/3 h-fit relative pb-2`}>
            {
                loading ? <LoadingComponent/> : <></>
            }
            <span className='text-2xl text-btns-colors-primary'>{TRANSLATIONS.Advance.title[lang]}</span>
            <div className=' items-center px-2'>
                {
                    data ? (<>
                        <Table
                        className=''
                        headers={TRANSLATIONS.Advance.table.headers[lang]}
                        data={convertObjectToArrays(data?.results,[
                            {
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return (
                                    <td className='px-3 py-1'>
                                        {
                                            item?.profile?.picture ? (
                                                <div className='flex justify-center items-center'>
                                                    <img src={getFullURL(item?.profile?.picture)} alt="" className='rounded-full w-[60px] h-[60px]'/>
                                                </div>

                                            ): "-"
                                        }
                                    </td>
                                    )
                                }
                            },{
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return item?.username
                                },
                            },{
                                key:"amount",
                                method : (_)=>{
                                    totalAdvance += Number(_);
                                    return <td className='px-3 py-1'>{_}</td>
                                },
                            },{
                                key:"status",
                                method : (_) => {
                                    const status : Status = _ as any
                                    return (
                                        <td
                                            key={Math.random()}
                                            className={`px-3 py-1 ${
                                                status === "PENDING"
                                                    ? "text-[rgb(234,179,8)]"
                                                    : status === "REJECTED"
                                                    ? "text-[red]"
                                                    : status === "ACCEPTED"
                                                    ? "text-[green]"
                                                    : ""
                                            }`}
                                        >
                                            {TRANSLATIONS.Request.Status[status][lang]}
                                        </td>
                                    );
                                },
                            },{
                                key:"created_at",
                                method : (_: any)=> {
                                    if(_) {
                                        const date = new Date(_)
                                        // console.info(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}` , new Date(_ as string).toLocaleDateString("en-US",{ day: '2-digit', month: 'short' }))
                                        // return new Date(_ as string).toLocaleDateString("en-US",{ day: '2-digit', month: 'short' })
                                        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
                                    }
                                    
                                    return "-"
                                },
                            }, {
                                key: "uuid",
                                method: (uuid) => {
                                    return (
                                        <td
                                            key={Math.random()}
                                            className="px-3 py-1 min-w-[100px]"
                                        >
                                            {
                                                canDelete ? (
                                            <button
                                                onClick={(e) => {
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
                                                            sendRequest({
                                                                url: "api/treasury/advance",
                                                                method: "DELETE",
                                                                params: { uuid },
                                                            })
                                                                .then((data) => {
                                                                    Swal.fire({
                                                                        position:
                                                                            "center",
                                                                        icon: "success",
                                                                        title: "Deleted Successfully",
                                                                        showConfirmButton:
                                                                            false,
                                                                        timer: 1000,
                                                                    })
                                                                })
                                                                .catch((err) => {
                                                                    Swal.fire({
                                                                        position:
                                                                            "center",
                                                                        icon: "error",
                                                                        title: "can't Deleted",
                                                                        showConfirmButton:
                                                                            false,
                                                                        timer: 1000,
                                                                    });
                                                                })
                                                                .finally(()=>{
                                                                    if(setRefresh){
                                                                        setRefresh(prev=>!prev)

                                                                    }
                                                                });
                                                                }
                                                            });                

                                                    
                                                }}
                                                className="rounded-md bg-btns-colors-secondry w-2/3 h-8"
                                            >
                                                Delete
                                            </button>

                                                ):null
                                            }
                                        </td>
                                    );
                                },
                            }

                        ])}
                    />
                    <Pageination page={data} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    <div dir={lang === "en" ? "ltr" : "rtl"} className={`mb-2 grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 rounded-md items-center bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg`}>
                        <label className='place-self-center'>{TRANSLATIONS.Advance.bottom.total[lang]} : {totalAdvance} EGP</label>
                        <label className='place-self-center' >{TRANSLATIONS.Advance.bottom.totalCount[lang]} : {data?.total_count}</label>
                    </div>

    
                    </>):<></>
                }
            </div>
        </Container>
    );
}

export default AdvancesTable;
