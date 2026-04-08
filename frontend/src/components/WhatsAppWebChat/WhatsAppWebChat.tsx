import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../layouts/Container/Container";
import WAInputMessage from "../WAInputMessage/WAInputMessage";
import WAChatMessage from "../WAChatMessage/WAChatMessage";
import { convertJidToPhone } from "../../utils/converter";
import { getSocket } from "../../services/socket";
import { AppChat } from "../../features/chats/chatSlice";
import { RootState } from "../../store/store";
import { AppMessage } from "../../types/whatsapp";
import { FaAngleDoubleDown } from "react-icons/fa";
import { CLIENTID } from "../../utils/constants";

interface WhatsAppWebChatProps {
    refresh: boolean;
    currentChat: AppChat | null;
};

export const WhatsAppWebChat: FC<WhatsAppWebChatProps> = ({ currentChat }) => {
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.chats.chats);
    const messages = useSelector((state: RootState) => state.messages.messages);
    const selectedChat = chats.find(c => c.id._serialized === currentChat?.id._serialized);

    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollPositions = useRef<{ [key: string]: number }>({});
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const prevChatId = useRef<string | null>(null);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !currentChat) {
            return;
        }

        if (currentChat.unreadCount > 0) {
            socket.emit('markChatAsRead', { clientId: CLIENTID, chatId: currentChat.id._serialized });
        }

        const chatContainer = scrollRef.current;
        if (chatContainer) {
            // Check if we have a saved position for this chat
            const savedPosition = scrollPositions.current[currentChat.id._serialized];
            if (savedPosition !== undefined && savedPosition !== null) {
                // Restore the saved scroll position
                chatContainer.scrollTop = savedPosition;
                // Show scroll to bottom button if not at bottom
                const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 1;
                setShowScrollToBottom(!isAtBottom);
            } else {
                // If no saved position, scroll to bottom (new chat)
                setTimeout(() => {
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        setShowScrollToBottom(false);
                    }
                }, 0);
            }
        }

        return () => {
            if (chatContainer && currentChat) {
                scrollPositions.current[currentChat.id._serialized] = chatContainer.scrollTop;
            }
        };
    }, [currentChat, dispatch]);

    // Effect to handle scrolling when new messages arrive
    useEffect(() => {
        const chatContainer = scrollRef.current;
        if (chatContainer) {
            // Check if user was already at the bottom before new messages arrived
            const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 1;
            
            // Update messages and scroll to bottom only if user was at bottom or it's a new chat
            if (prevChatId.current !== currentChat?.id._serialized || isAtBottom) {
                // Use setTimeout to ensure DOM has updated before scrolling
                setTimeout(() => {
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        setShowScrollToBottom(false); // Hide scroll button when at bottom
                    }
                }, 0);
            } else {
                // Show scroll to bottom button if user is not at the bottom
                setShowScrollToBottom(true);
            }
        }
        prevChatId.current = currentChat?.id._serialized || null;
    }, [messages, currentChat]);

    const handleScroll = () => {
        const chatContainer = scrollRef.current;
        if (chatContainer) {
            // Check if user is at the bottom of the chat
            const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 1;
            setShowScrollToBottom(!isAtBottom);
        }
    };

    const scrollToBottom = () => {
        const chatContainer = scrollRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
            setShowScrollToBottom(false); // Hide the button after scrolling to bottom
        }
    };

    const handleUnarchiveChat = () => {
        if (!currentChat) return;
        const socket = getSocket();
        if (!socket) return;
        
        socket.emit('unarchiveChat', { 
            clientId: CLIENTID, 
            chatId: currentChat.id._serialized 
        });
    };

    return (
        <Container className="w-[76%] h-[77vh] bg-wa-colors-background relative">
            {
                currentChat && selectedChat ? (
                    <>
                        <div className="sticky top-0 flex flex-row justify-between items-center border-b w-full pb-1 text-center bg-wa-colors-background z-10">
                            <label className="w-full text-lg font-bold" htmlFor="">{currentChat?.name} {currentChat?.name ? " | " : ""} {convertJidToPhone(currentChat?.id.user || "")}</label>
                            {currentChat.archived && (
                                <button 
                                    onClick={handleUnarchiveChat}
                                    className="mr-4 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm flex items-center"
                                    title="Unarchive chat"
                                >
                                    <span>Unarchive</span>
                                </button>
                            )}
                        </div>
                        <div ref={scrollRef} onScroll={handleScroll} className="flex flex-col overflow-y-auto gap-1 p-2 min-h-[68vh]">
                            {
                                messages?.map((message: AppMessage, index) => {
                                    return <WAChatMessage key={message.id._serialized || index} message={message} />
                                })
                            }
                        </div>
                        {showScrollToBottom && (
                            <button onClick={scrollToBottom} className="absolute bottom-20 right-4 bg-wa-colors-primary text-white rounded-full p-2 shadow-lg">
                                <FaAngleDoubleDown size={20} />
                            </button>
                        )}
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
