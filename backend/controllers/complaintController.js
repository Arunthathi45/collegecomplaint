const Complaint = require('../models/Complaint');
const User = require('../models/User');

const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      createdBy: req.user.id
    });

    await complaint.save();
    await complaint.populate('createdBy', 'name email role department');
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'student') {
      filter.createdBy = req.user.id;
    } else if (req.user.role === 'staff') {
      filter.department = req.user.department;
    }

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email role department')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email role department')
      .populate('assignedTo', 'name email department')
      .populate('responses.user', 'name role department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'staff' && complaint.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'student' && complaint.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'staff' && complaint.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.status = req.body.status;
    
    if (req.body.status === 'resolved') {
      complaint.resolutionDetails = {
        resolvedBy: req.user.id,
        resolutionNote: req.body.resolutionNote,
        resolvedAt: new Date()
      };
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addResponse = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'staff' && complaint.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'student' && complaint.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.responses.push({
      user: req.user.id,
      message: req.body.message
    });

    await complaint.save();
    res.json(complaint.responses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse
};