import { FC } from "react";
import { Message } from "whatsapp-web.js";
import { AppChat } from "../../features/chats/chatSlice";

interface WANumberCardProps {
    chat: AppChat,
    onClick?: () => void
}

const parse20Char = (str:string | undefined | null) => {
    return str?.slice(0,20)
}

const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return "10:00 PM";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Today - show time
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } 
    // Yesterday
    else if (days === 1) {
      return "Yesterday";
    } 
    // Within a week - show day name
    else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } 
    // Older - show date
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
    
  export const WANumberCard: FC<WANumberCardProps> = ({ chat, onClick }) => {
    const calcUnreadCount = (unreadCount:number)=>{
        if(unreadCount > 99){
            return "99+";
        }else if (unreadCount === 0){
            return "";
        }else{
            return unreadCount;
        }
    }
    return (
      <div 
        className="bg-[#ffffff] hover:bg-[#f5f5f5] rounded-md cursor-pointer transition-all duration-100 ease-in-out border-b border-[#e5e7eb] last:border-b-0 hover:shadow-md active:bg-[#eeeeee]"
        onClick={onClick}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#cbd5e1] overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow duration-200">
              <img 
                className="w-full h-full object-cover" 
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                alt="Profile"
              />
            </div>
          </div>
  
          {/* Chat Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base font-medium text-[#0f172a] truncate pr-2">
                {chat.name || chat.id._serialized.replace('@c.us', '')}
              </h3>
              <span className="text-xs text-[#64748b] whitespace-nowrap ml-2 font-normal">
                {formatTime(chat?.timestamp)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#475569] truncate pr-2 flex-1">
                {parse20Char(chat.lastMessage?.body) || "No messages yet"}
              </p>
              
              {/* Unread Count Badge */}
              {chat.unreadCount > 0 ? (
                <div className="bg-[#10b981] hover:bg-[#059669] text-[#ffffff] rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium px-1.5 ml-2 shadow-sm transition-colors duration-200">
                  {calcUnreadCount(chat.unreadCount)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };
    



export default WANumberCard;
