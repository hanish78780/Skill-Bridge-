
import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, User, Paperclip, X, File, MessageSquare } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../components/UI/EmptyState';

const Chat = () => {
    const { user } = useAuth();
    const {
        conversations,
        currentChat,
        messages,
        loading,
        fetchConversations,
        setCurrentChat,
        sendMessage,
        onlineUsers
    } = useChat();

    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFileSelect = (e) => {
        if (e.target.files) {
            setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return [];

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        const { data } = await axios.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data; // Array of { url, fileType, originalName }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() && selectedFiles.length === 0) return;

        setIsUploading(true);
        try {
            let attachments = [];
            if (selectedFiles.length > 0) {
                attachments = await uploadFiles();
            }

            sendMessage(newMessage, attachments);
            setNewMessage('');
            setSelectedFiles([]);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Helper to get other participant
    const getRecipient = (conversation) => {
        return conversation.participants.find(p => p._id !== user._id) || {};
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-1/3 border-r border-gray-100 dark:border-gray-700 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'} bg-white dark:bg-gray-800`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Messages</h2>
                    <div className="flex gap-2">
                        {/* Placeholder for future actions like 'New Message' */}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No conversations yet.</p>
                            <a href="/talent" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Find Talent</a>
                        </div>
                    ) : (
                        conversations.map(chat => {
                            const recipient = getRecipient(chat);
                            const isActive = currentChat?._id === chat._id;
                            // Mock unread count for now (can be real later)
                            const unreadCount = 0;

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setCurrentChat(chat)}
                                    className={`p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600 dark:border-l-indigo-400'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900 transition-all">
                                                {recipient.avatar ? (
                                                    <img src={recipient.avatar} alt={recipient.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{recipient.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            {onlineUsers.includes(recipient._id) && (
                                                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`font-semibold truncate ${isActive ? 'text-indigo-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                    {recipient.name}
                                                </h3>
                                                <span className={`text-xs whitespace-nowrap ml-2 ${isActive ? 'text-indigo-500 dark:text-indigo-300' : 'text-gray-400'}`}>
                                                    {chat.updatedAt && new Date(chat.updatedAt).getTime() > Date.now() - 86400000
                                                        ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : new Date(chat.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className={`text-sm truncate ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                                                    {chat.lastMessage || 'Start a conversation'}
                                                </p>
                                                {unreadCount > 0 && (
                                                    <span className="bg-indigo-600 text-white text-[10px] mobile:text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ml-2">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`w-full md:w-2/3 flex flex-col ${!currentChat ? 'hidden md:flex' : 'flex'} bg-slate-50 dark:bg-gray-900`}>
                {currentChat ? (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                            <div className="flex items-center gap-4">
                                <button
                                    className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    onClick={() => setCurrentChat(null)}
                                >
                                    &larr;
                                </button>
                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 overflow-hidden">
                                    {getRecipient(currentChat).avatar ? (
                                        <img src={getRecipient(currentChat).avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        getRecipient(currentChat).name?.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {getRecipient(currentChat).name}
                                    </h3>
                                    {onlineUsers.includes(getRecipient(currentChat)._id) ? (
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-500 rounded-full ring-2 ring-green-100 dark:ring-green-900"></span> Online
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">Offline</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors" title="View Profile">
                                    <User className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors" title="Shared Files">
                                    <Paperclip className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 custom-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, i) => {
                                        const isMyMessage = msg.sender._id === user._id || msg.sender === user._id;

                                        // Grouping Logic
                                        const prevMsg = messages[i - 1];
                                        const nextMsg = messages[i + 1];

                                        const isFirstInGroup = !prevMsg || (prevMsg.sender._id !== msg.sender._id && prevMsg.sender !== msg.sender);
                                        const isLastInGroup = !nextMsg || (nextMsg.sender._id !== msg.sender._id && nextMsg.sender !== msg.sender);

                                        // Time check for grouping (e.g., within 5 mins)
                                        const isCloseInTime = prevMsg && (new Date(msg.createdAt) - new Date(prevMsg.createdAt) < 5 * 60 * 1000);
                                        const shouldGroup = !isFirstInGroup && isCloseInTime;

                                        return (
                                            <div
                                                key={i}
                                                className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} ${shouldGroup ? 'mt-1' : 'mt-6'}`}
                                            >
                                                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] group relative ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>

                                                    {/* Avatar only for first message in group (recipient) */}
                                                    {!isMyMessage && (
                                                        <div className="w-8 flex-shrink-0">
                                                            {(isLastInGroup) ? (
                                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                                    {msg.sender.avatar ? (
                                                                        <img src={msg.sender.avatar} alt="" className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-500">
                                                                            {msg.sender.name?.[0]}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : <div className="w-8" />}
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`px-4 py-2.5 shadow-sm relative transition-all duration-200 
                                                        ${isMyMessage
                                                                ? `bg-indigo-600 text-white ${isFirstInGroup ? 'rounded-tr-2xl' : 'rounded-tr-md'} ${isLastInGroup ? 'rounded-br-2xl' : 'rounded-br-md'} rounded-l-2xl`
                                                                : `bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${isFirstInGroup ? 'rounded-tl-2xl' : 'rounded-tl-md'} ${isLastInGroup ? 'rounded-bl-2xl' : 'rounded-bl-md'} rounded-r-2xl`
                                                            } hover:shadow-md`}
                                                    >
                                                        {/* Text Content */}
                                                        {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                                                        {/* Attachments */}
                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className={`space-y-2 ${msg.text ? 'mt-3' : ''}`}>
                                                                {msg.attachments.map((att, idx) => (
                                                                    <div key={idx}>
                                                                        {att.fileType === 'image' ? (
                                                                            <img src={att.url} alt="attachment" className="rounded-lg max-h-60 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity" onClick={() => window.open(att.url, '_blank')} />
                                                                        ) : (
                                                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-lg ${isMyMessage ? 'bg-indigo-700/50 hover:bg-indigo-700' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} transition-colors`}>
                                                                                <div className={`p-2 rounded-lg ${isMyMessage ? 'bg-indigo-500' : 'bg-white dark:bg-gray-600'}`}>
                                                                                    <File className={`h-5 w-5 ${isMyMessage ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <span className="text-sm font-medium truncate block">{att.originalName || 'File Attachment'}</span>
                                                                                    <span className="text-xs opacity-70">Click to download</span>
                                                                                </div>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* Timestamp on hover */}
                                                    <span className={`text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 ${isMyMessage ? '-left-12' : '-right-12'} whitespace-nowrap`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                            {/* File Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                    {selectedFiles.map((file, i) => (
                                        <div key={i} className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg p-2 min-w-[80px] max-w-[120px] flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => removeFile(i)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <span className="text-xs truncate w-full text-center mt-1 dark:text-gray-300">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                                    title="Attach files"
                                >
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || isUploading}
                                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[3rem]"
                                >
                                    {isUploading ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center bg-gray-50 dark:bg-gray-900/50">
                        <EmptyState
                            icon={MessageSquare}
                            title="Start Chatting"
                            description="Select a conversation or find talent to message."
                            actionLabel="Find Talent"
                            actionLink="/talent"
                            className="border-0 bg-transparent shadow-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
