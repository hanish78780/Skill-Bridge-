
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { startConversation, getConversations, getMessages } = require('../controllers/chatController');

router.use(protect);

router.post('/', startConversation);
router.get('/', getConversations);
router.get('/:conversationId', getMessages);

module.exports = router;
