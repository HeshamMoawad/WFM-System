import React, { SetStateAction, useContext, useEffect, useState, type FC } from "react";
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
    user_uuid:string;
    date?:Date;
    setTotal?:React.Dispatch<React.SetStateAction<number|null>>;
    
}

const ActionPlanTableBasic: FC<ActionPlanTableProps> = ({
    className,
    user_uuid,
    date,
    setTotal
}) => {

    const [currentPage,setCurrentPage] = useState(1);
    const {lang}= useContext(LanguageContext)
    const dates_params = date ? {                date__gte: date.getMonth() === 0 ? `${date.getFullYear()-1}-12-25`: `${date.getFullYear()}-${date.getMonth()}-25` ,
    date__lte: `${date.getFullYear()}-${date.getMonth()+1}-26`,
} : {}
    const { data, loading } = useRequest<ActionPlanType>(
        {
            url: "api/commission/action-plan",
            method: "GET",
            params:{
                user__uuid:user_uuid,
                ...dates_params,
                page:currentPage
                }
        },
        [ currentPage]
    );
    useEffect(()=>{
        if(data?.results && setTotal){
            let local_total = 0;
            data?.results.forEach((val, inx) => {
                local_total += val.deduction_days
            }, 0);
            setTotal(prev=>prev ? prev + local_total : local_total)
        }
    },[data])

    return (
        <Container className={`${className}`}>
            {loading ? <LoadingComponent /> : <></>}

            <div className="flex flex-row justify-between items-center">
                <label className="text-2xl text-btns-colors-primary">
                    {TRANSLATIONS.ActionPlan.title[lang]}
                </label>
            </div>
            {data ? (
                <>
                    <Table
                        className="mb-5"
                        key={Math.random()}
                        headers={TRANSLATIONS.ActionPlan.table.headersBasic[lang]}
                        data={convertObjectToArrays<ActionPlanType>(data.results, [
                            // {
                            //     key: "user",
                            //     method: (_) => {
                            //         const item = _ as any;
                            //         return item ? item?.username : "-";
                            //     },
                            // },
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
                            },
                        ])}
                    />
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} page={data} />
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default ActionPlanTableBasic;
