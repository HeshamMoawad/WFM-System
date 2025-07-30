import { FC } from "react";
import { Message } from "whatsapp-web.js";


interface WANumberCardProps {
    id?:string | null,
    lastMessage?:Message | null,
    time?:string | null,
    name?:string | null,
    onClick?: () => void
}

const parse20Char = (str:string | undefined | null) => {
    return str?.slice(0,20)
}

export const WANumberCard: FC<WANumberCardProps> = ({id,lastMessage,time,name,onClick}) => {
    return (
        <div className="h-16 flex flex-row gap-2 text-center items-center shadow-lg rounded-xl p-1 px-2" onClick={onClick}>
            {
                <img className="w-10 h-10" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
            }
            <div className="flex flex-col justify-center w-full">
                <label className="w-full text-lg font-bold" htmlFor="">{name || id }</label>
                <label className="w-full text-xs font-bold" htmlFor="">{parse20Char(lastMessage?.body) || ""}</label>
            </div>
            <div className="flex flex-col justify-center items-start w-full h-full max-w-[20%]">
                <label className="w-full text-xs font-bold" htmlFor="">{time || "10:00 pm"}</label>
            </div>
        </div>
    );
}




export default WANumberCard;
