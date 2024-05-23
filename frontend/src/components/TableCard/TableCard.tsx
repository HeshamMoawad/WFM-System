import { SetStateAction, useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import Table from './Table/Table';
import DatePicker from '../DatePicker/DatePicker';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { convertObjectToArrays, formatTime, getLastDayOfMonth } from '../../utils/converter';
import useRequest from '../../hooks/calls';
import { ArrivingLeaving } from '../../types/auth';
import { TRANSLATIONS, WEEK_DAYS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import SelectComponent from '../SelectComponent/SelectComponent';
import { useAuth } from '../../hooks/auth';

interface TableCardProps {
    label: string;
    userBox?: boolean ;
    userID: string;
    setUserID:React.Dispatch<SetStateAction<string>>;
    date:Date;
    setDate:React.Dispatch<SetStateAction<Date>>;
}

const TableCard: FC<TableCardProps> = ({label , userID , setUserID,date , setDate, userBox=true}) => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const {data , loading }  = useRequest<ArrivingLeaving>({
        url:"api/users/arriving-leaving",
        method:"GET",
        params:{
            user__uuid:userID ,
            date__gte: `${date.getFullYear()}-${date.getMonth()}-25`,
            date__lte: `${date.getFullYear()}-${date.getMonth()+1}-25`,
            // date__gte: `${date.getFullYear()}-${date.getMonth()+1}-1`,
            // date__lte: `${date.getFullYear()}-${date.getMonth()+1}-${getLastDayOfMonth(date)}`,
        }
    },[date,userID])
    let totalDeduction = 0

    return (
    <Container className={`md:w-2/3 min-h-[300px] h-fit relative pb-2`} >
            {
                loading ? <LoadingComponent/> : <></>
            }
            <div id="search" className='flex flex-row justify-between min-w-[1000px] md:w-full'>
                <label className='p-2 w-fit text-2xl text-btns-colors-primary'>{label}</label>

                {
                    (auth.role === "OWNER" || auth.role === "MANAGER") && userBox ?
                    (
                        <div className='w-2/6 flex justify-evenly items-center'>
                        <SelectComponent
                            selectClassName='w-2/3'
                            LabelClassName='text-xl font-bold'
                            LabelName={lang === "en" ? "User" : "الموظف"}
                            url='api/users/user'
                            name='user'
                            config={{
                                value:"uuid",
                                label:"username"
                            }}
                            setSelection={setUserID}
                        
                        />
    
                    </div>
    
                    ):null
                }
                <DatePicker type='month' className='w-1/3 h-11 text-center' setDate={setDate}/>
            </div>
            {
                data?.results ?(
                    <div>
                        <Table 
                        headers={TRANSLATIONS.AttendanceDetails.table.headers[lang]}
                        data={convertObjectToArrays<ArrivingLeaving>(
                            data.results,
                            [
                            {
                                key:"date",
                                method:(item) => new Date(item).toLocaleDateString("en-US",{ day: '2-digit', month: 'short' }),
                            }, 
                            {
                                key:"date",
                                method:(item) => WEEK_DAYS[new Date(item).getDay()][lang],
                            }, 
                            {
                                key:"arriving_at",
                                method:(item) => new Date(item).toLocaleTimeString(),
                            },
                            {
                                key:"leaving_at",
                                method:(item) => item ? new Date(item).toLocaleTimeString() : "-" ,
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
                        <div dir={lang === "en" ? "ltr" : "rtl"} className={`flex flex-row min-w-[1000px] items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                            <label>{TRANSLATIONS.AttendanceDetails.bottomBar.lateCount[lang]} : {data.results.filter((obj:ArrivingLeaving)=>obj.late > 60 ).length}</label>
                            <label>{TRANSLATIONS.AttendanceDetails.bottomBar.departureCount[lang]} : {data.results.filter((obj:ArrivingLeaving)=> obj.departure > 60 ).length}</label>
                            <label>{TRANSLATIONS.AttendanceDetails.bottomBar.AttendanceCount[lang]} : {data.results.length}</label>
                            <label>{TRANSLATIONS.AttendanceDetails.bottomBar.deuctionCount[lang]} : {totalDeduction}</label>
                            <label>{TRANSLATIONS.AttendanceDetails.bottomBar.percentageCount[lang]} : { data.results.length !== 0 ? Math.floor(((data.results.length - data.results.filter((obj:ArrivingLeaving)=>obj.late > 60 ).length )/data.results.length) *100) : 100} %</label>

                        </div>
                    </div>
                )
                :<></>
            }
    </Container>
    );
}

export default TableCard;
