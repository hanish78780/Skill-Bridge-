
import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Real-time implementations
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    // Initialize Socket
    useEffect(() => {
        if (user) {
            const newSocket = io((import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', ''));
            setSocket(newSocket);

            newSocket.on('connect', () => {
                newSocket.emit('register_user', user._id);
            });

            return () => newSocket.close();
        }
    }, [user]);

    // Fetch Conversations
    const fetchConversations = async () => {
        try {
            const { data } = await axios.get('/chat');
            setConversations(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Load messages when currentChat changes
    useEffect(() => {
        if (currentChat) {
            fetchMessages(currentChat._id);
            if (socket) {
                socket.emit('join_room', currentChat._id);
            }
        }
    }, [currentChat, socket]);

    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/chat/${conversationId}`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Socket Listeners
    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                // If message belongs to current chat
                if (currentChat && message.conversationId === currentChat._id) {
                    setMessages((prev) => [...prev, message]);
                }

                // Update conversation list last message preview
                setConversations((prev) => prev.map(conv => {
                    if (conv._id === message.conversationId) {
                        return {
                            ...conv,
                            lastMessage: message.text,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return conv;
                }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            });

            socket.on('get_online_users', (users) => {
                setOnlineUsers(users);
            });

            socket.on('notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadNotificationsCount(prev => prev + 1);
                // Optional: Play sound
            });
        }
    }, [socket, currentChat]);

    const sendMessage = (text) => {
        if (!socket || !currentChat) return;

        const messageData = {
            conversationId: currentChat._id,
            sender: user._id,
            text: text
        };

        // Emit to server
        socket.emit('send_message', messageData);

        // Optimistically add to UI (optional, but socket emission usually echoes back)
        // If our backend logic emits to everyone in room including sender (using io.in or simple broadcast), it will duplicate if we add here. 
        // My backend uses `socket.to(room).emit` which EXCLUDES sender.
        // So I MUST add it here manually.

        // Wait, `socket.to(room)` excludes sender.
        // So I need to add it locally.
        const tempMsg = {
            ...messageData,
            _id: Date.now(), // Temp ID
            createdAt: new Date().toISOString(),
            sender: { _id: user._id, name: user.name, avatar: user.avatar } // Mock populated sender
        };

        setMessages((prev) => [...prev, tempMsg]);

        // Update conv list
        setConversations((prev) => prev.map(conv => {
            if (conv._id === currentChat._id) {
                return {
                    ...conv,
                    lastMessage: text,
                    updatedAt: new Date().toISOString()
                };
            }
            return conv;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    };

    const startChat = async (recipientId) => {
        try {
            const { data } = await axios.post('/chat', { recipientId });
            // Check if already in list
            if (!conversations.find(c => c._id === data._id)) {
                setConversations([data, ...conversations]);
            }
            setCurrentChat(data);
            return data;
        } catch (err) {
            console.error(err);
        }
    };

    const value = {
        socket,
        conversations,
        currentChat,
        messages,
        loading,
        fetchConversations,
        setCurrentChat,
        sendMessage,
        startChat,
        onlineUsers,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        setUnreadNotificationsCount
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
