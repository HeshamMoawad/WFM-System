import { FC } from "react";
import { Message, MessageAck } from "whatsapp-web.js";
import { TbCheck } from "react-icons/tb";
import { FaRegRectangleXmark } from "react-icons/fa6";

interface WAChatMessageProps {
    message: Message;
};

export const WAChatMessage: FC<WAChatMessageProps> = ({ message }) => {
    const { fromMe, body, ack } = message;

    // Using numerical values for MessageAck as per whatsapp-web.js
    const isRead = ack === 3; // MessageAck.READ
    const isDelivered = ack === 2; // MessageAck.DELIVERED
    const isSent = ack === 1; // MessageAck.SENT
    const isError = ack === -1; // MessageAck.ERROR
    const isPlayed = ack === 4; // MessageAck.PLAYED

    return (
        <div className={`flex flex-row gap-1 justify-end ${fromMe ? "" : "justify-start flex-row-reverse"}`}>
            <div className={`w-fit rounded-xl shadow-sm p-2 ${fromMe ? "bg-[#128c7e]" : "bg-[#075e54]"} ${isError ? "border border-red-500" : ""}`}>
                {body}
            </div>
            <div className="flex flex-col justify-around">
                {(isRead || isPlayed) && (<><TbCheck className="-mb-3 w-fit h-fit text-blue-400" /><TbCheck className="-mt-3 w-fit h-fit text-blue-400" /></>)}
                {isDelivered && (<><TbCheck className="-mb-3 w-fit h-fit" /><TbCheck className="-mt-3 w-fit h-fit" /></>)}
                {isSent && <TbCheck className="w-fit h-fit" />}
                {isError && <FaRegRectangleXmark className="w-fit h-fit text-red-500" />}
            </div>
        </div>
    );
}

export default WAChatMessage