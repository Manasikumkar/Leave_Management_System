export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const formatLeaveType = (type) => {
  const map = {
    VACATION: 'Vacation',
    SICK: 'Sick Leave',
    PERSONAL: 'Personal',
    MATERNITY: 'Maternity',
    PATERNITY: 'Paternity',
    BEREAVEMENT: 'Bereavement'
  };
  return map[type] || type;
};

export const getStatusClass = (status) => {
  const map = {
    PENDING: 'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
    CANCELLED: 'badge-cancelled'
  };
  return `status-badge ${map[status] || ''}`;
};

export const getLeaveTypeClass = (type) => {
  const map = {
    VACATION: 'type-vacation',
    SICK: 'type-sick',
    PERSONAL: 'type-personal',
    MATERNITY: 'type-maternity',
    PATERNITY: 'type-paternity',
    BEREAVEMENT: 'type-bereavement'
  };
  return `type-badge ${map[type] || ''}`;
};
