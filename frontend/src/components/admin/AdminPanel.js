import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import UserManagement from './UserManagement';
import ComplaintManagement from './ComplaintManagement';
import Analytics from './Analytics';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Analytics />;
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Admin Panel</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'analytics'}
                    onClick={() => setActiveTab('analytics')}
                    className="rounded-0"
                  >
                    📊 Analytics
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'complaints'}
                    onClick={() => setActiveTab('complaints')}
                    className="rounded-0"
                  >
                    📝 Complaint Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                    className="rounded-0"
                  >
                    👥 User Management
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;