import { SetStateAction, useContext, useEffect, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import useRequest from "../../hooks/calls";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Table from "../Table/Table";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { TreasuryRecord } from "../../types/auth";
import { sendRequest } from "../../calls/base";
import Swal from "sweetalert2";
import Pagination from "../Pageination/Pageination";
import { TRANSLATIONS } from "../../utils/constants";
import { LanguageContext } from "../../contexts/LanguageContext";
import { checkPermission } from "../../utils/permissions/permissions";
import { useAuth } from "../../hooks/auth";

interface TreasuryTableProps {
    label?: string;
    url: string;
    color?: string;
    refresh?: boolean;
    setRefresh?: React.Dispatch<SetStateAction<boolean>>;
}

const TreasuryTable: FC<TreasuryTableProps> = ({ label, url, color , refresh , setRefresh }) => {
    const { lang } = useContext(LanguageContext)
    const [currentPage, setCurrentPage] = useState(1)
    const {auth} = useAuth()
    const canDelete = checkPermission(auth,"delete_treasury")
    const { data, loading } = useRequest<TreasuryRecord>(
        {
            url: url,
            method: "GET",
            params: {
                page: currentPage,
            },
        },
        [currentPage , refresh]
    );
    return (
        <Container className="w-full h-fit relative">
            {loading ? <LoadingComponent /> : <></>}
            <h1 className={`text-2xl text-${color}`}>{label}</h1>

            {data ? (
                <>
                    <Table
                        headers={TRANSLATIONS.Treasury.intable.headers[lang]}
                        data={convertObjectToArrays(data?.results, [
                            {
                                key: "creator",
                                method: (_) => {
                                    const item = _ as any;
                                    return (
                                        <td className="flex justify-center items-center">
                                            {item?.profile?.picture ? (
                                                <img
                                                    src={getFullURL(
                                                        item?.profile?.picture
                                                    )}
                                                    alt=""
                                                    className="rounded-full w-[50px] h-[50px]"
                                                />
                                            ) : (
                                                " "
                                            )}
                                        </td>
                                    );
                                },
                            },
                            {
                                key: "creator",
                                method: (_) => {
                                    const item = _ as any;
                                    return item?.username
                                        ? item?.username
                                        : "System";
                                },
                            },
                            {
                                key: "amount",
                                method: (_) => {
                                    return <td className="px-3 py-1">{_}</td>;
                                },
                            },
                            {
                                key: "details",
                                method: (_) => {
                                    return <td className="px-3 py-1">{_}</td>;
                                },
                            },
                            {
                                key: "created_at",
                                method: (_: any) => {
                                    if (_) {
                                        const date = new Date(_);
                                        return `${date.getFullYear()}-${
                                            date.getMonth() + 1
                                        }-${date.getDate()}  -  ${date.getHours()}:${date.getMinutes()}`;
                                    }

                                    return "-";
                                },
                            },
                            {
                                key: ["uuid","from_advance" , "from_basic" , "from_salary"],
                                method: (args) => {
                                    const {uuid ,from_advance , from_basic , from_salary } = args as any;
                                    const show_delete = canDelete && (from_advance ? false : from_basic ? false : from_salary ? false : true) //!(typeof from_advance === "string" || typeof from_basic === "string")
                                    return (
                                        <td
                                            key={Math.random()}
                                            className="px-3 py-1"
                                        >
                                            {
                                                show_delete ? (
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
                                                                        url: url,
                                                                        method: "DELETE",
                                                                        params: {
                                                                            uuid: uuid,
                                                                        },
                                                                    })
                                                                        .then((data) => {
                                                                            console.log(
                                                                                data
                                                                            );
                                                                            Swal.fire({
                                                                                position:
                                                                                    "center",
                                                                                icon: "success",
                                                                                title: "Deleted Successfully",
                                                                                showConfirmButton:
                                                                                    false,
                                                                                timer: 1000,
                                                                            }); //.then(() => setRefresh())
                                                                        })
                                                                        .catch((err) => {
                                                                            console.log(
                                                                                data,
                                                                                err
                                                                            );
                                                                            Swal.fire({
                                                                                position:
                                                                                    "center",
                                                                                icon: "error",
                                                                                title: "can't Deleted",
                                                                                showConfirmButton:
                                                                                    false,
                                                                                timer: 1000,
                                                                            });
                                                                        }).finally(()=>{
                                                                            if(setRefresh){
                                                                                setRefresh(prev=>!prev)
                                                                            }
                                                                        })
                                                                        }
                                                                    });                
            
                                                            
                                                        }}
                                                        className="rounded-md bg-btns-colors-secondry w-2/3 min-w-[80px]"
                                                    >
                                                        {TRANSLATIONS.Treasury.inform.delete[lang]}
                                                    </button>
                                            ) : null
                                            }
                                        </td>
                                    );
                                },
                            },
                        ])}
                    />
                    <Pagination page={data} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                    <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                        <label htmlFor="" className='text-center'>Count : {data?.total_count}</label>
                    </div>

                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default TreasuryTable;
