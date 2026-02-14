import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Badge, Alert, Form, Card, Row, Col, Button 
} from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  formatDate, 
  formatDateTime,
  getStatusClass, 
  getLeaveTypeClass,
  formatLeaveType 
} from '../../utils/helpers';

const AllLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'ALL',
    leaveType: 'ALL',
    search: ''
  });

  const filterLeaves = useCallback(() => {
    let filtered = [...leaves];

    // Filter by status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(leave => leave.status === filters.status);
    }

    // Filter by leave type
    if (filters.leaveType !== 'ALL') {
      filtered = filtered.filter(leave => leave.leaveType === filters.leaveType);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.employeeName.toLowerCase().includes(searchLower) ||
        leave.reason?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLeaves(filtered);
  }, [leaves, filters]);

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [filterLeaves]);

  const fetchAllLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaves();
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (error) {
      console.error('Error fetching all leaves:', error);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusStats = () => {
    const stats = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
      TOTAL: leaves.length
    };

    leaves.forEach(leave => {
      if (stats[leave.status] !== undefined) {
        stats[leave.status]++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const leaveTypeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'VACATION', label: 'Vacation' },
    { value: 'SICK', label: 'Sick Leave' },
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'MATERNITY', label: 'Maternity' },
    { value: 'PATERNITY', label: 'Paternity' },
    { value: 'BEREAVEMENT', label: 'Bereavement' }
  ];

  return (
    <div className="all-leaves">
      <h1 className="mb-4">All Leave Requests</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h3 className="text-primary">{stats.TOTAL}</h3>
              <p className="text-muted mb-0">Total Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h3 className="text-warning">{stats.PENDING}</h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h3 className="text-success">{stats.APPROVED}</h3>
              <p className="text-muted mb-0">Approved</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h3 className="text-danger">{stats.REJECTED}</h3>
              <p className="text-muted mb-0">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filters</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Leave Type</Form.Label>
                <Form.Select
                  name="leaveType"
                  value={filters.leaveType}
                  onChange={handleFilterChange}
                >
                  {leaveTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search by employee name or reason..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Leave Requests ({filteredLeaves.length})
          </h5>
          <Button onClick={fetchAllLeaves} variant="outline-primary" size="sm">
            Refresh
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No leave requests found matching your filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Manager</th>
                    <th>Comments</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <strong>{leave.employeeName}</strong>
                        <br/>
                        <small className="text-muted">ID: {leave.employeeId}</small>
                      </td>
                      <td>
                        <Badge className={getLeaveTypeClass(leave.leaveType)}>
                          {formatLeaveType(leave.leaveType)}
                        </Badge>
                      </td>
                      <td>
                        <div className="text-nowrap">
                          {formatDate(leave.startDate)}<br/>
                          <small>to</small><br/>
                          {formatDate(leave.endDate)}
                        </div>
                      </td>
                      <td>
                        <strong>{leave.numberOfDays}</strong>
                      </td>
                      <td>
                        <Badge className={getStatusClass(leave.status)}>
                          {leave.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={leave.reason}>
                          {leave.reason || '-'}
                        </div>
                      </td>
                      <td>
                        {leave.managerName || '-'}
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={leave.managerComments}>
                          {leave.managerComments || '-'}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDateTime(leave.createdAt)}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllLeaves;