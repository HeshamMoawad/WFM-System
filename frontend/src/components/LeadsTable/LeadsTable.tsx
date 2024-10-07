import { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { convertObjectToArrays } from '../../utils/converter';
import Table from '../Table/Table';
import { Lead } from '../../types/auth';
import Pagination from '../Pageination/Pageination';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';

interface LeadsTableProps {}

const LeadsTable: FC<LeadsTableProps> = () => {
    const [currentPage,setCurrentPage] = useState(1)
    const {data , loading} = useRequest<Lead>({url:"api/users/lead",method:"GET",params:{page:currentPage}},[currentPage])

    return (
    <Container className='relative md:col-span-6 w-[100%] place-self-end min-h-[680px] h-fit'>
        {
            loading ? <LoadingComponent/> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Leads</h1>
        {/* Table to display leads */}
        {
            data ?(<>
                <Table 
                    className='my-3' 
                    headers={["market" ,"name","phone","date"]}
                    data={convertObjectToArrays(data?.results , [
                        {
                            key: "user",
                            method: (_) => (_ ? _ : "-"),
                        },
                        {
                            key: "name",
                            method: (_) => (_ ? _ : "-"), 
                        },
                        {
                            key: "phone",
                            method: (_) => (_ ? _ : "-"),
                        },
                        {
                            key: "date",
                            method: (_: any) => {
                                if (_) {
                                    const date = new Date(_);
                                    return `${date.getFullYear()}-${
                                        date.getMonth() + 1
                                    }-${date.getDate()}`;
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
                                                    url: "api/users/lead",
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
                <Pagination currentPage={currentPage} page={data} setCurrentPage={setCurrentPage} />
                <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label htmlFor="" className='text-center'>Total : {data?.total_count}</label>
                </div>

            </>):<></>
        }

    </Container>
    );
}

export default LeadsTable;
