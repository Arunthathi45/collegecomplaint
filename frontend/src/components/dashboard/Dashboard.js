import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/complaintService';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching complaints for user:', user);
      const response = await complaintService.getComplaints();
      console.log('Complaints response:', response);
      
      const complaints = response.complaints || response || [];
      console.log('Complaints data:', complaints);

      let userStats = {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      };
      
      if (user.role === 'student') {
        // Students see only their complaints
        const myComplaints = complaints.filter(c => c.createdBy && c.createdBy._id === user._id);
        userStats = {
          total: myComplaints.length,
          pending: myComplaints.filter(c => c.status === 'pending').length,
          inProgress: myComplaints.filter(c => c.status === 'in-progress').length,
          resolved: myComplaints.filter(c => c.status === 'resolved').length
        };
        setRecentComplaints(myComplaints.slice(0, 5));
        
      } else if (user.role === 'staff') {
        // Staff see complaints in their department or assigned to them
        const staffComplaints = complaints.filter(c => 
          c.department === user.department || 
          (c.assignedTo && c.assignedTo._id === user._id)
        );
        userStats = {
          total: staffComplaints.length,
          pending: staffComplaints.filter(c => c.status === 'pending').length,
          inProgress: staffComplaints.filter(c => c.status === 'in-progress').length,
          resolved: staffComplaints.filter(c => c.status === 'resolved').length
        };
        setRecentComplaints(staffComplaints.slice(0, 5));
        
      } else if (user.role === 'admin') {
        // Admin sees all complaints
        userStats = {
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'pending').length,
          inProgress: complaints.filter(c => c.status === 'in-progress').length,
          resolved: complaints.filter(c => c.status === 'resolved').length
        };
        setRecentComplaints(complaints.slice(0, 5));
      }

      console.log('Calculated stats:', userStats);
      setStats(userStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set demo data for testing
      setStats({
        total: 3,
        pending: 1,
        inProgress: 1,
        resolved: 1
      });
      setRecentComplaints([]);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="text-center py-4">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <Alert variant="info">
        Welcome back, {user.name}! ({user.role})
        {user.department && ` - Department: ${user.department}`}
      </Alert>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <div className="stats-number text-primary">{stats.total}</div>
              <Card.Text>Total Complaints</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <div className="stats-number text-warning">{stats.pending}</div>
              <Card.Text>Pending</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <div className="stats-number text-info">{stats.inProgress}</div>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <div className="stats-number text-success">{stats.resolved}</div>
              <Card.Text>Resolved</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Complaints */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Complaints</h5>
        </Card.Header>
        <Card.Body>
          {recentComplaints.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td>
                      <Link to={`/complaints/${complaint._id}`}>
                        {complaint.title}
                      </Link>
                    </td>
                    <td>{complaint.category}</td>
                    <td>
                      <Badge bg={getStatusVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </td>
                    <td>{formatDate(complaint.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No complaints found.</p>
              {(user.role === 'student' || user.role === 'staff') && (
                <Link to="/complaints/new" className="btn btn-primary">
                  Create Your First Complaint
                </Link>
              )}
            </div>
          )}
          <div className="text-center">
            <Link to="/complaints" className="btn btn-outline-primary">
              View All Complaints
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;