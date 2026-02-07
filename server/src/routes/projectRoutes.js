const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    getRecommendedProjects,
    getDashboardStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { checkProjectRole } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, createProject);

router.get('/recommended', protect, getRecommendedProjects);
router.get('/stats', protect, getDashboardStats);

router.route('/:id')
    .get(getProject)
    .put(protect, checkProjectRole('owner'), updateProject)
    .delete(protect, checkProjectRole('owner'), deleteProject);

router.route('/:id/tasks')
    .post(protect, checkProjectRole('member'), addTask);

router.route('/:id/tasks/:taskId')
    .put(protect, checkProjectRole('member'), updateTask);

module.exports = router;
