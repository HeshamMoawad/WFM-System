import  {type FC , useContext, useState} from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { User } from '../../types/auth';
import { FaHandHoldingUsd, FaUserEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Table from '../../components/Table/Table';
// import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import { useAuth } from '../../hooks/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import DatePicker from 'react-datepicker';
import TableFilters from '../../components/UsersTable/TableFilters/TableFilters';

interface SalaryAllProps {
    department__name?: string;
}

const SalaryAll: FC<SalaryAllProps> = ({department__name}) => {
    var d = new Date();
    d.setMonth(d.getMonth()-1)
    const [date, setDate] = useState<Date>(d);
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)

    const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? 
                    department__name ? {department__name} : {}
                    : 
                    {department__name:auth.department.name} 
    const [filters, setFilters] = useState<object>()
    const { data, loading } = useRequest<User>(
        {
            url: "api/commission/users-commission",
            method: "GET",
            params: { 
                date :`${date.getFullYear()}-${date.getMonth()+1}` ,
                // ...(department ? {department} : {}),
                ...filters ,
                ...additionalFilter ,
            },
        },
        [date , department__name , filters],
        undefined,1000
    );


    return (<div className='flex justify-center'>
        
        <Container className='w-fit md:w-screen h-fit min-h-[500px] relative gap-3 justify-center items-center '>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.Salary.title[lang]} - {department__name ? department__name : "All"} - {date.getFullYear()}-{date.getMonth()+1}</h1>
        <div className="col-span-full mt-4 gap-8 flex justify-center">
            <TableFilters className='md:px-16' setFilters={setFilters} others={false}/>
            <h1 className="text-2xl text-center ">
                {TRANSLATIONS.Date[lang]} 
            </h1>
            <DatePicker 
                showIcon
                dateFormat="MM-yyyy"
                name='date' 
                renderMonthContent={ (month, shortMonth, longMonth, day) => {
                    const fullYear = new Date(day).getFullYear();
                    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                    return <span title={tooltipText}>{shortMonth}</span>;
                }} 
                toggleCalendarOnIconClick
                showMonthYearPicker 
                className=' h-11 text-center' 
                calendarIconClassName='w-4 h-4 fixed p-1'
                selected={date} 
                onChange={(date)=>{
                    if(date && setDate) {
                        setDate(date)
                    };
                }
            }/>
        </div>
        {
            loading? <LoadingComponent/> : <></>
        }
        {
            data ? (
                <>
                <Table
                    className='mb-2'
                    headers={TRANSLATIONS.Salary.table.headers[lang]}
                    data={convertObjectToArrays(data?.results,[
                        {
                            key:"profile",
                            method : (_)=>{
                                const item = _ as any; 
                                return (
                                        <td key={Math.random()} className='flex justify-center items-center px-3 py-1'>
                                            {
                                                item.picture ? <img src={getFullURL(item.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/> : "-"
                                            }
                                        </td>
                                )}
    
                        },{
                            key:"username",
                            method:null
                        },{
                            key:"role",
                            method:null
                        },{
                            key:"title",
                            method:null
                        },{
                            key:"department",
                            method:(item)=>{
                                const depart = item as any; 
                                return depart.name
                            }
                        },{
                            key:"project",
                            method:(item)=>{
                                const project = item as any; 
                                return project.name
                            }
                        },{
                            key:["has_basic","uuid"],
                            method : (args)=>{
                                const {has_basic,uuid} = args as any;
                                return (
                                    <td key={Math.random()} className='px-3 py-1'>
                                        <Link className='rounded-md w-2/3 h-8' to={`/user-basic/${uuid}/${date.getMonth()+1}-${date.getFullYear()}`} >
                                            <FaHandHoldingUsd className={`${has_basic ? "fill-btns-colors-primary" : "fill-btns-colors-secondry"} w-full h-6 text-center`}/>
                                            {has_basic}
                                        </Link>
                                    </td>
                                )
                            }
                        },{
                            key:["has_commission","uuid"],
                            method : (args)=>{
                                const {has_commission,uuid} = args as any;
                                return (
                                    <td key={Math.random()} className='px-3 py-1'>
                                        <Link className='rounded-md w-2/3 h-8' to={`/salary/${uuid}/${date.getMonth()+1}-${date.getFullYear()}`} >
                                            <FaHandHoldingUsd className={`${has_commission ? "fill-btns-colors-primary" : "fill-btns-colors-secondry"} w-full h-6 text-center`}/>
                                            {has_commission}
                                        </Link>
                                    </td>
                                )
                            }
                        },
                    ])}
                
                />
                </>
            ):<></>
        }


        

    </Container>
    </div>);
}

export default SalaryAll;
