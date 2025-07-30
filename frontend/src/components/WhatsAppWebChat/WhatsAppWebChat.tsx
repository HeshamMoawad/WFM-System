import { FC, useEffect, useState } from "react";
import Container from "../../layouts/Container/Container";
import WAInputMessage from "../WAInputMessage/WAInputMessage";
import { BASE_URL_NESTJS } from "../../utils/constants";
import { ResponseChatMessageType, ResponseChatType, ResponseChat } from "../../types/response";
import WAChatMessage from "../WAChatMessage/WAChatMessage";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import useRequests from "../../hooks/requests";
import { convertJidToPhone } from "../../utils/converter";
import { useSocket } from "../../hooks/useSocket";
import { Chat } from "whatsapp-web.js";


interface WhatsAppWebChatProps {
    refresh: boolean;
    currentChat: Chat | null;
};

export const WhatsAppWebChat: FC<WhatsAppWebChatProps> = ({refresh , currentChat}) => {

    const { isConnected, socket } = useSocket();
    
    // Debug effect to log changes
    useEffect(() => {
        console.log('Chat changed:', { 
            hasCurrentChat: !!currentChat, 
            chatId: currentChat?.id._serialized,
            isConnected,
            hasSocket: !!socket 
        });
    }, [currentChat, isConnected, socket , refresh]);

    // Handle chat messages
    useEffect(() => {
        if (!isConnected || !currentChat || !socket) {
            console.log('Skipping effect - missing requirements:', { isConnected, hasCurrentChat: !!currentChat, hasSocket: !!socket });
            return;
        }

        console.log('Setting up chat messages for:', currentChat.id._serialized);
        
        const handleChatMessages = (data: any) => {
            console.log(`Received messages for ${currentChat.id._serialized}:`, data);
            // Handle the received messages here
        };

        // Set up the listener
        socket.on("getChatMessages", handleChatMessages);
        // Request messages for the current chat
        socket.emit("getChatMessages", {
            chatId: currentChat.id._serialized,
        });

        // Cleanup function
        return () => {
            console.log('Cleaning up previous chat:', currentChat.id._serialized);
            socket.off("getChatMessages", handleChatMessages);
        };
    }, [currentChat?.id._serialized, isConnected, socket , refresh]);

    return (
        <Container className="w-[76%] h-[77vh] bg-wa-colors-background">
            {
                currentChat ? (
                    <>
                        <div className="sticky top-0 flex flex-row justify-between items-center border-b w-full pb-1 text-center bg-wa-colors-background">
                            <label className="w-full text-lg font-bold" htmlFor="">{currentChat?.name } {currentChat?.name ? " | " : ""} {convertJidToPhone(currentChat?.id.user || "")}</label>
                        </div>
                        <div className="flex flex-col overflow-y-auto gap-1 p-2 min-h-[68vh]">
                            {/* {
                                messages?.map((message, index) => {
                                    return <WAChatMessage key={index} message={message} />
                                })
                            } */}
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
