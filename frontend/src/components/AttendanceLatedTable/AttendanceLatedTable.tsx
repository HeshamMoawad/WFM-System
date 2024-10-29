import { SetStateAction, useContext, useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { convertObjectToArrays, formatTime, getFullURL } from '../../utils/converter';
import useRequest from '../../hooks/calls';
import { ArrivingLeaving, User } from '../../types/auth';
import { TRANSLATIONS, WEEK_DAYS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import Table from '../Table/Table';
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import '../CustomDatePicker/DatePicker.css';
import { useAuth } from '../../hooks/auth';


interface AttendanceDetailsTableProps {
    label: string;
    date:Date;
    setDate?:React.Dispatch<SetStateAction<Date>>;
    withDetails?: boolean;
    className?: string;
}

const AttendanceDetailsTable: FC<AttendanceDetailsTableProps> = ({label ,date , setDate,className,  withDetails=true}) => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? {} : {department : auth.department.uuid}
    const {data , loading }  = useRequest<ArrivingLeaving>({
        url:"api/users/arriving-leaving-list",
        method:"POST",
        params:{
            date: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            ...additionalFilter
        }
    },[date])
    let totalDeduction = 0
    useEffect(()=>{
    },[data])
    return (
        <Container className={`${className} h-fit relative pb-2`} >
        {
            loading ? <LoadingComponent/> : <></>
        }
        <div id="search" className='flex flex-row justify-evenly md:min-w-[1000px] w-[1000px] md:w-full'>
            <label className='p-2 w-fit text-2xl text-btns-colors-primary'>{label}</label>
            {
                withDetails ? (
                <DatePicker 
                    showIcon 
                    toggleCalendarOnIconClick 
                    renderMonthContent={ (month, shortMonth, longMonth, day) => {
                        const fullYear = new Date(day).getFullYear();
                        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                        return <span title={tooltipText}>{shortMonth}</span>;
                    }} 
                    dateFormat="dd-MM-yyyy" 
                    className='text-center mr-5 w-full border border-[gray]' 
                    calendarIconClassName='w-8 h-8 fixed p-1'
                    selected={date} 
                    onChange={(date)=>{
                        if(date && setDate) {
                            setDate(date)
                        };
                    }
                    }/>):null
                }
            
        </div>
        {
            data?.results ?(
                <>
                    <Table 
                    headers={TRANSLATIONS.AttendanceLated.table.headers[lang]}
                    data={convertObjectToArrays<ArrivingLeaving>(
                        data.results.filter((val,index,arr)=> val.deduction > 0),
                        [
                        {
                            key:"user",
                            method : (_)=>{
                                const arr = _ as any;
                                const user = arr as User;
                                return (
                                    user.profile?.picture ? 
                                        <td key={Math.random()} className='flex justify-center items-center px-3 py-1'>
                                            <img loading='lazy' src={getFullURL(user.profile?.picture)} alt="" className='rounded-full w-[40px] h-[40px] object-contain'/>
                                        </td>
                                        : 
                                        <td key={Math.random()} className='text-center w-[40px] h-[40px] px-3 py-1'>
                                            -
                                            {/* <img src={getFullURL(item.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/> */}
                                        </td>
                                )}
                        },
                        {
                            key:"user",
                            method:(item) => {
                                const arr = item as any;
                                const user = arr as User;
                                return user?.username
                            },
                        }, 
                        {
                            key:"date",
                            method:(item) => new Date(item as string).toLocaleDateString("en-US",{ day: '2-digit', month: '2-digit' }).replace("/"," - "),
                        }, 
                        {
                            key:"date",
                            method:(item) => WEEK_DAYS[new Date(item as string).getDay()][lang],
                        }, 
                        {
                            key:["arriving_at","deduction"],
                            method:(item) => {
                                var color = ""
                                const {arriving_at , deduction } =  item as any;
                                if (!arriving_at){
                                    return "-"
                                }
                                if ( deduction > 0 && deduction < 0.5){
                                    color =  "#ee9898"
                                }
                                if (deduction > 0.5 && deduction < 1 ){
                                    color =  "#e64444"
                                }
                                if (deduction >= 1 ){
                                    color =  "red"
                                }
                                // item ? <label>{new Date(item as string).toLocaleTimeString()}</label>  : "-"
                                return <td style={{color:`${color}`}} className={`px-3 py-1`}>{new Date(arriving_at as string).toLocaleTimeString()}</td>
                            },
                        },
                        {
                            key:["leaving_at","departure"],
                            method:(item) => {
                                var color = ""
                                const {leaving_at , departure } =  item as any;
                                if (!leaving_at){
                                    return "-"
                                }
                                if ( departure > 600 && departure < 3600){
                                    color =  "#ee9898"
                                }
                                if (departure > 3600 && departure < 7200 ){
                                    color =  "#e64444"
                                }
                                if (departure >= 7200){
                                    color =  "red"
                                }
                                // item ? <label>{new Date(item as string).toLocaleTimeString()}</label>  : "-"
                                return <td style={{color:`${color}`}} className={`px-3 py-1`}>{new Date(leaving_at as string).toLocaleTimeString()}</td>
                            },
                        },
                        {
                            key:"deuration",
                            method:(item) => item ? `${formatTime(item as number)}` : "-",
                        },
                        {
                            key:"late",
                            method:(item)=>`${formatTime(item as number)}`,
                        },
                        {
                            key:"departure",
                            method:(item)=>`${formatTime(item as number)}`,
                        },
                        {
                            key:"deduction",
                            method:(_)=>{
                                const du = _ as number;
                                totalDeduction = totalDeduction + du;
                                return <td className={`px-3 py-1`}>{_}</td>
                            },
                        },

                    ],
                )}
                    
                    />
                </>
            )
            :<></>
        }
</Container>
);
}

export default AttendanceDetailsTable;
