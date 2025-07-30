import { FC } from "react";
import { ResponseChatMessage } from "../../types/response";
import { Status } from "../../types/response";
import { TbCheck ,  } from "react-icons/tb";
import { FaRegRectangleXmark } from "react-icons/fa6";


interface WAChatMessageProps {
    message: ResponseChatMessage;
};

export const WAChatMessage: FC<WAChatMessageProps> = ({message}) => {
    const fromMe = message?.message?.key.fromMe
    const read = message?.message?.status === Status.READ
    const delivered = message?.message?.status === Status.DELIVERY_ACK
    const sent = message?.message?.status === Status.SERVER_ACK
    const error = message?.message?.status === Status.ERROR
    const played = message?.message?.status === Status.PLAYED

    return (
    <div className={`flex flex-row gap-1 justify-end ${fromMe ? "" : "justify-start flex-row-reverse"}`}>
        <div className={`w-fit rounded-xl shadow-sm  p-2 ${fromMe ? "bg-[#128c7e]" : "bg-[#075e54]"} ${error ? "border border-btns-colors-secondry" : ""}`}>
            {message?.message?.message?.extendedTextMessage?.text}
        </div>
        <div className="flex flex-col justify-around">
            {(read || played) && (<><TbCheck className="-mb-3 w-fit h-fit text-btns-colors-primary" /><TbCheck className="-mt-3 w-fit h-fit text-btns-colors-primary" /></>)}
            {delivered && (<><TbCheck className="-mb-3 w-fit h-fit"/><TbCheck className="-mt-3 w-fit h-fit" /></>)}
            {sent && <TbCheck className="w-fit h-fit"/>}
            {error && <FaRegRectangleXmark className="w-fit h-fit text-[red]" />}
        </div>
    </div>);
}

export default WAChatMessage