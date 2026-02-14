export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING': return 'status-pending';
    case 'APPROVED': return 'status-approved';
    case 'REJECTED': return 'status-rejected';
    case 'CANCELLED': return 'status-cancelled';
    default: return '';
  }
};

export const getLeaveTypeClass = (type) => {
  switch (type) {
    case 'VACATION': return 'leave-type-vacation';
    case 'SICK': return 'leave-type-sick';
    case 'PERSONAL': return 'leave-type-personal';
    case 'MATERNITY': return 'leave-type-vacation';
    case 'PATERNITY': return 'leave-type-vacation';
    case 'BEREAVEMENT': return 'leave-type-sick';
    default: return '';
  }
};

export const formatLeaveType = (type) => {
  const typeMap = {
    'VACATION': 'Vacation',
    'SICK': 'Sick Leave',
    'PERSONAL': 'Personal',
    'MATERNITY': 'Maternity',
    'PATERNITY': 'Paternity',
    'BEREAVEMENT': 'Bereavement'
  };
  return typeMap[type] || type;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getAuthHeader = () => {
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};