const express = require('express');
const router = express.Router();
const {
    createRequest,
    getProjectRequests,
    updateRequestStatus,
    getMyRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/me', protect, getMyRequests);
router.get('/project/:projectId', protect, getProjectRequests);
router.put('/:id', protect, updateRequestStatus);

module.exports = router;
