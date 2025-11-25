import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/complaintService';

function ComplaintForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    priority: 'medium',
    department: 'infrastructure' // Default department for complaint
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await complaintService.createComplaint(formData);
      
      navigate('/complaints');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create complaint');
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Create New Complaint</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of the issue"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Detailed description of the problem..."
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
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
                  <Form.Text className="text-muted">
                    Select the department responsible for this complaint
                  </Form.Text>
                </Form.Group>

                <Button 
                  disabled={loading} 
                  className="w-100" 
                  type="submit"
                  variant="primary"
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ComplaintForm;