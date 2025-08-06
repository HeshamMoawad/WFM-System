import { FC, MouseEvent } from 'react';
import { AppChat } from '../../features/chats/chatSlice';
import { Contact } from 'whatsapp-web.js';
import { BiSolidArchiveIn } from 'react-icons/bi';

interface ContextMenuProps {
    x: number;
    y: number;
    chat: AppChat;
    contacts: Contact[];
    onClose: () => void;
    onMuteToggle: (chat: AppChat) => void;
    onReadToggle: (chat: AppChat) => void;
    onBlockToggle: (chat: AppChat) => void;
    onPinToggle: (chat: AppChat) => void;
    onArchiveToggle: (chat: AppChat) => void;
}

const ContextMenu: FC<ContextMenuProps> = ({ x, y, chat, contacts, onMuteToggle, onReadToggle, onBlockToggle, onPinToggle, onArchiveToggle }) => {

    const handleAction = (action: (chat: AppChat) => void) => (e: MouseEvent) => {
        e.stopPropagation();
        action(chat);
    };

    return (
        <div style={{ top: y - 150, left: x  }} className="absolute bg-wa-colors-ui-background shadow-lg rounded-md p-2 z-50 w-48">
            <ul className="text-gray-300">
                <li className="cursor-pointer hover:bg-wa-colors-hover p-2 rounded-md" onClick={handleAction(onArchiveToggle)}>
                    <div className="flex items-center">
                        <BiSolidArchiveIn className="mr-2" />
                        {chat.archived ? 'Unarchive' : 'Archive'}
                    </div>
                </li>
                <li className="cursor-pointer hover:bg-wa-colors-hover p-2 rounded-md" onClick={handleAction(onMuteToggle)}>{chat.isMuted ? 'Unmute' : 'Mute'}</li>
                <li className="cursor-pointer hover:bg-wa-colors-hover p-2 rounded-md" onClick={handleAction(onPinToggle)}>{chat.pinned ? 'Unpin' : 'Pin'}</li>
                <li className="cursor-pointer hover:bg-wa-colors-hover p-2 rounded-md" onClick={handleAction(onReadToggle)}>{chat.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread'}</li>
                {!chat.isGroup && (
                    <li className="cursor-pointer hover:bg-wa-colors-hover p-2 rounded-md" onClick={handleAction(onBlockToggle)}>
                        {contacts.find(c => c.id._serialized === chat.id._serialized)?.isBlocked ? 'Unblock' : 'Block'}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ContextMenu;
