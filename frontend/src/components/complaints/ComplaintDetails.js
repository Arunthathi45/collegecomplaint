import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Button, Row, Col, Alert, Form, Modal } from 'react-bootstrap';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../contexts/AuthContext';
import ResponseForm from './ResponseForm';
import { formatDate, getStatusVariant, capitalizeFirst } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    status: '',
    resolutionNote: ''
  });

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const complaintData = await complaintService.getComplaintById(id);
      setComplaint(complaintData);
    } catch (error) {
      setError('Failed to load complaint details');
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async (message) => {
    try {
      const responses = await complaintService.addResponse(id, message);
      setComplaint(prev => ({ ...prev, responses }));
      fetchComplaint(); // Refresh to get populated user data
    } catch (error) {
      setError('Failed to add response');
      console.error('Error adding response:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await complaintService.updateStatus(id, statusData);
      setShowStatusModal(false);
      fetchComplaint();
    } catch (error) {
      setError('Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (status) => {
    setStatusData({ status, resolutionNote: '' });
    setShowStatusModal(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading complaint details..." />;
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate('/complaints')}>Back to Complaints</Button>
      </Container>
    );
  }

  if (!complaint) {
    return (
      <Container>
        <Alert variant="warning">Complaint not found</Alert>
        <Button onClick={() => navigate('/complaints')}>Back to Complaints</Button>
      </Container>
    );
  }

  const canUpdateStatus = user.role === 'staff' || user.role === 'admin';
  const canAddResponse = user.role !== 'student' || complaint.createdBy._id === user._id;

  return (
    <Container>
      <Button variant="outline-secondary" onClick={() => navigate('/complaints')} className="mb-3">
        ← Back to Complaints
      </Button>

      <Row>
        <Col lg={8}>
          {/* Complaint Details */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{complaint.title}</h4>
              <Badge bg={getStatusVariant(complaint.status)}>
                {capitalizeFirst(complaint.status)}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> 
                  <Badge bg="secondary" className="ms-2">{complaint.category}</Badge>
                </Col>
                <Col md={6}>
                  <strong>Priority:</strong> 
                  <Badge bg={
                    complaint.priority === 'high' ? 'danger' : 
                    complaint.priority === 'medium' ? 'warning' : 'secondary'
                  } className="ms-2">
                    {complaint.priority}
                  </Badge>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Department:</strong> {complaint.department}
                </Col>
                <Col md={6}>
                  <strong>Created by:</strong> {complaint.createdBy.name} ({complaint.createdBy.role})
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Created:</strong> {formatDate(complaint.createdAt)}
                </Col>
                <Col md={6}>
                  <strong>Last updated:</strong> {formatDate(complaint.updatedAt)}
                </Col>
              </Row>

              {complaint.assignedTo && (
                <Row className="mb-3">
                  <Col>
                    <strong>Assigned to:</strong> {complaint.assignedTo.name}
                  </Col>
                </Row>
              )}

              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-2">{complaint.description}</p>
              </div>

              {/* Status Update Buttons for Staff/Admin */}
              {canUpdateStatus && (
                <div className="mb-3">
                  <strong>Update Status:</strong>
                  <div className="mt-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openStatusModal('pending')}
                      disabled={complaint.status === 'pending'}
                    >
                      Mark Pending
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => openStatusModal('in-progress')}
                      disabled={complaint.status === 'in-progress'}
                    >
                      Mark In Progress
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                      onClick={() => openStatusModal('resolved')}
                      disabled={complaint.status === 'resolved'}
                    >
                      Resolve
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => openStatusModal('rejected')}
                      disabled={complaint.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              {/* Resolution Details */}
              {complaint.resolutionDetails && (
                <Alert variant="success">
                  <strong>Resolution Details:</strong>
                  <p className="mb-1">{complaint.resolutionDetails.resolutionNote}</p>
                  <small className="text-muted">
                    Resolved by {complaint.resolutionDetails.resolvedBy?.name} on{' '}
                    {formatDate(complaint.resolutionDetails.resolvedAt)}
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Responses */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Responses ({complaint.responses.length})</h5>
            </Card.Header>
            <Card.Body>
              {complaint.responses.length > 0 ? (
                complaint.responses.map((response, index) => (
                  <div 
                    key={index} 
                    className={`response-bubble ${
                      response.user.role === 'staff' ? 'staff' : 
                      response.user.role === 'admin' ? 'admin' : ''
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong>{response.user.name} ({response.user.role})</strong>
                      <small className="text-muted">
                        {formatDate(response.createdAt)}
                      </small>
                    </div>
                    <p className="mb-0">{response.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No responses yet.</p>
              )}

              {/* Add Response Form */}
              {canAddResponse && (
                <div className="mt-4">
                  <ResponseForm onSubmit={handleAddResponse} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">Quick Actions</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate('/complaints')}
                >
                  View All Complaints
                </Button>
                {user.role === 'student' && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/complaints/new')}
                  >
                    Create New Complaint
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Status Information */}
          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">Status Information</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <div className="d-flex align-items-center mb-2">
                  <Badge bg="warning" className="me-2">Pending</Badge>
                  <span>Complaint received, awaiting action</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Badge bg="info" className="me-2">In Progress</Badge>
                  <span>Working on the complaint</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Badge bg="success" className="me-2">Resolved</Badge>
                  <span>Complaint has been resolved</span>
                </div>
                <div className="d-flex align-items-center">
                  <Badge bg="danger" className="me-2">Rejected</Badge>
                  <span>Complaint cannot be processed</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Complaint Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Status</Form.Label>
            <Form.Control
              value={capitalizeFirst(statusData.status)}
              disabled
              className="mb-3"
            />
            {(statusData.status === 'resolved' || statusData.status === 'rejected') && (
              <Form.Group>
                <Form.Label>
                  {statusData.status === 'resolved' ? 'Resolution Note' : 'Rejection Reason'}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={statusData.resolutionNote}
                  onChange={(e) => setStatusData({...statusData, resolutionNote: e.target.value})}
                  placeholder={
                    statusData.status === 'resolved' 
                      ? 'Describe how the complaint was resolved...' 
                      : 'Explain why the complaint is being rejected...'
                  }
                />
              </Form.Group>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusUpdate}
            disabled={updating || (
              (statusData.status === 'resolved' || statusData.status === 'rejected') && 
              !statusData.resolutionNote
            )}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ComplaintDetails;