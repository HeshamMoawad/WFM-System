import { SetStateAction, useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import { NotificationType } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Table from '../Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import Pagination from '../Pageination/Pageination';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface NotificationsTableProps {
    setRefresh:React.Dispatch<SetStateAction<boolean>>;
    refresh:boolean
}

const NotificationsTable: FC<NotificationsTableProps> = ({setRefresh , refresh }) => {
    const {lang} = useContext(LanguageContext)
    const [currentPage,setCurrentPage] = useState(1)
    const {data , loading} = useRequest<NotificationType>(
        {url:"api/treasury/notifications",method:"GET",params:{page:currentPage}},[currentPage,refresh])

    return (
    <Container className='relative w-5/6 h-fit'>
        {
            loading ? <LoadingComponent /> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.Notification.table.title[lang]}</h1>

        {
            data?(
                <>
                <Table 
                    headers={TRANSLATIONS.Notification.table.headers[lang]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"creator",
                            method : (_)=>{
                                const item = _ as any; 
                                return item?.username || "-";
                            }
                        },{
                            key:"message",
                            method : (_) => _ || "-",
                        },
                        {
                            key: "seen_by_users",
                            method: (_) => (_ as Array<string>)?.length ? (_ as Array<string>)?.length : "0",
                        },
                        {
                            key:"deadline",
                            method : (_: any) => {
                                if (_) {
                                    const date = new Date(_);
                                    return `${date.getFullYear()}-${ date.getMonth() + 1 }-${date.getDate()} | ${date.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}`;
                                }
                                return "-";
                            },
                        },{
                            key: "uuid",
                            method: (uuid) => {
                                return (
                                    <td
                                        key={Math.random()}
                                        className="px-3 py-1 min-w-[100px] flex justify-center items-center"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                sendRequest({
                                                    url: "api/treasury/notifications",
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
                                                        })
                                                    })
                                                    .finally(()=>{
                                                        setRefresh(prev=>!prev)
                                                    })

                                            }}
                                            className="rounded-md bg-btns-colors-secondry w-2/3"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                );
                            },
                        }
                    ])}
                />
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} page={data} />
                <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label htmlFor="" className='text-center'>Total : {data?.total_count}</label>
                </div>

                </>
            ):<></>
        }
    </Container>
    );
}

export default NotificationsTable;
