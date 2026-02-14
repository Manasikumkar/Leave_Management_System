import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  formatDate, 
  getStatusClass, 
  formatLeaveType 
} from '../../utils/helpers';

const ManagerDashboard = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingData, allData] = await Promise.all([
        leaveService.getPendingLeaves(),
        leaveService.getAllLeaves()
      ]);
      
      setPendingLeaves(pendingData.slice(0, 5));
      
      // Calculate statistics
      const totalLeaves = allData.length;
      const approvedLeaves = allData.filter(l => l.status === 'APPROVED').length;
      const rejectedLeaves = allData.filter(l => l.status === 'REJECTED').length;
      const pendingCount = allData.filter(l => l.status === 'PENDING').length;
      
      setStats({
        totalLeaves,
        approvedLeaves,
        rejectedLeaves,
        pendingCount,
        approvalRate: totalLeaves > 0 ? Math.round((approvedLeaves / totalLeaves) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching manager dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manager-dashboard">
      <h1 className="mb-4">Manager Dashboard</h1>
      
      <div className="dashboard-stats mb-4">
        <Card className="stat-card">
          <div className="stat-value text-primary">{stats.pendingCount || 0}</div>
          <div className="stat-label">Pending Requests</div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-value text-success">{stats.approvedLeaves || 0}</div>
          <div className="stat-label">Approved</div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-value text-danger">{stats.rejectedLeaves || 0}</div>
          <div className="stat-label">Rejected</div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-value text-info">{stats.approvalRate || 0}%</div>
          <div className="stat-label">Approval Rate</div>
        </Card>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Leave Requests</h5>
              <Button as={Link} to="/manager/pending" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {pendingLeaves.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>
                          <strong>{leave.employeeName}</strong>
                        </td>
                        <td>{formatLeaveType(leave.leaveType)}</td>
                        <td>
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </td>
                        <td>
                          <Badge bg="primary">{leave.numberOfDays} days</Badge>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '150px' }}>
                            {leave.reason || '-'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              as={Link}
                              to={`/manager/pending/${leave.id}`}
                              variant="outline-success" 
                              size="sm"
                            >
                              Review
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No pending leave requests</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/manager/pending" variant="primary">
                  ⏳ Review Pending
                </Button>
                <Button as={Link} to="/manager/all" variant="outline-secondary">
                  📊 View All Leaves
                </Button>
                <Button as={Link} to="/dashboard" variant="outline-secondary">
                  👤 Employee View
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-list">
                {pendingLeaves.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="activity-item mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{leave.employeeName}</strong>
                      <Badge className={getStatusClass(leave.status)}>
                        {leave.status}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {formatLeaveType(leave.leaveType)} • {leave.numberOfDays} days
                    </small>
                    <div className="mt-1">
                      <small>{leave.reason?.substring(0, 50)}...</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;