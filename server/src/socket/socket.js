
const { Server } = require('socket.io');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    // Track online users: userId -> socketId
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('register_user', (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('get_online_users', Array.from(onlineUsers.keys()));
            console.log(`User registered: ${userId}`);
        });

        socket.on('join_room', (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });

        socket.on('send_message', async (data) => {
            // data matches the Message model structure roughly
            // { conversationId, sender, text, authorName... }

            // Persist to DB asynchronously
            try {
                // Save message
                const newMessage = await Message.create({
                    conversationId: data.conversationId,
                    sender: data.sender, // User ID
                    text: data.text
                });

                // Update conversation last message
                await Conversation.findByIdAndUpdate(data.conversationId, {
                    lastMessage: data.text,
                    lastMessageDate: new Date(),
                    updatedAt: new Date()
                });

                // Emit to room
                // We emit the full message object including _id and timestamps from DB if possible, 
                // or just the data sent + timestamp. 
                // Better to return the DB object.
                // But to be fast, we might emit 'data' immediately. 
                // Let's emit the DB object to ensure consistency.
                const populatedMessage = await newMessage.populate('sender', 'name avatar');

                socket.to(data.conversationId).emit('receive_message', populatedMessage);


                // Send notification to other participants if they are online but not in the room?
                // For now, simple chat logic.

            } catch (err) {
                console.error("Error saving message:", err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
            // Remove user from onlineUsers
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('get_online_users', Array.from(onlineUsers.keys()));
                    break;
                }
            }
        });
    });

    // Helper to get socket ID by user ID
    io.getSocketId = (userId) => {
        return onlineUsers.get(userId);
    };

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = { initSocket, getIo };
