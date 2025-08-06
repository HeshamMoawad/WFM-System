import { FC } from "react";
import { MessageAck } from "whatsapp-web.js";
import { AppMessage } from "../../types/whatsapp";
import { TbCheck } from "react-icons/tb";
import { FaFileAlt } from "react-icons/fa";
import { FaRegRectangleXmark } from "react-icons/fa6";

interface WAChatMessageProps {
    message: AppMessage;
};

const QuotedMessage: FC<{ message: AppMessage }> = ({ message }) => {
    return (
        <div className="bg-black bg-opacity-20 p-2 rounded-lg mb-1 border-l-4 border-green-400">
            <p className="text-sm font-bold text-green-300">{message.author || message.from}</p>
            <p className="text-white text-opacity-80">{message.body.length > 100 ? `${message.body.substring(0, 100)}...` : message.body}</p>
        </div>
    );
};

const DocumentMessage: FC<{ message: AppMessage }> = ({ message }) => {
        const extendedData = message._data;

    const downloadUrl = extendedData.deprecatedMms3Url;
    const filename = extendedData.filename || message.body;
    const filesize = extendedData.size ? `${(extendedData.size / 1024).toFixed(2)} KB` : '';
    const caption = extendedData.caption;

    return (
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:bg-opacity-10">
            <FaFileAlt className="w-8 h-8 text-gray-300" />
            <div className="flex flex-col">
                <p className="font-semibold text-white">{filename}</p>
                <p className="text-sm text-gray-400">{filesize}</p>
                {caption && <p className="text-sm mt-1 text-gray-200">{caption}</p>}
            </div>
        </a>
    );
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
            <div className={`w-fit max-w-lg rounded-xl shadow-sm p-2 ${fromMe ? "bg-[#128c7e]" : "bg-[#075e54]"} ${isError ? "border border-red-500" : ""}`}>
                {message.hasQuotedMsg && message.quotedMsg && <QuotedMessage message={message.quotedMsg} />}
                {message.type === 'document' ? (
                    <DocumentMessage message={message} />
                ) : (
                    <p className="text-white whitespace-pre-wrap">{body}</p>
                )}
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