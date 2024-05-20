import  {useContext, useEffect, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import {PiFingerprint } from 'react-icons/pi';
import { LanguageContext } from "../../contexts/LanguageContext";
import { TRANSLATIONS } from "../../utils/constants";
import { sendRequest } from "../../calls/base";
// import LoadingPage from "../../pages/LoadingPage/LoadingPage";
import { onArrive, onLeave } from "../../calls/Dashboard/Dashboard";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

interface AttendCardProps {}

const AttendCard: FC<AttendCardProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [comingDetails , setComingDetails] = useState<{arrived_at:string|null,leaved_at:string|null}>({arrived_at:null,leaved_at:null})
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        sendRequest({url:"api/users/arrive-leave-details",method:"GET"})
            .then(data => {
                 setComingDetails(data)
             })
            .catch(err => console.error(err))
            .finally(() => {                 
                setLoading(false)
             })
    },[])

    return (
        <Container className="flex flex-col w-96 h-96 md:h-[30.95rem] md:w-[50rem] relative">
            <section className="flex flex-col justify-around gap-4 w-full h-full text-center">
                <PiFingerprint className="w-full h-32"/>
                <div className="font-bold">
                    <span className="block opacity-80">
                        {TRANSLATIONS.Dashboard.middleLabel[lang]}
                    </span>
                    <span className="block text-xl">
                        {new Date().toDateString()}
                    </span>
                </div>
            </section>
            <section className="flex justify-around flex-row-reverse gap-1 items-center text-center w-full h-full text-[white]">
                <div className=" flex flex-col gap-5 items-center justify-center w-full " id="Port1">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        onArrive(lang,(arrived_at:string|null)=>{
                            setComingDetails((prev)=>{
                                return {
                                    ...prev,
                                    arrived_at:arrived_at
                            }})},setLoading )
                    }} className="block shadow-xl text-center w-32 h-12 md:w-56 bg-btns-colors-primary text-xl font-bold rounded-xl">
                        {TRANSLATIONS.Dashboard.login[lang]}
                    </button>
                    <div className=" text-btns-colors-primary bg-[#e8f9f5] font-bold flex justify-center items-center w-8/12 h-8 md:w-[30%] rounded-xl ">
                        <span className="text-sm">{
                        comingDetails.arrived_at ?
                        new Date(comingDetails.arrived_at).toLocaleTimeString()
                        :
                        null
                        }</span>
                    </div>
                </div>

                <span className="bg-[gray] opacity-80 w-[1px] h-28"></span>

                <div className=" flex flex-col gap-5 items-center justify-center w-full " id="Port1">
                    <button onClick={(e)=>{
                        e.preventDefault();
                        onLeave(lang,(leaved_at:string|null)=>{
                            setComingDetails((prev)=>{
                                return {
                                    ...prev,
                                    leaved_at:leaved_at
                            }})},setLoading)
                    }} className="block shadow-xl text-center w-32 h-12 md:w-56 bg-btns-colors-secondry text-xl font-bold rounded-xl">
                        {TRANSLATIONS.Dashboard.logout[lang]}
                    </button>
                    <div className=" text-[red] bg-[rgba(254,243,242,1)] font-bold flex justify-center items-center w-8/12 h-8 md:w-[30%] rounded-xl ">
                        <span className="text-sm">{
                        comingDetails.leaved_at ?
                        new Date(comingDetails.leaved_at).toLocaleTimeString()
                        :
                        null
                        }</span>
                    </div>
                </div>
            {
                loading? <LoadingComponent/> : null
            }

            </section>
        </Container>
    );
};

export default AttendCard;
