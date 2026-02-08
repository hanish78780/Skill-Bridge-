const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProjectComments, addComment, deleteComment } = require('../controllers/commentController');

router.get('/project/:projectId', protect, getProjectComments);
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
