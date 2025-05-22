import React, { SetStateAction, useContext, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import Table from "../Table/Table";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { ActionPlanType } from "../../types/auth";
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
import { checkPermission } from "../../utils/permissions/permissions";

interface ActionPlanTableProps {
    className?: string;
    refresh: boolean;
    setRefresh: React.Dispatch<SetStateAction<boolean>>;
}

const ActionPlanTable: FC<ActionPlanTableProps> = ({
    className,
    refresh,
    setRefresh,
}) => {

    const [currentPage,setCurrentPage] = useState(1);
    const {lang}= useContext(LanguageContext)
    const { auth } = useAuth();
    const canDelete = checkPermission(auth,"delete_actionplan")
    const { data, loading } = useRequest<ActionPlanType>(
        {
            url: "api/commission/action-plan",
            method: "GET",
            params:{
                page_size:20,
                page:currentPage
            }
        },
        [refresh , currentPage]
    );
    return (
        <Container className={`${className}`}>
            {loading ? <LoadingComponent /> : <></>}

            <div className="flex flex-row justify-between items-center">
                <label className="text-2xl text-btns-colors-primary">
                    {TRANSLATIONS.ActionPlan.title[lang]}
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
                        headers={TRANSLATIONS.ActionPlan.table.headers[lang]}
                        data={convertObjectToArrays<ActionPlanType>(data.results, [
                            {
                                key: "user",
                                method: (_) => {
                                    const item = _ as any;
                                    return item ? item?.username : "-";
                                },
                            },
                            {
                                key: "deduction_days",
                                method: (_) => {
                                    return (
                                        <td
                                            key={Math.random()}
                                            className="px-3 py-1 min-w-[100px] flex justify-center items-center"
                                        >

                                        <p className="text-[red]">{_} Day</p>
                                        </td>
                                    )
                                },
                            },
                            {
                                key: "name",
                                method: null
                            },
                            {
                                key: "description",
                                method: (_) => {
                                    return (
                                        <td
                                            key={Math.random()}
                                            className="px-3 py-1 min-w-[100px] flex justify-center items-center"
                                        >

                                        <p>{_}</p>
                                        </td>
                                    )
                                },
                            },
                            {
                                key: "date",
                                method: (_) => (_ ? _ : "-"),
                            },
                            {
                                key: "creator",
                                method: (_) => {
                                    const item = _ as any;
                                    return item ? item?.username : "-";
                                },
                            },
                            {
                                key: "created_at",
                                method: (_: any) => {
                                    if (_) {
                                        const date = new Date(_);
                                        return `${date.getFullYear()}-${
                                            date.getMonth() + 1
                                        }-${date.getDate()}  ${date.toLocaleTimeString("en-UK",{hour12:true ,hour:"2-digit",minute:"2-digit"})}`;
                                    }
                                    return "-";
                                },
                            },{
                                key: "uuid",
                                method: (uuid) => {
                                    if (canDelete){
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
                                                                url: "api/commission/action-plan",
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

export default ActionPlanTable;
