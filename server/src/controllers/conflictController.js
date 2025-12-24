const conflictService = require('../services/conflictService');

exports.getTimetableReport = async (req, res) => {
    try {
        const timetableId = req.params.timetableId;
        const options = {};
        if (req.body && req.body.courseStudentCounts) options.courseStudentCounts = req.body.courseStudentCounts;
        if (req.body && req.body.reportUnknownCounts) options.reportUnknownCounts = !!req.body.reportUnknownCounts;
        if (req.body && req.body.workloadThresholdMinutes) options.workloadThresholdMinutes = req.body.workloadThresholdMinutes;

        const report = await conflictService.analyzeTimetable(timetableId, options);

        res.status(200).json({ success: true, data: { report } });
    } catch (error) {
        console.error('Get timetable report error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to generate timetable report' });
    }
};

exports.validateTimetable = async (req, res) => {
    try {
        const timetableId = req.params.timetableId;
        const options = {};
        if (req.body && req.body.courseStudentCounts) options.courseStudentCounts = req.body.courseStudentCounts;

        const result = await conflictService.validateTimetableForPublish(timetableId, options);

        if (!result.valid) {
            return res.status(400).json({ success: false, message: 'Validation failed', data: { report: result.report } });
        }

        res.status(200).json({ success: true, message: 'Timetable is valid for publishing', data: { report: result.report } });
    } catch (error) {
        console.error('Validate timetable error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to validate timetable' });
    }
};

exports.getLecturerWorkload = async (req, res) => {
    try {
        const lecturerId = req.params.lecturerId;
        const options = {};
        if (req.query.timetableId) options.timetableId = req.query.timetableId;
        if (req.query.thresholdMinutes) options.thresholdMinutes = parseInt(req.query.thresholdMinutes);

        // Lecturers may only view their own workload
        if (req.user.role === 'lecturer' && req.user._id.toString() !== lecturerId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const data = await conflictService.getLecturerWorkload(lecturerId, options);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Get lecturer workload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to compute lecturer workload' });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const timetableId = req.params.timetableId;
        const params = req.body || {};
        const options = {};
        if (req.body && req.body.limit) options.limit = req.body.limit;

        const suggestions = await conflictService.suggestSlots(timetableId, params, options);
        res.status(200).json({ success: true, count: suggestions.length, data: { suggestions } });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to generate suggestions' });
    }
};
