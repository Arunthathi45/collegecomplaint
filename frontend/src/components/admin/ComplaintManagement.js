import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Row, Col, Modal, Card } from 'react-bootstrap';
import { complaintService } from '../../services/complaintService';
import { userService } from '../../services/userService';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getComplaints();
      setComplaints(response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await userService.getStaff();
      setStaff(response);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleAssign = async (complaintId, staffId) => {
    try {
      await complaintService.assignComplaint(complaintId, staffId);
      setShowAssignModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error assigning complaint:', error);
    }
  };

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedStaff(complaint.assignedTo?._id || '');
    setShowAssignModal(true);
  };

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Complaint Management</h3>
      </div>

      <Card>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Title</th>
                <th>Created By</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td>
                    <strong>{complaint.title}</strong>
                  </td>
                  <td>{complaint.createdBy.name}</td>
                  <td>
                    <Badge bg="secondary">{complaint.category}</Badge>
                  </td>
                  <td>{complaint.department}</td>
                  <td>
                    <Badge bg={
                      complaint.status === 'pending' ? 'warning' :
                      complaint.status === 'in-progress' ? 'info' :
                      complaint.status === 'resolved' ? 'success' : 'danger'
                    }>
                      {complaint.status}
                    </Badge>
                  </td>
                  <td>
                    {complaint.assignedTo ? (
                      complaint.assignedTo.name
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openAssignModal(complaint)}
                    >
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Staff Member</Form.Label>
            <Form.Select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select staff member...</option>
              {staff.map(staffMember => (
                <option key={staffMember._id} value={staffMember._id}>
                  {staffMember.name} - {staffMember.department}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {selectedComplaint && (
            <div className="mt-3">
              <strong>Complaint:</strong> {selectedComplaint.title}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleAssign(selectedComplaint._id, selectedStaff)}
            disabled={!selectedStaff}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintManagement;