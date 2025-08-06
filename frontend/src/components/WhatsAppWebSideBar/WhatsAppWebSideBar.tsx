import { Dispatch, SetStateAction, FC, useState, MouseEvent, useEffect } from "react";
import Container from "../../layouts/Container/Container";
import { TbPlugConnectedX, TbWifi } from "react-icons/tb";
import WANumberCard from "../../components/WANumberCard/WANumberCard";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { AppChat } from "../../features/chats/chatSlice";
import { getSocket } from "../../services/socket";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import ArchivedChats from "../ArchivedChats/ArchivedChats";
import { BsPinAngleFill } from "react-icons/bs";
import { GoMute } from "react-icons/go";
import ContextMenu from "../ContextMenu/ContextMenu";

interface WhatsAppWebSideBarProps {
    setRefresh: Dispatch<SetStateAction<boolean>>;
    setCurrentChat: (chat: AppChat | null) => void;
}

export const WhatsAppWebSideBar: FC<WhatsAppWebSideBarProps> = ({ setRefresh, setCurrentChat }) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chat: AppChat } | null>(null);
    const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);

    const { connected: isConnected, loggedInUser} = useSelector((state: RootState) => state.socket);
    const { chats, contacts } = useSelector((state: RootState) => state.chats);
    const qrCode = useSelector((state: RootState) => state.qr.qrCode);

    const archivedChats = chats.filter(c => c.archived);
    const unarchivedChats = chats
        .filter(c => !c.archived) // Only include non-archived chats
        .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (b.timestamp || 0) - (a.timestamp || 0);
        });

    const initializeClient = () => {
        const socket = getSocket();
        if (socket) {
            socket.emit('init', { phone: '+201554071240', name: 'Nabd' , uuid: JSON.parse(localStorage.getItem('Auth') || '{}')?.uuid });
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

    const handlePinToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.pinned ? 'unpinChat' : 'pinChat';
        socket.emit(event, { chatId: chat.id._serialized });
    };

    const handleArchiveToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.archived ? 'unarchiveChat' : 'archiveChat';
        socket.emit(event, { chatId: chat.id._serialized });
    };

    return (
        <Container className="relative w-[28%] h-[77vh] bg-wa-colors-btns-colors-secondry">
            <div className="flex flex-row justify-between items-center border-b pb-1">
                <h1>WhatsApp Web Server</h1>
                {isConnected ? <TbWifi className="w-10 h-10 text-[green]" /> : <TbPlugConnectedX className="w-10 h-10 text-[red]" />}
            </div>

            <div className="flex gap-2">
                {!loggedInUser && (
                    <button onClick={initializeClient} className="p-2 my-2 w-full bg-btns-colors-primary text-white rounded hover:bg-btns-colors-primary-hover">
                        Initialize Client
                    </button>
                )}
                {/* <button onClick={() => setCreateGroupModalOpen(true)} className="p-2 my-2 w-full bg-green-500 text-white rounded hover:bg-green-600">
                    Create Group
                </button> */}
            </div>

            {qrCode && (
                <div className="p-2 flex flex-col items-center">
                    <p className="text-center mb-2">Scan QR Code to connect</p>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=200x200`} alt="QR Code" />
                </div>
            )}

            <div className="flex flex-col gap-1 overflow-y-auto h-fit p-2">
                <ArchivedChats archivedChats={archivedChats} setCurrentChat={setCurrentChat} setRefresh={setRefresh} />
                {unarchivedChats?.map((chat) => (
                    <div key={chat.id._serialized} onContextMenu={(e) => handleContextMenu(e, chat)} className="relative">
                        <WANumberCard
                            onClick={() => { setCurrentChat(chat); setRefresh(prev => !prev) }}
                            name={chat.name}
                            id={chat.id.user}
                            lastMessage={chat.lastMessage}
                            time={chat?.lastMessage?.timestamp?.toString() || ""} />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                            {chat.pinned && <BsPinAngleFill className="text-gray-500" />}
                            {chat.isMuted && <GoMute className="text-gray-500" />}
                        </div>
                    </div>
                ))}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    chat={contextMenu.chat}
                    contacts={contacts}
                    onClose={handleCloseContextMenu}
                    onMuteToggle={handleMuteToggle}
                    onReadToggle={handleReadToggle}
                    onBlockToggle={handleBlockToggle}
                    onPinToggle={handlePinToggle}
                    onArchiveToggle={handleArchiveToggle}
                />
            )}
            {/* {isCreateGroupModalOpen && (
                <CreateGroupModal
                    isOpen={isCreateGroupModalOpen}
                    onClose={() => setCreateGroupModalOpen(false)}
                    contacts={contacts.filter(c => !c.isMe && !c.isGroup)}
                />
            )} */}
        </Container>
    );
};


export default WhatsAppWebSideBar;
