
import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Send, User } from 'lucide-react';

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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    // Helper to get other participant
    const getRecipient = (conversation) => {
        return conversation.participants.find(p => p._id !== user._id) || {};
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No conversations yet. Go to <a href="/talent" className="text-indigo-600">Find Talent</a> to start chatting.
                        </div>
                    ) : (
                        conversations.map(chat => {
                            const recipient = getRecipient(chat);
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setCurrentChat(chat)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${currentChat?._id === chat._id ? 'bg-indigo-50 border-indigo-100' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {recipient.avatar ? (
                                                    <img src={recipient.avatar} alt={recipient.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-500">{recipient.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            {onlineUsers.includes(recipient._id) && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-semibold text-gray-900 truncate">{recipient.name}</h3>
                                                <span className="text-xs text-gray-400">
                                                    {chat.updatedAt && new Date(chat.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${currentChat?._id === chat._id ? 'text-indigo-600' : 'text-gray-500'}`}>
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
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                            <button
                                className="md:hidden text-gray-500"
                                onClick={() => setCurrentChat(null)}
                            >
                                &larr; Back
                            </button>
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                                {getRecipient(currentChat).name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{getRecipient(currentChat).name}</h3>
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
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
                                                        : 'bg-white text-gray-800 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p>{msg.text}</p>
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
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <User className="h-12 w-12 text-gray-300" />
                        </div>
                        <p className="text-lg">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
