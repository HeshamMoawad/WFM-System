import { FC, useState, MouseEvent } from 'react';
import { AppChat } from '../../features/chats/chatSlice';
import { BiArchiveIn } from 'react-icons/bi';
import { getSocket } from '../../services/socket';
import { CLIENTID } from '../../utils/constants';
import WANumberCard from '../WANumberCard/WANumberCard';
import ContextMenu from '../ContextMenu/ContextMenu';
import { Contact } from 'whatsapp-web.js';

interface ArchivedChatsProps {
    archivedChats: AppChat[];
    setCurrentChat: (chat: AppChat | null) => void;
    setRefresh: (value: React.SetStateAction<boolean>) => void;
    contacts?: Contact[];
}

const ArchivedChats: FC<ArchivedChatsProps> = ({ archivedChats, setCurrentChat, setRefresh, contacts = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, chat: AppChat } | null>(null);

    if (archivedChats.length === 0) {
        return null;
    }

    const handleUnarchiveChat = (chatId: string) => {
        const socket = getSocket();
        if (!socket) return;
        
        // Emit unarchive event to the server
        socket.emit('unarchiveChat', { 
            clientId: CLIENTID, 
            chatId: chatId 
        });
        
        // Refresh the chat list to reflect changes
        setRefresh(prev => !prev);
    };

    const handleContextMenu = (event: MouseEvent, chat: AppChat) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, chat });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleArchiveToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        // For archived chats, this will unarchive
        socket.emit('unarchiveChat', { clientId: CLIENTID, chatId: chat.id._serialized });
        setRefresh(prev => !prev);
        handleCloseContextMenu();
    };

    const handleMuteToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.isMuted ? 'unmuteChat' : 'muteChat';
        socket.emit(event, { clientId: CLIENTID, chatId: chat.id._serialized });
        handleCloseContextMenu();
    };

    const handleReadToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.unreadCount > 0 ? 'markChatAsRead' : 'markChatAsUnread';
        socket.emit(event, { clientId: CLIENTID, chatId: chat.id._serialized });
        handleCloseContextMenu();
    };

    const handlePinToggle = (chat: AppChat) => {
        const socket = getSocket();
        if (!socket) return;
        const event = chat.pinned ? 'unpinChat' : 'pinChat';
        socket.emit(event, { clientId: CLIENTID, chatId: chat.id._serialized });
        handleCloseContextMenu();
    };

    return (
        <div>
            <div
                className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <BiArchiveIn className="w-6 h-6 mr-2" />
                <span>Archived ({archivedChats.length})</span>
            </div>
            {isExpanded && (
                <div className="flex flex-col gap-1 overflow-y-auto h-fit p-2">
                    {archivedChats.map((chat) => (
                        <div 
                            key={chat.id._serialized} 
                            className="relative"
                            onContextMenu={(e) => handleContextMenu(e, chat)}
                        >
                            <WANumberCard
                                onClickChat={(chat) => { setCurrentChat(chat); setRefresh(prev => !prev) }}
                                chat={chat}
                                />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnarchiveChat(chat.id._serialized);
                                }}
                                className="absolute top-1 right-8 text-sm bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
                                title="Unarchive chat"
                            >
                                <BiArchiveIn className="w-3 h-3 transform rotate-180" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    chat={contextMenu.chat}
                    contacts={contacts}
                    onClose={handleCloseContextMenu}
                    onMuteToggle={handleMuteToggle}
                    onReadToggle={handleReadToggle}
                    onBlockToggle={() => {}} // We can implement block toggle for archived chats if needed
                    onPinToggle={handlePinToggle}
                    onArchiveToggle={handleArchiveToggle}
                />
            )}
        </div>
    );
};

export default ArchivedChats;
