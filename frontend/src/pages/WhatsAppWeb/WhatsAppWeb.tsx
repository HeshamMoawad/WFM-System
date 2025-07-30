import { FC, useEffect, useState } from "react";
import WhatsAppWebSidebar from "../../components/WhatsAppWebSideBar/WhatsAppWebSideBar";
import WhatsAppWebChat from "../../components/WhatsAppWebChat/WhatsAppWebChat";
import { SocketProvider } from "../../contexts/socketProvider";
import { sendRequest } from "../../calls/base";
import { BASE_URL_NESTJS } from "../../utils/constants";
import { ResponseChatType , ResponseChat } from "../../types/response";
import {requests} from "../../hooks/requests";
import { Chat } from "whatsapp-web.js";

interface WhatsAppWebProps {
}

export const WhatsAppWeb: FC<WhatsAppWebProps> = () => {
    const [refresh , setRefresh] = useState(false);
    const [currentChat , setCurrentChat] = useState<Chat | null>(null);
    return (
            <SocketProvider>
                <div className={`w-[99%] mx-auto bg-white flex flex-row p-1`}>
                    <WhatsAppWebSidebar setRefresh={setRefresh} setCurrentChat={setCurrentChat} />
                    <WhatsAppWebChat refresh={refresh} currentChat={currentChat} />
                </div>
            </SocketProvider>
    );
};

export default WhatsAppWeb;

