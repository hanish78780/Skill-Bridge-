const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addTask,
    updateTaskStatus,
    getRecommendedProjects,
    getDashboardStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, createProject);

router.get('/recommended', protect, getRecommendedProjects);
router.get('/stats', protect, getDashboardStats);

router.route('/:id')
    .get(getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

router.route('/:id/tasks')
    .post(protect, addTask);

router.route('/:id/tasks/:taskId')
    .put(protect, updateTaskStatus);

module.exports = router;
