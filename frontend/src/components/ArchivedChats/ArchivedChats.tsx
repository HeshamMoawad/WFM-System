import { FC, useState } from 'react';
import { AppChat } from '../../features/chats/chatSlice';
import { BiArchiveIn } from 'react-icons/bi';
import WANumberCard from '../WANumberCard/WANumberCard';

interface ArchivedChatsProps {
    archivedChats: AppChat[];
    setCurrentChat: (chat: AppChat | null) => void;
    setRefresh: (value: React.SetStateAction<boolean>) => void;
}

const ArchivedChats: FC<ArchivedChatsProps> = ({ archivedChats, setCurrentChat, setRefresh }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (archivedChats.length === 0) {
        return null;
    }

    return (
        <div>
            <div
                className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <BiArchiveIn className="w-6 h-6 mr-2" />
                <span>Archived</span>
            </div>
            {isExpanded && (
                <div className="flex flex-col gap-1 overflow-y-auto h-fit p-2">
                    {archivedChats.map((chat) => (
                        <div key={chat.id._serialized}>
                            <WANumberCard
                                onClick={() => { setCurrentChat(chat); setRefresh(prev => !prev) }}
                                chat={chat}
                                />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchivedChats;
