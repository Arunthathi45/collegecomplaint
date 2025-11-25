import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate, getStatusVariant } from '../../utils/helpers';

const RecentComplaints = ({ complaints }) => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Recent Complaints</h5>
      </Card.Header>
      <Card.Body>
        {complaints.length > 0 ? (
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
              {complaints.map(complaint => (
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
          <p className="text-center text-muted">No complaints found.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentComplaints;