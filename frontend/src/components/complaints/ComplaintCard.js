import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ComplaintCard = ({ complaint }) => {
  const getStatusVariant = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'info',
      'resolved': 'success',
      'rejected': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="complaint-card mb-3">
      <Card.Body>
        <Row>
          <Col md={8}>
            <h5>
              <Link to={`/complaints/${complaint._id}`} className="text-decoration-none">
                {complaint.title}
              </Link>
            </h5>
            <p className="text-muted mb-2">{complaint.description}</p>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="secondary">{complaint.category}</Badge>
              <Badge bg={getStatusVariant(complaint.status)}>
                {complaint.status}
              </Badge>
              {complaint.priority === 'high' && (
                <Badge bg="danger">High Priority</Badge>
              )}
            </div>
          </Col>
          <Col md={4} className="text-end">
            <small className="text-muted">
              Created: {formatDate(complaint.createdAt)}
            </small>
            {complaint.assignedTo && (
              <div className="mt-2">
                <small>
                  <strong>Assigned to:</strong> {complaint.assignedTo.name}
                </small>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ComplaintCard;