import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../layouts/Container/Container";
import WAInputMessage from "../WAInputMessage/WAInputMessage";
import WAChatMessage from "../WAChatMessage/WAChatMessage";
import { convertJidToPhone } from "../../utils/converter";
import { getSocket } from "../../services/socket";
import { AppChat, setMessagesForChat } from "../../features/chats/chatSlice";
import { RootState } from "../../store/store";
import { Message } from "whatsapp-web.js";

interface WhatsAppWebChatProps {
    refresh: boolean;
    currentChat: AppChat | null;
};

export const WhatsAppWebChat: FC<WhatsAppWebChatProps> = ({ currentChat }) => {
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.chats.chats);

    const selectedChat = chats.find(c => c.id._serialized === currentChat?.id._serialized);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentChat) {
            return;
        }

        const handleChatMessages = (data: { chatId: string; messages: Message[] }) => {
            if (data.chatId === currentChat.id._serialized) {
                dispatch(setMessagesForChat(data));
            }
        };

        socket.on("getChatMessages", handleChatMessages);

        socket.emit("getChatMessages", {
            chatId: currentChat.id._serialized,
        });

        return () => {
            socket.off("getChatMessages", handleChatMessages);
        };
    }, [currentChat, dispatch]);

    return (
        <Container className="w-[76%] h-[77vh] bg-wa-colors-background">
            {
                currentChat && selectedChat ? (
                    <>
                        <div className="sticky top-0 flex flex-row justify-between items-center border-b w-full pb-1 text-center bg-wa-colors-background">
                            <label className="w-full text-lg font-bold" htmlFor="">{currentChat?.name} {currentChat?.name ? " | " : ""} {convertJidToPhone(currentChat?.id.user || "")}</label>
                        </div>
                        <div className="flex flex-col overflow-y-auto gap-1 p-2 min-h-[68vh]">
                            {
                                selectedChat.messages?.map((message, index) => {
                                    return <WAChatMessage key={index} message={message} />
                                })
                            }
                        </div>
                        <WAInputMessage targetId={currentChat?.id._serialized || ""} />
                    </>
                ) : (
                    <div className="flex flex-col overflow-y-auto gap-1 p-2 min-h-[68vh]">
                        <label className="w-full text-lg font-bold text-center" htmlFor="">Select a chat</label>
                    </div>
                )
            }
        </Container>
    );
}



export default WhatsAppWebChat;
