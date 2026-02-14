import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'employee') {
      setEmail('employee@company.com');
      setPassword('employee123');
    } else if (role === 'manager') {
      setEmail('manager@company.com');
      setPassword('admin123');
    }
  };

  return (
    <>
      <h2 className="auth-title">Welcome Back</h2>
      <p className="text-muted text-center mb-4">Sign in to your account</p>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center mb-3">
          <span className="text-muted">Or try demo accounts:</span>
        </div>

        <div className="d-grid gap-2 mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => handleDemoLogin('employee')}
            disabled={loading}
          >
            Demo Employee
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => handleDemoLogin('manager')}
            disabled={loading}
          >
            Demo Manager
          </Button>
        </div>

        <div className="text-center">
          <p className="mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </Form>
    </>
  );
};

export default Login;