import React, { useContext, useState, type FC } from 'react';
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
// import SelectComponent from '../SelectComponent/SelectComponent';
// import { LanguageContext } from '../../contexts/LanguageContext';

interface AdvancesTableProps {
    user_uuid?: string ;
    date?:Date;
    refresh?:boolean;
    setRefresh?:React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
    canDelete?:boolean;
}   

const AdvancesTable: FC<AdvancesTableProps> = ({user_uuid , date , refresh , setRefresh ,className , canDelete}) => {
    // const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const [currentPage, setCurrentPage] = useState(1)
    const user__uuid =  user_uuid ? {user__uuid:user_uuid} : {}
    const dates = date ? {
        created_at__date__gte: `${date.getFullYear()}-${date.getMonth()}-25`,
        created_at__date__lte: `${date.getFullYear()}-${date.getMonth()+1}-25`,

    } : {}
    const {data , loading} = useRequest<Advance>({
        url:"api/treasury/advance",
        method:"GET",
        params: {
            ...user__uuid,
            ...dates,
            page:currentPage ,
        } 
    },[user_uuid,currentPage , refresh , date])

    let totalAdvance = 0
    return (
        <Container className={`${className} md:w-2/3 min-h-[250px] h-fit relative pb-2`}>
            {
                loading ? <LoadingComponent/> : <></>
            }
            <span className='text-2xl text-btns-colors-primary'>Advances</span>
            <div className='flex flex-col justify-between items-center'>
                {
                    data ? (<>
                        <Table
                        headers={["user","username","amount","created_at",""]}
                        data={convertObjectToArrays(data?.results,[
                            {
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return (
                                    <td className='px-3 py-1'>
                                        <div className='flex justify-center items-center'>
                                            <img src={getFullURL(item.profile.picture)} alt="" className='rounded-full w-[60px] h-[60px]'/>
                                        </div>
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
                                    totalAdvance += _ as number;
                                    return <td className='px-3 py-1'>{_}</td>
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
                    <div dir={lang === "en" ? "ltr" : "rtl"} className={`flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                        <label>{TRANSLATIONS.Advance.bottom.total[lang]} : {totalAdvance}</label>
                    </div>

    
                    </>):<></>
                }
            </div>
        </Container>
    );
}

export default AdvancesTable;
