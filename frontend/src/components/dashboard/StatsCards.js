import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const StatsCards = ({ stats, userRole }) => {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center stats-card">
          <Card.Body>
            <div className="stats-number text-primary">{stats.total || 0}</div>
            <Card.Text>Total Complaints</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center stats-card">
          <Card.Body>
            <div className="stats-number text-warning">{stats.pending || 0}</div>
            <Card.Text>Pending</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      {(userRole === 'staff' || userRole === 'admin') && (
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <div className="stats-number text-info">{stats.inProgress || 0}</div>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )}
      <Col md={3}>
        <Card className="text-center stats-card">
          <Card.Body>
            <div className="stats-number text-success">{stats.resolved || 0}</div>
            <Card.Text>Resolved</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;