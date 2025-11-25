import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate, getStatusVariant, capitalizeFirst } from '../../utils/helpers';

const ComplaintList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    department: '',
    priority: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Apply filters whenever filters or complaints change
  useEffect(() => {
    applyFilters();
  }, [filters, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getComplaints();
      setComplaints(response);
      setFilteredComplaints(response); // Initialize filtered complaints
    } catch (error) {
      setError('Failed to load complaints');
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(complaint => complaint.status === filters.status);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(complaint => complaint.category === filters.category);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(complaint => complaint.priority === filters.priority);
    }

    // Apply department filter (text search)
    if (filters.department) {
      filtered = filtered.filter(complaint => 
        complaint.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      department: '',
      priority: ''
    });
  };

  if (loading && complaints.length === 0) {
    return <LoadingSpinner text="Loading complaints..." />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Complaints</h2>
        {user.role === 'student' && (
          <Button 
            variant="primary" 
            href="/complaints/new"
          >
            + New Complaint
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-light p-3 rounded mb-4">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="hostel">Hostel</option>
                <option value="academic">Academic</option>
                <option value="library">Library</option>
                <option value="sports">Sports</option>
                <option value="canteen">Canteen</option>
                <option value="transport">Transport</option>
                <option value="administration">Administration</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                placeholder="Filter by department"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show filter results count */}
      <div className="mb-3">
        <small className="text-muted">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </small>
      </div>

      {/* Complaints List */}
      <div className="mb-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))
        ) : (
          <div className="text-center py-5">
            <h5 className="text-muted">No complaints found</h5>
            <p className="text-muted">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'No complaints available'
              }
            </p>
            {user.role === 'student' && (
              <Button variant="primary" href="/complaints/new">
                Create New Complaint
              </Button>
            )}
            {Object.values(filters).some(f => f) && (
              <Button variant="outline-secondary" onClick={clearFilters} className="ms-2">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

// ComplaintCard Component
const ComplaintCard = ({ complaint }) => {
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
            <div className="d-flex flex-wrap gap-2 mb-2">
              <Badge bg="secondary">{complaint.category}</Badge>
              <Badge bg={getStatusVariant(complaint.status)}>
                {capitalizeFirst(complaint.status)}
              </Badge>
              {complaint.priority === 'high' && (
                <Badge bg="danger">High Priority</Badge>
              )}
              {complaint.priority === 'medium' && (
                <Badge bg="warning">Medium Priority</Badge>
              )}
              {complaint.priority === 'low' && (
                <Badge bg="info">Low Priority</Badge>
              )}
            </div>
            <div className="small text-muted">
              <strong>Department:</strong> {complaint.department} • 
              <strong> Created:</strong> {formatDate(complaint.createdAt)}
            </div>
          </Col>
          <Col md={4} className="text-end">
            <div className="mb-2">
              <small className="text-muted">
                By: {complaint.createdBy.name}
              </small>
            </div>
            {complaint.assignedTo && (
              <div className="mb-2">
                <small>
                  <strong>Assigned to:</strong> {complaint.assignedTo.name}
                </small>
              </div>
            )}
            <Button 
              as={Link} 
              to={`/complaints/${complaint._id}`}
              variant="outline-primary" 
              size="sm"
            >
              View Details
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ComplaintList;