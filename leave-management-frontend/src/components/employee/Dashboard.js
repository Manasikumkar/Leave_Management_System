import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  formatDate, 
  getStatusClass, 
  getLeaveTypeClass, 
  formatLeaveType 
} from '../../utils/helpers';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [balanceData, leavesData] = await Promise.all([
        leaveService.getLeaveBalance(),
        leaveService.getMyLeaveRequests()
      ]);
      setBalance(balanceData);
      setRecentLeaves(leavesData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value text-primary">
            {balance?.remainingLeaveDays || 0}
          </div>
          <div className="stat-label">Remaining Leave Days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value text-warning">
            {balance?.usedLeaveDays || 0}
          </div>
          <div className="stat-label">Used Leave Days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value text-info">
            {balance?.totalLeaveDays || 0}
          </div>
          <div className="stat-label">Total Leave Days</div>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Leave Requests</h5>
              <Button as={Link} to="/leave/new" variant="primary" size="sm">
                + New Request
              </Button>
            </Card.Header>
            <Card.Body>
              {recentLeaves.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>
                          <Badge className={getLeaveTypeClass(leave.leaveType)}>
                            {formatLeaveType(leave.leaveType)}
                          </Badge>
                        </td>
                        <td>
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </td>
                        <td>
                          <strong>{leave.numberOfDays}</strong> days
                        </td>
                        <td>
                          <Badge className={getStatusClass(leave.status)}>
                            {leave.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/leaves/${leave.id}`} 
                            variant="outline-primary" 
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No leave requests yet</p>
                  <Button as={Link} to="/leave/new" variant="primary">
                    Create Your First Leave Request
                  </Button>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-end">
              <Link to="/leaves" className="text-decoration-none">
                View All Leaves →
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/leave/new" variant="primary" size="lg">
                  📝 Request Leave
                </Button>
                <Button as={Link} to="/leaves" variant="outline-secondary">
                  📋 View My Leaves
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Leave Balance</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Used</span>
                  <span>{balance?.usedLeaveDays || 0} days</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{ 
                      width: `${balance ? (balance.usedLeaveDays / balance.totalLeaveDays * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Remaining</span>
                  <span>{balance?.remainingLeaveDays || 0} days</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ 
                      width: `${balance ? (balance.remainingLeaveDays / balance.totalLeaveDays * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>{balance?.totalLeaveDays || 0} days</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;