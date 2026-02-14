import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Badge, Alert, Modal, Form, 
  Card, Row, Col 
} from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  formatDate, 
  formatDateTime,
  getLeaveTypeClass,
  formatLeaveType 
} from '../../utils/helpers';

const PendingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getPendingLeaves();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      setError('Failed to load pending leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (leave) => {
    setSelectedLeave(leave);
    setComments('');
    setShowApproveModal(true);
  };

  const handleRejectClick = (leave) => {
    setSelectedLeave(leave);
    setComments('');
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      setProcessing(true);
      await leaveService.approveLeave(selectedLeave.id, comments);
      setShowApproveModal(false);
      setSelectedLeave(null);
      setComments('');
      fetchPendingLeaves(); // Refresh the list
    } catch (error) {
      console.error('Error approving leave:', error);
      setError('Failed to approve leave request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;

    try {
      setProcessing(true);
      await leaveService.rejectLeave(selectedLeave.id, comments);
      setShowRejectModal(false);
      setSelectedLeave(null);
      setComments('');
      fetchPendingLeaves(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting leave:', error);
      setError('Failed to reject leave request');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pending-leaves">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Pending Leave Requests</h1>
        <Button onClick={fetchPendingLeaves} variant="outline-primary">
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {leaves.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted mb-3">No pending leave requests</h4>
          <p className="text-muted">All leave requests have been processed</p>
        </div>
      ) : (
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body className="p-0">
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>
                          <div>
                            <strong>{leave.employeeName}</strong>
                            <br/>
                            <small className="text-muted">{leave.employeeId}</small>
                          </div>
                        </td>
                        <td>
                          <Badge className={getLeaveTypeClass(leave.leaveType)}>
                            {formatLeaveType(leave.leaveType)}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-nowrap">
                            {formatDate(leave.startDate)}<br/>
                            <small className="text-muted">to</small><br/>
                            {formatDate(leave.endDate)}
                          </div>
                        </td>
                        <td>
                          <strong>{leave.numberOfDays}</strong> days
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }} title={leave.reason}>
                            {leave.reason || '-'}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDateTime(leave.createdAt)}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveClick(leave)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectClick(leave)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <div className="mb-3">
                <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
                <p><strong>Type:</strong> {formatLeaveType(selectedLeave.leaveType)}</p>
                <p><strong>Dates:</strong> {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)}</p>
                <p><strong>Days:</strong> {selectedLeave.numberOfDays} days</p>
                <p><strong>Reason:</strong> {selectedLeave.reason || 'No reason provided'}</p>
              </div>
              
              <Form.Group>
                <Form.Label>Comments (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <Form.Text className="text-muted">
                  These comments will be visible to the employee
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowApproveModal(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleApprove}
            disabled={processing}
          >
            {processing ? 'Approving...' : 'Approve Leave'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <Alert variant="warning">
                <strong>Warning:</strong> This action cannot be undone. Please provide a reason for rejection.
              </Alert>
              
              <div className="mb-3">
                <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
                <p><strong>Type:</strong> {formatLeaveType(selectedLeave.leaveType)}</p>
                <p><strong>Dates:</strong> {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)}</p>
                <p><strong>Days:</strong> {selectedLeave.numberOfDays} days</p>
              </div>
              
              <Form.Group>
                <Form.Label>Reason for Rejection *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  This reason will be shared with the employee
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowRejectModal(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={processing || !comments.trim()}
          >
            {processing ? 'Rejecting...' : 'Reject Leave'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingLeaves;