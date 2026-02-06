
import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, User, Paperclip, X, File } from 'lucide-react';
import axios from 'axios';

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
            <div className={`w-full md:w-1/3 border-r border-gray-100 dark:border-gray-700 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No conversations yet. Go to <a href="/talent" className="text-indigo-600 dark:text-indigo-400">Find Talent</a> to start chatting.
                        </div>
                    ) : (
                        conversations.map(chat => {
                            const recipient = getRecipient(chat);
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setCurrentChat(chat)}
                                    className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${currentChat?._id === chat._id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {recipient.avatar ? (
                                                    <img src={recipient.avatar} alt={recipient.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{recipient.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            {onlineUsers.includes(recipient._id) && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{recipient.name}</h3>
                                                <span className="text-xs text-gray-400 truncate ml-2">
                                                    {chat.updatedAt && new Date(chat.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${currentChat?._id === chat._id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {chat.lastMessage || 'Start a conversation'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`w-full md:w-2/3 flex flex-col ${!currentChat ? 'hidden md:flex' : 'flex'}`}>
                {currentChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800">
                            <button
                                className="md:hidden text-gray-500 dark:text-gray-400"
                                onClick={() => setCurrentChat(null)}
                            >
                                &larr; Back
                            </button>
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">
                                {getRecipient(currentChat).name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{getRecipient(currentChat).name}</h3>
                                {onlineUsers.includes(getRecipient(currentChat)._id) ? (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">Offline</p>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900">
                            {loading ? (
                                <div className="flex justify-center p-4">Loading messages...</div>
                            ) : (
                                <>
                                    {messages.map((msg, i) => {
                                        const isMyMessage = msg.sender._id === user._id || msg.sender === user._id; // Handle populated vs unpopulated
                                        return (
                                            <div
                                                key={i}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMyMessage
                                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                                                        }`}
                                                >
                                                    {/* Text Content */}
                                                    {msg.text && <p>{msg.text}</p>}

                                                    {/* Attachments */}
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="mt-2 space-y-2">
                                                            {msg.attachments.map((att, idx) => (
                                                                <div key={idx}>
                                                                    {att.fileType === 'image' ? (
                                                                        <img src={att.url} alt="attachment" className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(att.url, '_blank')} />
                                                                    ) : (
                                                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg ${isMyMessage ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'} transition-colors`}>
                                                                            <File className="h-4 w-4" />
                                                                            <span className="text-sm underline truncate">{att.originalName || 'Download File'}</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p className={`text-[10px] mt-1 text-right ${isMyMessage ? 'text-indigo-200' : 'text-gray-400'
                                                        }`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
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
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 bg-gray-50 dark:bg-gray-900">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                            <User className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-lg">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
