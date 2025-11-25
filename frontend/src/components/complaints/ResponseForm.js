import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const ResponseForm = ({ onSubmit, loading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Add Response</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your response here..."
          required
        />
      </Form.Group>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={loading || !message.trim()}
      >
        {loading ? 'Posting...' : 'Post Response'}
      </Button>
    </Form>
  );
};

export default ResponseForm;