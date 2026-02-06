
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { startConversation, getConversations, getMessages, uploadAttachment } = require('../controllers/chatController');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.use(protect);

router.post('/', startConversation);
router.get('/', getConversations);
router.get('/:conversationId', getMessages);
router.post('/upload', upload.array('files', 5), uploadAttachment);

module.exports = router;
