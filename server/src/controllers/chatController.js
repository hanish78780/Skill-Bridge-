
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Start or Get Conversation with a user
// @route   POST /api/chat
// @access  Private
exports.startConversation = async (req, res) => {
    const { recipientId } = req.body;

    if (!recipientId) {
        return res.status(400).json({ message: 'Recipient ID required' });
    }

    try {
        // Check if conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, recipientId] }
        }).populate('participants', 'name avatar title');

        if (conversation) {
            return res.status(200).json(conversation);
        }

        // Create new
        conversation = await Conversation.create({
            participants: [req.user.id, recipientId],
            lastMessage: 'Started conversation'
        });

        conversation = await conversation.populate('participants', 'name avatar title');

        res.status(201).json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's conversations
// @route   GET /api/chat
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user.id] }
        })
            .populate('participants', 'name avatar title')
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 }); // Oldest first for chat history

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Upload chat attachment
// @route   POST /api/chat/upload
// @access  Private
exports.uploadAttachment = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const attachments = req.files.map(file => ({
            url: file.path,
            fileType: file.mimetype.split('/')[0], // 'image', 'application', etc.
            originalName: file.originalname
        }));

        res.status(200).json(attachments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed' });
    }
};
