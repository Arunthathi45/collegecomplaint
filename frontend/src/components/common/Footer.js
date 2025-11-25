import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-3">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} College Complaint System. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;