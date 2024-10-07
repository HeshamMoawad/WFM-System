import React, { SetStateAction, useContext, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import Table from "../Table/Table";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { RequestType } from "../../types/auth";
import useRequest from "../../hooks/calls";
import { useAuth } from "../../hooks/auth";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { FiRefreshCw } from "react-icons/fi";
import { sendRequest } from "../../calls/base";
import Swal from "sweetalert2";
import Pagination from "../Pageination/Pageination";
import { LanguageContext } from "../../contexts/LanguageContext";
import { TRANSLATIONS } from "../../utils/constants";
import { Status } from "../../types/base";

interface RequestTableProps {
    className?: string;
    refresh: boolean;
    setRefresh: React.Dispatch<SetStateAction<boolean>>;
}

const RequestTable: FC<RequestTableProps> = ({
    className,
    refresh,
    setRefresh,
}) => {

    const [currentPage,setCurrentPage] = useState(1);
    const {lang}= useContext(LanguageContext)
    const { auth } = useAuth();

    const additionalFilter = ()=>{
        let result = {page:currentPage}
        if (auth.role === "OWNER" || auth.is_superuser || auth.role === "HR") {
            return result
        }
        if (auth.role === "MANAGER") {
            return {...result , user__department__name:auth.department.name}
        }
        if (auth.role === "AGENT"){
            return {user__uuid:auth.uuid}
        }
        return result
    }

    const { data, loading } = useRequest<RequestType>(
        {
            url: "api/users/request",
            method: "GET",
            params:additionalFilter()
        },
        [refresh , currentPage]
    );
    return (
        <Container className={`${className}`}>
            {loading ? <LoadingComponent /> : <></>}

            <div className="flex flex-row justify-between items-center">
                <label className="text-2xl text-btns-colors-primary">
                    {TRANSLATIONS.Requests.title[lang]}
                </label>
                <button
                    onClick={(e) => setRefresh(prev=>!prev)}
                    className="rounded-md bg-btns-colors-primary p-1"
                >
                    <FiRefreshCw className="h-[25px] w-[25px]" />
                </button>
            </div>
            {data ? (
                <>
                    <Table
                        className="mb-5"
                        key={Math.random()}
                        headers={TRANSLATIONS.Requests.table.headers[lang]}
                        data={convertObjectToArrays<RequestType>(data.results, [
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
                                key: "user",
                                method: (_) => {
                                    const item = _ as any;
                                    return item ? item?.username : "-";
                                },
                            },
                            {
                                key: "type",
                                method: (type_)=>{
                                    return TRANSLATIONS.Request.Types.filter((d)=>d.value === type_)[0].translate[lang]
                                },
                            },
                            {
                                key: "status",
                                method: (_) => {
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
                            },
                            {
                                key: "details",
                                method: null,
                            },
                            {
                                key: "date",
                                method: (_) => (_ ? _ : "-"),
                            },{
                                key: "note",
                                method: (_) => (_ ? _ : "-"),
                            },{
                                key: "created_at",
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
                                    if (auth.role !== "AGENT"){

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
                                                                url: "api/users/request",
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
                                }else {
                                    return null;
                                }
                            },
                            },
                        ])}
                    />
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} page={data} />
                    <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                        <label htmlFor="" className='text-center'>{TRANSLATIONS.Requests.bottom.total[lang]} : {data?.total_count}</label>
                    </div>

                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default RequestTable;
