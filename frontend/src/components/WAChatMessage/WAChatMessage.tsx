import React, { FC } from "react";
import { MessageAck } from "whatsapp-web.js";
import { AppMessage } from "../../types/whatsapp";
import { TbCheck } from "react-icons/tb";
import { FaFileAlt, FaImage, FaVideo, FaMusic, FaStickyNote } from "react-icons/fa";
import { FaRegRectangleXmark, FaLocationDot } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";

interface WAChatMessageProps {
    message: AppMessage;
};

const QuotedMessage: FC<{ message: AppMessage }> = ({ message }) => {
    return (
        <div className="bg-black bg-opacity-20 p-2 rounded-lg mb-1 border-l-4 border-green-400">
            <p className="text-sm font-bold text-green-300">{message.author || message.from}</p>
            <p className="text-white text-opacity-80">{message.body.length > 100 ? `${message.body.substring(0, 100)}...` : message.body}</p>
        </div>
    );
};

const MediaMessage: FC<{ message: AppMessage }> = ({ message }) => {
    const extendedData = message._data || {};
    const mediaUrl = extendedData.deprecatedMms3Url || extendedData.mediaUrl;
    const caption = extendedData.caption || '';
    const mimeType = extendedData.mimetype || '';
    const [imageError, setImageError] = React.useState(false);
    
    // Handle different media types
    const renderMedia = () => {
        if (!mediaUrl) {
            return <div className="text-gray-400 italic">Media not available</div>;
        }

        if (mimeType.startsWith('image/')) {
            if (imageError) {
                return (
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
                            <p className="text-gray-400">Could not load image</p>
                            {caption && <p className="mt-2 text-white text-sm">{caption}</p>}
                        </div>
                    </div>
                );
            }

            return (
                <div className="relative">
                    <img 
                        src={mediaUrl} 
                        alt={caption || 'Image'} 
                        className="max-w-full max-h-96 rounded-lg object-contain"
                        onError={() => setImageError(true)}
                    />
                    {caption && <p className="mt-2 text-white text-sm">{caption}</p>}
                </div>
            );
        }

        if (mimeType.startsWith('video/')) {
            return (
                <div className="relative">
                    <video 
                        controls 
                        className="max-w-full max-h-96 rounded-lg"
                        src={mediaUrl}
                    >
                        Your browser does not support the video tag.
                    </video>
                    {caption && <p className="mt-2 text-white text-sm">{caption}</p>}
                </div>
            );
        }

        if (mimeType.startsWith('audio/')) {
            return (
                <div className="flex items-center gap-3 p-2">
                    <FaMusic className="w-8 h-8 text-gray-300" />
                    <audio 
                        controls 
                        src={mediaUrl}
                        className="flex-1"
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            );
        }

        // Document or other file type
        const filename = extendedData.filename || message.body || 'Document';
        const filesize = extendedData.size ? `${(extendedData.size / 1024).toFixed(2)} KB` : '';
        
        return (
            <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-black hover:bg-opacity-10 text-white"
                download
            >
                <FaFileAlt className="w-8 h-8 text-gray-300" />
                <div className="flex flex-col">
                    <p className="font-semibold">{filename}</p>
                    {filesize && <p className="text-sm text-gray-400">{filesize}</p>}
                    {caption && <p className="text-sm mt-1">{caption}</p>}
                </div>
            </a>
        );
    };

    return renderMedia();
};

const LocationMessage: FC<{ message: AppMessage }> = ({ message }) => {
    const location = message.location;
    if (!location) return null;
    
    const { latitude, longitude } = location;
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    return (
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="200"
                    className="rounded-lg border-0"
                    loading="lazy"
                    title="Location"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full">
                    <FaLocationDot className="w-5 h-5" />
                </div>
            </div>
            {message.body && <p className="mt-2 text-white text-sm">{message.body}</p>}
        </a>
    );
};

const StickerMessage: FC<{ message: AppMessage }> = ({ message }) => {
    const extendedData = message._data || {};
    const mediaUrl = extendedData.deprecatedMms3Url || extendedData.mediaUrl;
    const [error, setError] = React.useState(false);
    
    if (!mediaUrl || error) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <BsStars className="mx-auto text-gray-400 text-2xl mb-2" />
                    <p className="text-gray-400">Could not load sticker</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="relative">
            <img 
                src={mediaUrl} 
                alt="Sticker" 
                className="max-w-48 max-h-48 object-contain"
                onError={() => setError(true)}
            />
        </div>
    );
};

export const WAChatMessage: FC<WAChatMessageProps> = ({ message }) => {
    const { fromMe, body, ack } = message;

    // Using numerical values for MessageAck as per whatsapp-web.js
    const isRead = ack === 3; // MessageAck.READ
    const isDelivered = ack === 2; // MessageAck.DELIVERED
    const isSent = ack === 1; // MessageAck.SENT
    const isError = ack === -1; // MessageAck.ERROR
    const isPlayed = ack === 4; // MessageAck.PLAYED

    return (
        <div className={`flex flex-row gap-1 justify-end ${fromMe ? "" : "justify-start flex-row-reverse"}`}>
            <div className={`w-fit max-w-lg rounded-xl shadow-sm p-2 ${fromMe ? "bg-[#128c7e]" : "bg-[#075e54]"} ${isError ? "border border-red-500" : ""}`}>
                {message.hasQuotedMsg && message.quotedMsg && <QuotedMessage message={message.quotedMsg} />}
                {(() => {
                    switch (message.type) {
                        case 'image':
                        case 'video':
                        case 'audio':
                        case 'document':
                            return <MediaMessage message={message} />;
                        case 'location':
                            return <LocationMessage message={message} />;
                        case 'sticker':
                            return <StickerMessage message={message} />;
                        default:
                            return <p className="text-white whitespace-pre-wrap overflow-hidden">{body}</p>;
                    }
                })()}
                {message.mediaKey && !['image', 'video', 'audio', 'document', 'location', 'sticker'].includes(message.type) && (
                    <div className="mt-2 p-2 bg-black bg-opacity-20 rounded-lg flex items-center gap-2">
                        <IoDocumentText className="text-gray-300" />
                        <span className="text-gray-300 text-sm">Media message (unsupported type: {message.type})</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-around">
                {
                    fromMe === true  ? ( 
                        <>
                        {(isRead || isPlayed) && <><TbCheck className="-mb-3 w-fit h-fit text-blue-400" /><TbCheck className="-mt-3 w-fit h-fit text-blue-400" /></>}
                        {(isDelivered && (<><TbCheck className="-mb-3 w-fit h-fit" /><TbCheck className="-mt-3 w-fit h-fit" /></>))}
                        {(isSent && <TbCheck className="w-fit h-fit" />)}
                        {(isError && <FaRegRectangleXmark className="w-fit h-fit text-red-500" />)}
                        </>
                ) : null 
                }
            </div>
        </div>
    );
}

export default WAChatMessage