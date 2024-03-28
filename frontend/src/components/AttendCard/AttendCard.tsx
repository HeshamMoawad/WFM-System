import type { FC } from "react";
import Container from "../../layouts/Container/Container";
import {PiFingerprint } from 'react-icons/pi';

interface AttendCardProps {}

const AttendCard: FC<AttendCardProps> = () => {
    return (
        <Container className="flex flex-col h-96 w-80 md:h-[30rem] md:w-[50rem] ">
            <section className="flex flex-col justify-around gap-4 w-full h-full text-center">
                <PiFingerprint className="w-full h-32"/>
                <div className="font-bold ">
                    <span className="block opacity-80">
                        تاريخ اليوم  
                    </span>
                    <span className="block text-xl">
                    {new Date().toDateString()}
                    </span>

                </div>

            </section>
            <section className="flex justify-around flex-row-reverse gap-1 items-center text-center w-full h-full text-[white]">


                <div className=" flex flex-col gap-5 items-center justify-center w-full " id="Port1">
                    <button className="block shadow-xl text-center w-32 h-12 md:w-56 bg-btns-colors-primary text-xl font-bold rounded-xl">
                        حضور
                    </button>
                    <div className=" text-btns-colors-primary bg-[#e8f9f5] font-bold flex justify-center items-center w-8/12 h-8 md:w-[30%] rounded-xl ">
                        <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <span className="bg-[gray] opacity-80 w-[1px] h-28"></span>

                <div className=" flex flex-col gap-5 items-center justify-center w-full " id="Port1">
                    <button className="block shadow-xl text-center w-32 h-12 md:w-56 bg-btns-colors-secondry text-xl font-bold rounded-xl">
                        انصراف
                    </button>
                    <div className=" text-[red] bg-[rgba(254,243,242,1)] font-bold flex justify-center items-center w-8/12 h-8 md:w-[30%] rounded-xl ">
                        <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

            </section>
        </Container>
    );
};

export default AttendCard;
