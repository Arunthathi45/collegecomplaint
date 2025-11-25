import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    studentId: '',
    staffId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Department options based on role
  const getDepartmentOptions = () => {
    if (formData.role === 'student') {
      return (
        <>
          <option value="computer-science">Computer Science</option>
          <option value="electrical">Electrical Engineering</option>
          <option value="mechanical">Mechanical Engineering</option>
          <option value="civil">Civil Engineering</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="mathematics">Mathematics</option>
        </>
      );
    } else if (formData.role === 'staff') {
      return (
        <>
          <option value="infrastructure">Infrastructure</option>
          <option value="hostel">Hostel</option>
          <option value="academic">Academic</option>
          <option value="library">Library</option>
          <option value="sports">Sports</option>
          <option value="canteen">Canteen</option>
          <option value="transport">Transport</option>
          <option value="administration">Administration</option>
        </>
      );
    } else if (formData.role === 'admin') {
      return (
        <>
          <option value="administration">Administration</option>
          <option value="management">Management</option>
        </>
      );
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!formData.department) {
      return setError('Please select a department');
    }

    try {
      setError('');
      setLoading(true);
      
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create account');
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Create Account</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {getDepartmentOptions()}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {formData.role === 'student' 
                      ? 'Select your academic department' 
                      : formData.role === 'staff'
                      ? 'Select your complaint department'
                      : 'Select administration department'}
                  </Form.Text>
                </Form.Group>

                {formData.role === 'student' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      placeholder="Enter your student ID"
                    />
                  </Form.Group>
                )}

                {(formData.role === 'staff' || formData.role === 'admin') && (
                  <Form.Group className="mb-3">
                    <Form.Label>{formData.role === 'admin' ? 'Admin' : 'Staff'} ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleChange}
                      required
                      placeholder={`Enter your ${formData.role} ID`}
                    />
                  </Form.Group>
                )}

                <Button 
                  disabled={loading} 
                  className="w-100" 
                  type="submit"
                >
                  Create Account
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Link to="/login">Already have an account? Log In</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;