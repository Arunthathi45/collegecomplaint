import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Navigation from './components/common/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ComplaintList from './components/complaints/ComplaintList';
import ComplaintForm from './components/complaints/ComplaintForm';
import ComplaintDetails from './components/complaints/ComplaintDetails';
import AdminPanel from './components/admin/AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Container className="mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/complaints" element={<PrivateRoute><ComplaintList /></PrivateRoute>} />
              <Route path="/complaints/new" element={<PrivateRoute><ComplaintForm /></PrivateRoute>} />
              <Route path="/complaints/:id" element={<PrivateRoute><ComplaintDetails /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route 
  path="/admin" 
  element={
    <PrivateRoute>
      <AdminPanel />
    </PrivateRoute>
  } 
/>
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;