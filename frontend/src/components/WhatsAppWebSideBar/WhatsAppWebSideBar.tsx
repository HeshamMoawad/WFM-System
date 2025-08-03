import { Dispatch, SetStateAction, FC, useState, MouseEvent, useEffect } from "react";
import Container from "../../layouts/Container/Container";
import { TbPlugConnectedX, TbWifi } from "react-icons/tb";
import WANumberCard from "../../components/WANumberCard/WANumberCard";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { AppChat } from "../../features/chats/chatSlice";
import { getSocket } from "../../services/socket";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";

interface WhatsAppWebSideBarProps {
    setRefresh: Dispatch<SetStateAction<boolean>>;
    setCurrentChat: (chat: AppChat | null) => void;
}

export const WhatsAppWebSideBar: FC<WhatsAppWebSideBarProps> = ({ setRefresh, setCurrentChat }) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chat: AppChat } | null>(null);
    const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);

    const { connected: isConnected } = useSelector((state: RootState) => state.socket);
    const { chats, contacts } = useSelector((state: RootState) => state.chats);
    const qrCode = useSelector((state: RootState) => state.qr.qrCode);

    const initializeClient = () => {
        const socket = getSocket();
        if (socket) {
            socket.emit('init', { phone: '+201554071240', name: 'Nabd' });
        }
    };

    const handleContextMenu = (event: MouseEvent, chat: AppChat) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, chat });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        window.addEventListener('click', handleCloseContextMenu);
        return () => {
            window.removeEventListener('click', handleCloseContextMenu);
        };
    }, []);

    const handleMuteToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.isMuted ? 'unmuteChat' : 'muteChat';
        socket.emit(event, { chatId: chat.id._serialized });
    };

    const handleReadToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.unreadCount > 0 ? 'markChatAsRead' : 'markChatAsUnread';
        socket.emit(event, { chatId: chat.id._serialized });
    };

    const handleBlockToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const contact = contacts.find(c => c.id._serialized === chat.id._serialized);
        if (!contact) return;
        const event = contact.isBlocked ? 'unblockContact' : 'blockContact';
        socket.emit(event, { contactId: contact.id._serialized });
    };

    return (
        <Container className="w-[28%] h-[77vh] bg-wa-colors-btns-colors-secondry">
            <div className="flex flex-row justify-between items-center border-b pb-1">
                <h1>WhatsApp Web Server</h1>
                {isConnected ? <TbWifi className="w-10 h-10 text-[green]" /> : <TbPlugConnectedX className="w-10 h-10 text-[red]" />}
            </div>

            <div className="flex gap-2">
                <button onClick={initializeClient} className="p-2 my-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600">
                    Initialize Client
                </button>
                <button onClick={() => setCreateGroupModalOpen(true)} className="p-2 my-2 w-full bg-green-500 text-white rounded hover:bg-green-600">
                    Create Group
                </button>
            </div>

            {qrCode && (
                <div className="p-2 flex flex-col items-center">
                    <p className="text-center mb-2">Scan QR Code to connect</p>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=200x200`} alt="QR Code" />
                </div>
            )}

            <div className="flex flex-col gap-1 overflow-y-auto h-fit p-2">
                {chats?.map((chat) => (
                    <div key={chat.id._serialized} onContextMenu={(e) => handleContextMenu(e, chat)}>
                        <WANumberCard
                            onClick={() => { setCurrentChat(chat); setRefresh(prev => !prev) }}
                            name={chat.name}
                            id={chat.id.user}
                            lastMessage={chat.lastMessage}
                            time={chat?.lastMessage?.timestamp?.toString() || ""} />
                    </div>
                ))}
            </div>

            {contextMenu && (
                <div style={{ top: contextMenu.y, left: contextMenu.x }} className="absolute bg-white shadow-lg rounded-md p-2 z-10">
                    <ul className="text-gray-700">
                        <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={() => handleMuteToggle(contextMenu.chat)}>{contextMenu.chat.isMuted ? 'Unmute' : 'Mute'}</li>
                        <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={() => handleReadToggle(contextMenu.chat)}>{contextMenu.chat.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread'}</li>
                        {!contextMenu.chat.isGroup && (
                            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={() => handleBlockToggle(contextMenu.chat)}>
                                {contacts.find(c => c.id._serialized === contextMenu.chat.id._serialized)?.isBlocked ? 'Unblock' : 'Block'}
                            </li>
                        )}
                    </ul>
                </div>
            )}
            {isCreateGroupModalOpen && (
                <CreateGroupModal
                    isOpen={isCreateGroupModalOpen}
                    onClose={() => setCreateGroupModalOpen(false)}
                    contacts={contacts.filter(c => !c.isMe && !c.isGroup)}
                />
            )}
        </Container>
    );
};


export default WhatsAppWebSideBar;
