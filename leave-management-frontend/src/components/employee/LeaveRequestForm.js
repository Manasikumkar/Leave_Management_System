import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { LEAVE_TYPES } from '../../utils/constants';

const LeaveRequestForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    leaveType: 'VACATION',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(0);

  const fetchLeaveRequest = useCallback(async () => {
    try {
      setLoading(true);
      const data = await leaveService.getLeaveRequestById(id);
      setFormData({
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason || ''
      });
    } catch (error) {
      console.error('Error fetching leave request:', error);
      setError('Failed to load leave request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const calculateDays = useCallback(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(diffDays);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    if (isEdit) {
      fetchLeaveRequest();
    }
  }, [isEdit, fetchLeaveRequest]);

  useEffect(() => {
    calculateDays();
  }, [calculateDays]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    if (new Date(formData.startDate) < new Date()) {
      setError('Start date cannot be in the past');
      return false;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return false;
    }

    if (calculatedDays > (user?.remainingLeaveDays || 0)) {
      setError(`You only have ${user?.remainingLeaveDays || 0} days remaining. Requested: ${calculatedDays} days`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEdit) {
        // Update existing leave
        setSuccess('Leave request updated successfully!');
      } else {
        await leaveService.createLeaveRequest(formData);
        setSuccess('Leave request submitted successfully!');
      }
      
      setTimeout(() => {
        navigate('/leaves');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const leaveTypes = Object.entries(LEAVE_TYPES).map(([key, value]) => (
    <option key={key} value={key}>{value}</option>
  ));

  return (
    <div className="leave-request-form">
      <Card>
        <Card.Header>
          <h4 className="mb-0">{isEdit ? 'Edit Leave Request' : 'New Leave Request'}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                  >
                    {leaveTypes}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Calculated Days</Form.Label>
                  <div className="form-control bg-light">
                    <strong className="text-primary">{calculatedDays}</strong> days
                  </div>
                  <Form.Text className="text-muted">
                    Based on selected dates
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                name="reason"
                rows={4}
                placeholder="Enter reason for leave..."
                value={formData.reason}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Optional: Provide details about your leave request
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/leaves')}
              >
                Cancel
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : isEdit ? 'Update Request' : 'Submit Request'}
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="bg-light">
          <Row>
            <Col md={6}>
              <small className="text-muted">
                Remaining Leave Balance: <strong>{user?.remainingLeaveDays || 0} days</strong>
              </small>
            </Col>
            <Col md={6} className="text-end">
              <small className="text-muted">
                Total Leave Days: <strong>{user?.totalLeaveDays || 0} days</strong>
              </small>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LeaveRequestForm;