import { SetStateAction, useContext, useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { convertObjectToArrays, formatTime, getLastDayOfMonth } from '../../utils/converter';
import useRequest from '../../hooks/calls';
import { ArrivingLeaving } from '../../types/auth';
import { TRANSLATIONS, WEEK_DAYS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import SelectComponent from '../SelectComponent/SelectComponent';
import { useAuth } from '../../hooks/auth';
import Table from '../Table/Table';
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import '../CustomDatePicker/DatePicker.css';


interface AttendanceDetailsTableProps {
    label: string;
    userBox?: boolean ;
    userID: string;
    setUserID?:React.Dispatch<SetStateAction<string>>; 
    date:Date;
    setDate?:React.Dispatch<SetStateAction<Date>>;
    withDetails?: boolean;
    className?: string;
    setTotal?:React.Dispatch<SetStateAction<number|null>>;
}

const AttendanceDetailsTable: FC<AttendanceDetailsTableProps> = ({label , userID , setTotal, setUserID,date , setDate,className, userBox=true , withDetails=true}) => {
    const [percentage,setPercantage] = useState(0)
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser || auth.role === "HR" ? {is_superuser:"False",is_staff:"False"} : {is_superuser:"False",department__name : auth.department.name , role:"AGENT"}
    const {data , loading }  = useRequest<ArrivingLeaving>({
        url:"api/users/arriving-leaving-list",
        method:"GET",
        params:{
            user_id:userID ,
            year: `${date.getFullYear()}`,
            month: `${date.getMonth()+1}`,
            // date__gte: `${date.getFullYear()}-${date.getMonth()+1}-1`,
            // date__lte: `${date.getFullYear()}-${date.getMonth()+1}-${getLastDayOfMonth(date)}`,
        }
    },[date,userID])
    let totalDeduction = 0
    useEffect(()=>{
        if (data?.results){
            const filterd = data.results.filter((obj:ArrivingLeaving)=> obj.arriving_at !== null)
            const lated = filterd.filter((obj:ArrivingLeaving)=> obj.late < 60 )
            const per = Math.floor(((filterd.length - lated.length) / filterd.length)*100)
            setPercantage( per ?  per : 0)
            if (setTotal){
                let total = 0;
                data?.results.map((obj,inx)=>{
                    total += Number(obj.deduction)
                })
                setTotal(total)
            }

        }
    },[data])
    return (
        <Container className={`${className} h-fit relative pb-2`} >
        {
            loading ? <LoadingComponent/> : <></>
        }
        <div id="search" className='flex flex-row justify-between md:min-w-[1000px] w-[1000px] md:w-full'>
            <label className='p-2 w-fit text-2xl text-btns-colors-primary'>{label}</label>
            {
                (auth.role === "OWNER" || auth.role === "MANAGER" || auth.role === "HR") && userBox && withDetails ?
                (
                    <div className='w-2/6 flex justify-evenly items-center'>
                    <SelectComponent
                        selectClassName='md:w-2/3'
                        LabelClassName='text-xl font-bold'
                        LabelName={lang === "en" ? "User" : "الموظف"}
                        url='api/users/user'
                        name='user'
                        config={{
                            value:"uuid",
                            label:"username"
                        }}
                        setSelection={setUserID}
                        params={additionalFilter}
                        moreOptions={[{label:"Me", value:auth.uuid}]}
                        // selected={[auth.username]}
                    />

                </div>

                ):null
            }
            {
                withDetails ? (
                <DatePicker 
                    showIcon 
                    toggleCalendarOnIconClick
                    showMonthYearPicker 
                    renderMonthContent={ (month, shortMonth, longMonth, day) => {
                        const fullYear = new Date(day).getFullYear();
                        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                        return <span title={tooltipText}>{shortMonth}</span>;
                    }} 
                    dateFormat="MM-yyyy" 
                    className='text-center w-full border border-[gray]' 
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
                    headers={TRANSLATIONS.AttendanceDetails.table.headers[lang]}
                    data={convertObjectToArrays<ArrivingLeaving>(
                        data.results,
                        [
                        {
                            key:"date",
                            method:(item) => new Date(item as string).toLocaleDateString("en-US",{ day: '2-digit', month: '2-digit' }).replace("/"," - "),
                        }, 
                        {
                            key:"date",
                            method:(item) => WEEK_DAYS[new Date(item as string).getDay()][lang],
                        }, 
                        {
                            key:"arriving_at",
                            method:(item) => item ? new Date(item as string).toLocaleTimeString() : "-",
                        },
                        {
                            key:"leaving_at",
                            method:(item) => item ? new Date(item as string).toLocaleTimeString() : "-" ,
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
                                return _
                            },
                        },

                    ],
                )}
                    
                    />
                    <div dir={lang === "en" ? "ltr" : "rtl"} className={`flex flex-row min-w-[950px] md:min-w-[1000px] items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.lateCount[lang]} : {data?.results?.filter((obj:ArrivingLeaving)=>obj.late > 60 ).length}</label>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.departureCount[lang]} : {data?.results?.filter((obj:ArrivingLeaving)=> obj.departure > 60 ).length}</label>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.AttendanceCount[lang]} : {data?.results?.filter((obj:ArrivingLeaving)=> obj.arriving_at ).length}</label>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.DaysCount[lang]} : {data?.results?.length}</label>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.deuctionCount[lang]} : {totalDeduction}</label>
                        <label>{TRANSLATIONS.AttendanceDetails.bottomBar.percentageCount[lang]} : {percentage} %</label>

                    </div>
                </>
            )
            :<></>
        }
</Container>
);
}

export default AttendanceDetailsTable;
