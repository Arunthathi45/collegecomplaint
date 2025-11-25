const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse
} = require('../controllers/complaintController');
const Complaint = require('../models/Complaint');

const router = express.Router();

router.post('/', auth, createComplaint);
router.get('/', auth, getComplaints);
router.get('/:id', auth, getComplaintById);
router.patch('/:id/status', auth, updateComplaintStatus);
router.post('/:id/responses', auth, addResponse);

// Admin only - assign complaint to staff
router.patch('/:id/assign', auth, roleCheck('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.staffId },
      { new: true }
    ).populate('assignedTo', 'name email department');

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;