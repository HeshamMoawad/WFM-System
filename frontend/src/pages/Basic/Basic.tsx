import { type FC, useState, useEffect, useContext } from "react";
import Container from "../../layouts/Container/Container";
import useRequest from "../../hooks/calls";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { User } from "../../types/auth";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import Table from "../../components/Table/Table";
import DatePicker from "../../components/DatePicker/DatePicker";
import { FaHandHoldingUsd } from "react-icons/fa";
import { TRANSLATIONS } from "../../utils/constants";
import { LanguageContext } from "../../contexts/LanguageContext";

interface BasicProps {}

const Basic: FC<BasicProps> = () => {
    const { lang } = useContext(LanguageContext)
    const [date, setDate] = useState<Date>(new Date());
    const { data, loading } = useRequest<User>(
        {
            url: "api/commission/users-basic",
            method: "GET",
            params: { date :`${date.getFullYear()}-${date.getMonth()+1}` },
        },
        [date]
    );

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
                        type="month"
                        className="md:col-span-2  h-11 text-center"
                        spanClassName="text-2xl text-center w-full place-self-center "
                        setDate={setDate}
                    />
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
                                                <Link className='rounded-md w-2/3 h-8' to={`/user-basic/${uuid}/${date.toLocaleDateString("en-US",{ day: undefined, year:"numeric", month: '2-digit'  }).replace("/","-")}`} >
                                                    <FaHandHoldingUsd className={`${has_basic ? "fill-btns-colors-primary" : "fill-btns-colors-secondry"} w-full h-6 text-center`}/>
                                                </Link>
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
};

export default Basic;
