import { FC, useEffect, useState } from "react";
import WhatsAppWebSidebar from "../../components/WhatsAppWebSideBar/WhatsAppWebSideBar";
import WhatsAppWebChat from "../../components/WhatsAppWebChat/WhatsAppWebChat";
import { SocketProvider } from "../../contexts/socketProvider";
import { sendRequest } from "../../calls/base";
import { BASE_URL_NESTJS } from "../../utils/constants";
import { ResponseChatType , ResponseChat } from "../../types/response";
import {requests} from "../../hooks/requests";
import { AppChat } from "../../features/chats/chatSlice";
import useSocket from "../../hooks/useSocket";
import { useDispatch } from "react-redux";
import { setMyChats } from "../../features/mychats/mychatsSlice";

interface WhatsAppWebProps {
}

export const WhatsAppWeb: FC<WhatsAppWebProps> = () => {
    const [refresh , setRefresh] = useState(false);
    const [currentChat , setCurrentChat] = useState<AppChat | null>(null);
    const _ =  useSocket()
    const dispatch = useDispatch()
    const [refreshMyChats , setRefreshMyChats] = useState(false);
    const interval = setInterval(() => {
        setRefreshMyChats(prev => !prev)
    }, 15000);

    useEffect(() => {
        sendRequest({url:"api/users/whatsapp-number",method:"GET"})
            .then((data)=>{
                dispatch(setMyChats(data))
            })
            .catch((err)=>{
                console.error(err)
            })
        return () => clearInterval(interval);
    }, [refreshMyChats , dispatch]);
    
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

