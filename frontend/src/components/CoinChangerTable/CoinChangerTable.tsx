import { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Pagination from '../Pageination/Pageination';
import { CoinChangerType } from '../../types/auth';
import Table from '../Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';

interface CoinChangerTableProps {
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const CoinChangerTable: FC<CoinChangerTableProps> = ({refresh , setRefresh}) => {
    const [currentPage , setCurrentPage] = useState(1)
    const {data , loading} = useRequest<CoinChangerType>({
        url:"api/commission/coin-changer" , 
        method:"GET" , 
        params:{page:currentPage}
    },[refresh,currentPage])

    return (
    <Container className='relative h-fit w-[700px]'>
        {
            loading? <LoadingComponent/> : <></>
        }
        {
            data ? (
            <>
                <Table 
                    headers={["Sar-price","date","created_at"]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"egp_to_sar",
                            method : (sar)=>{
                                return ` ${sar} EGP`
                            }
                        },
                        {
                            key:"date",
                            method :  (_: any) => {
                                if (_) {
                                    const date = new Date(_);
                                    return `${date.getFullYear()}-${
                                        date.getMonth() + 1
                                    }`;
                                }
                                return "-";
                            },
                        },
                        {
                            key:"created_at",
                            method : (_: any) => {
                                if (_) {
                                    const date = new Date(_);
                                    return `${date.getFullYear()}-${
                                        date.getMonth() + 1
                                    }-${date.getDate()}`;
                                }

                                return "-";
                            },
                        },
                        {
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
                                                            url: "api/commission/coin-changer",
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
                                                                }).then(() =>
                                                                    setRefresh(prev=>!prev)
                                                                );
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
                                                            });
                                                    }
                                                });                

                                                
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
                <Pagination currentPage={currentPage}  page={data} setCurrentPage={setCurrentPage}/>
                <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label htmlFor="" className='text-center'>Total : {data?.total_count}</label>
                </div>
            </>
            ) : <></>
        }

    </Container>
    );
}

export default CoinChangerTable;
