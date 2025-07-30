import { Dispatch, SetStateAction, FC } from "react";
import Container from "../../layouts/Container/Container";
import { useSocket } from "../../hooks/useSocket";
import { TbPlugConnectedX } from "react-icons/tb";
import { TbWifi } from "react-icons/tb";
import WANumberCard from "../../components/WANumberCard/WANumberCard";
import { Chat } from "whatsapp-web.js";


interface WhatsAppWebSideBarProps {
    setRefresh: Dispatch<SetStateAction<boolean>>;
    setCurrentChat: (chat: Chat | null) => void;
}

export const WhatsAppWebSideBar: FC<WhatsAppWebSideBarProps> = ({setRefresh , setCurrentChat}) => {
    const { isConnected , chats } = useSocket();
    
    return (
        <Container className="w-[28%] h-[77vh] bg-wa-colors-btns-colors-secondry">
            <div className="flex flex-row justify-between items-center border-b pb-1">
                <h1>WhatsApp Web Server</h1>
                {isConnected ? <TbWifi className="w-10 h-10 text-[green]" /> : <TbPlugConnectedX className="w-10 h-10 text-[red]" />}
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto h-fit p-2">
                {chats?.map((chat) => {
                    return <WANumberCard
                                onClick={() => {setCurrentChat(chat);setRefresh(prev => !prev) }}
                                key={chat.id._serialized}
                                name={chat.name}
                                id={chat.id.user}
                                lastMessage={chat.lastMessage}
                                time={chat?.lastMessage?.timestamp?.toString() || ""} />
                            })}
            </div>

        </Container>
    );
}


export default WhatsAppWebSideBar;
