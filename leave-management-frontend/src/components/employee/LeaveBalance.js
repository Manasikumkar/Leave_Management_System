import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Alert } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../common/LoadingSpinner';

const LeaveBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getLeaveBalance();
      setBalance(data);
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      setError('Failed to load leave balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const usedPercentage = balance ? (balance.usedLeaveDays / balance.totalLeaveDays) * 100 : 0;
  const remainingPercentage = balance ? (balance.remainingLeaveDays / balance.totalLeaveDays) * 100 : 0;

  return (
    <div className="leave-balance">
      <h2 className="mb-4">Leave Balance</h2>
      
      <div className="row">
        <div className="col-md-8">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Balance Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Used Leave Days</span>
                  <span className="font-weight-bold">{balance?.usedLeaveDays} days</span>
                </div>
                <ProgressBar 
                  variant="warning" 
                  now={usedPercentage} 
                  label={`${usedPercentage.toFixed(1)}%`}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Remaining Leave Days</span>
                  <span className="font-weight-bold">{balance?.remainingLeaveDays} days</span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={remainingPercentage} 
                  label={`${remainingPercentage.toFixed(1)}%`}
                />
              </div>

              <div className="row text-center">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-primary mb-1">{balance?.totalLeaveDays}</h3>
                    <p className="text-muted mb-0">Total Days</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-warning mb-1">{balance?.usedLeaveDays}</h3>
                    <p className="text-muted mb-0">Used Days</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-success mb-1">{balance?.remainingLeaveDays}</h3>
                    <p className="text-muted mb-0">Remaining</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Leave Policy</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>Annual Leave:</strong> 20 days per year
                </li>
                <li className="mb-3">
                  <strong>Sick Leave:</strong> 12 days per year
                </li>
                <li className="mb-3">
                  <strong>Carry Forward:</strong> Up to 5 days
                </li>
                <li className="mb-3">
                  <strong>Notice Period:</strong> 3 days minimum
                </li>
                <li>
                  <strong>Approval:</strong> Manager approval required
                </li>
              </ul>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Tips</h5>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-info">
                <small>
                  <strong>Tip:</strong> Plan your leaves in advance to ensure availability.
                </small>
              </div>
              <div className="alert alert-info">
                <small>
                  <strong>Tip:</strong> Submit leave requests at least 3 working days before.
                </small>
              </div>
              <div className="alert alert-info">
                <small>
                  <strong>Tip:</strong> Check your balance before making new requests.
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;