import { type FC, useState, useContext } from "react";
import Container from "../../layouts/Container/Container";
import useRequest from "../../hooks/calls";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { User } from "../../types/auth";
// import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import Table from "../../components/Table/Table";
// import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { FaHandHoldingUsd } from "react-icons/fa";
import { TRANSLATIONS } from "../../utils/constants";
import { LanguageContext } from "../../contexts/LanguageContext";
import DatePicker from "react-datepicker";
import { checkPermission } from "../../utils/permissions/permissions";
import { useAuth } from "../../hooks/auth";

interface BasicProps {}

const Basic: FC<BasicProps> = () => {
    const { lang } = useContext(LanguageContext)
    const [date, setDate] = useState<Date>(new Date());
    const {auth} = useAuth()
    const { data, loading } = useRequest<User>(
        {
            url: "api/commission/users-basic",
            method: "GET",
            params: { date :`${date.getFullYear()}-${date.getMonth()+1}` },
        },
        [date]
    );
    const canAddBasic = checkPermission(auth,"add_basicrecord")
    if(checkPermission(auth,"view_basicrecord")){
        return (
            <div className="flex justify-center">
                <Container className="w-fit md:w-screen h-fit min-h-[300px] relative gap-3 justify-center items-center ">
                    <div className="w-full grid md:grid-cols-8">
                        <h1 className="md:col-span-5 text-2xl text-center text-btns-colors-primary w-full place-self-center">
                            {TRANSLATIONS.Basic.title[lang]} 
                        </h1>
                        <h1 className="col-span-1 text-2xl text-center w-full place-self-center">
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
                            className='md:w-full text-center border border-[gray]' 
                            calendarIconClassName='w-4 h-4 fixed p-1'
                            selected={date} 
                            onChange={(date)=>{
                                if(date && setDate) {
                                    setDate(date)
                                };
                            }
                        }/>
                    </div>

                    {loading ? <LoadingComponent /> : <></>}

                    {data ? (
                        <>
                            <Table
                                className="mb-2"
                                headers={TRANSLATIONS.Basic.table.headers[lang]} 
                                data={convertObjectToArrays(data?.results, [
                                    {
                                        key: "profile",
                                        method: (_) => {
                                            const item = _ as any;
                                            return item.picture ? (
                                                <td
                                                    key={Math.random()}
                                                    className="flex justify-center items-center px-3 py-1"
                                                >
                                                    <img
                                                        src={getFullURL(
                                                            item.picture
                                                        )}
                                                        alt=""
                                                        className="rounded-full w-[40px] h-[40px]"
                                                    />
                                                </td>
                                            ) : (
                                                <td
                                                    key={Math.random()}
                                                    className="text-center w-[40px] h-[40px] px-3 py-1"
                                                >
                                                    -
                                                    {/* <img src={getFullURL(item.picture)} alt="" className='rounded-full w-[40px] h-[40px]'/> */}
                                                </td>
                                            );
                                        },
                                    },
                                    {
                                        key: "username",
                                        method: null,
                                    },
                                    {
                                        key: "role",
                                        method: null,
                                    },
                                    {
                                        key: "title",
                                        method: null,
                                    },
                                    {
                                        key: "department",
                                        method: (item) => {
                                            const depart = item as any;
                                            return depart.name;
                                        },
                                    },
                                    {
                                        key: "project",
                                        method: (item) => {
                                            const project = item as any;
                                            return project.name;
                                        },
                                    },
                                    {
                                        key: "has_basic",
                                        method: (has_basic) => {
                                            return has_basic ? (
                                                <td
                                                    key={Math.random()}
                                                    className="text-center w-[40px] h-[40px] px-3 py-1"
                                                >
                                                    {has_basic}
                                                </td>
                                            ) : (
                                                <td
                                                key={Math.random()}
                                                className="text-center w-[40px] h-[40px] px-3 py-1"
                                            >
                                                -
                                            </td>

                                            )
                                        },
                                    },{
                                        key:["has_basic","uuid"],
                                        method : (args)=>{
                                            const {has_basic,uuid} = args as any;
                                            return (
                                                <td key={Math.random()} className='px-3 py-1'>
                                                    {
                                                        canAddBasic ?                                                     
                                                        <Link className='rounded-md w-2/3 h-8' to={`/user-basic/${uuid}/${date.toLocaleDateString("en-US",{ day: undefined, year:"numeric", month: '2-digit'  }).replace("/","-")}`} >
                                                            <FaHandHoldingUsd className={`${has_basic ? "fill-btns-colors-primary" : "fill-btns-colors-secondry"} w-full h-6 text-center`}/>
                                                        </Link>
                                                        :null
                                                    }
                                                </td>
                                            )
                                        }
                                    }
                                ])}
                            />
                        </>
                    ) : (
                        <></>
                    )}
                </Container>
            </div>
        );
    }
    return null
};

export default Basic;
