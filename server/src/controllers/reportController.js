const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
    try {
        const { targetId, targetModel, reason, description } = req.body;

        const report = await Report.create({
            reporter: req.user.id,
            targetId,
            targetModel,
            reason,
            description
        });

        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        next(error);
    }
};

// @desc    Update report status (Resolve/Dismiss)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        report.adminNotes = adminNotes;
        report.resolvedBy = req.user.id;
        await report.save();

        // Log Admin Action
        await AdminLog.create({
            admin: req.user.id,
            action: 'RESOLVE_REPORT',
            targetId: report._id,
            targetModel: 'Report',
            details: { status, adminNotes },
            ipAddress: req.ip
        });

        res.json(report);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReport,
    getReports,
    updateReportStatus
};
