import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  formatDate, 
  formatDateTime,
  getStatusClass, 
  getLeaveTypeClass,
  formatLeaveType 
} from '../../utils/helpers';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getMyLeaveRequests();
      console.log('Fetched leaves with comments:', data); // Debug log
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (leave) => {
    setSelectedLeave(leave);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedLeave) return;

    try {
      setCancelling(true);
      await leaveService.cancelLeaveRequest(selectedLeave.id);
      setShowCancelModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      console.error('Error cancelling leave:', error);
      setError('Failed to cancel leave request');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusActions = (leave) => {
    if (leave.status === 'PENDING') {
      return (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleCancelClick(leave)}
        >
          Cancel
        </Button>
      );
    }
    return null;
  };

  const getStatusBadge = (status) => (
    <Badge className={getStatusClass(status)}>
      {status}
    </Badge>
  );

  const getLeaveTypeBadge = (type) => (
    <Badge className={getLeaveTypeClass(type)}>
      {formatLeaveType(type)}
    </Badge>
  );

  // ✅ NEW: Function to render manager comments
  const renderManagerComments = (leave) => {
    if (leave.managerComments) {
      return (
        <div className="manager-comments">
          <div className="comments-bubble">
            <span className="comments-text">"{leave.managerComments}"</span>
            {leave.managerName && (
              <span className="manager-name">
                — {leave.managerName}
              </span>
            )}
          </div>
        </div>
      );
    }
    
    // Show different messages based on status
    if (leave.status === 'PENDING') {
      return <span className="text-muted">Awaiting review</span>;
    }
    if (leave.status === 'APPROVED' && !leave.managerComments) {
      return <span className="text-muted">Approved (no comments)</span>;
    }
    if (leave.status === 'REJECTED' && !leave.managerComments) {
      return <span className="text-muted">Rejected (no reason provided)</span>;
    }
    
    return <span className="text-muted">—</span>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-leaves">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Leave Requests</h1>
        <Button as={Link} to="/leave/new" variant="primary">
          + New Request
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {leaves.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted mb-3">No leave requests yet</h4>
          <p className="text-muted mb-4">Submit your first leave request to get started</p>
          <Button as={Link} to="/leave/new" variant="primary" size="lg">
            Create Leave Request
          </Button>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table responsive hover className="leave-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Manager Comments</th> {/* ✅ NEW COLUMN */}
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{getLeaveTypeBadge(leave.leaveType)}</td>
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
                      <div className="text-truncate" style={{ maxWidth: '150px' }} title={leave.reason}>
                        {leave.reason || '-'}
                      </div>
                    </td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td style={{ minWidth: '200px', maxWidth: '300px' }}>
                      {renderManagerComments(leave)}  {/* ✅ NEW: Display comments */}
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDateTime(leave.createdAt)}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          as={Link}
                          to={`/leaves/${leave.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View
                        </Button>
                        {getStatusActions(leave)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to cancel this leave request?
          </p>
          <div className="alert alert-warning">
            <strong>Details:</strong><br/>
            Type: {selectedLeave && formatLeaveType(selectedLeave.leaveType)}<br/>
            Dates: {selectedLeave && formatDate(selectedLeave.startDate)} to {selectedLeave && formatDate(selectedLeave.endDate)}<br/>
            Days: {selectedLeave && selectedLeave.numberOfDays} days
          </div>
          <p className="text-muted">
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCancelModal(false)}
            disabled={cancelling}
          >
            No, Keep It
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelConfirm}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel It'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ NEW: Add custom CSS for comments */}
      <style jsx="true">{`
        .leave-table td {
          vertical-align: middle;
        }
        
        .manager-comments {
          max-width: 250px;
        }
        
        .comments-bubble {
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 12px;
          border-left: 3px solid #6c757d;
          font-size: 0.9rem;
        }
        
        .comments-text {
          font-style: italic;
          color: #495057;
          display: block;
          margin-bottom: 2px;
          word-wrap: break-word;
        }
        
        .manager-name {
          font-size: 0.75rem;
          color: #6c757d;
          display: block;
          margin-top: 2px;
        }
        
        .text-muted {
          color: #adb5bd !important;
          font-style: italic;
        }
        
        .badge.bg-approved {
          background-color: #d4edda !important;
          color: #155724 !important;
        }
        
        .badge.bg-rejected {
          background-color: #f8d7da !important;
          color: #721c24 !important;
        }
        
        .badge.bg-pending {
          background-color: #fff3cd !important;
          color: #856404 !important;
        }
        
        .badge.bg-cancelled {
          background-color: #e2e3e5 !important;
          color: #383d41 !important;
        }
      `}</style>
    </div>
  );
};

export default MyLeaves;