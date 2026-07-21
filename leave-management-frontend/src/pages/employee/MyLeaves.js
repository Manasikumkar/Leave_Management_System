
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Alert, Modal } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDate, formatDateTime, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

// const MyLeaves = () => {
//   const [leaves, setLeaves]         = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState('');
//   const [selected, setSelected]     = useState(null);
//   const [cancelling, setCancelling] = useState(false);

//   const fetchLeaves = async () => {
//     try { setLoading(true); setLeaves(await leaveService.getMyLeaveRequests()); }
//     catch { setError('Failed to load leave requests'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchLeaves(); }, []);

//   const handleCancel = async () => {
//     try {
//       setCancelling(true);
//       await leaveService.cancelLeaveRequest(selected.id);
//       setSelected(null); fetchLeaves();
//     } catch { setError('Failed to cancel leave request'); }
//     finally { setCancelling(false); }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">My Leave Requests</h1><p className="page-subtitle">Track and manage all your leave requests</p></div>
//         <Link to="/leave/new" className="btn btn-primary">➕ New Request</Link>
//       </div>

//       {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

//       {leaves.length === 0 ? (
//         <div className="card"><div className="empty-state">
//           <div className="empty-state-icon">📭</div>
//           <h4>No leave requests yet</h4><p>Submit your first leave request to get started</p>
//           <Link to="/leave/new" className="btn btn-primary">Create Leave Request</Link>
//         </div></div>
//       ) : (
//         <div className="card">
//           <div className="card-header">
//             <span>All Requests ({leaves.length})</span>
//             <button className="btn btn-outline-secondary btn-sm" onClick={fetchLeaves}>↻ Refresh</button>
//           </div>
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Manager Comments</th><th>Submitted</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {leaves.map(l => (
//                   <tr key={l.id}>
//                     <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
//                     <td style={{ fontSize:'.8125rem', whiteSpace:'nowrap' }}>
//                       {formatDate(l.startDate)}<br/><span style={{ color:'#64748b' }}>→ {formatDate(l.endDate)}</span>
//                     </td>
//                     <td><strong style={{ color:'#00d4aa' }}>{l.numberOfDays}d</strong></td>
//                     <td style={{ maxWidth:'140px' }}><div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.8125rem' }} title={l.reason}>{l.reason || '—'}</div></td>
//                     <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
//                     <td style={{ maxWidth:'200px' }}>
//                       {l.managerComments ? (
//                         <div className="comments-bubble">
//                           <span className="comments-text">"{l.managerComments}"</span>
//                           {l.managerName && <span className="comments-by">— {l.managerName}</span>}
//                         </div>
//                       ) : <span style={{ color:'#475569', fontSize:'.8125rem', fontStyle:'italic' }}>{l.status === 'PENDING' ? 'Awaiting review' : 'No comments'}</span>}
//                     </td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b', whiteSpace:'nowrap' }}>{formatDateTime(l.createdAt)}</td>
//                     <td>
//                       <div style={{ display:'flex', gap:'6px' }}>
//                         <Link to={`/leaves/${l.id}`} className="btn btn-outline-primary btn-sm">View</Link>
//                         {l.status === 'PENDING' && <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(l)}>Cancel</button>}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <Modal show={!!selected} onHide={() => setSelected(null)} centered>
//         <Modal.Header closeButton><Modal.Title>Cancel Leave Request</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">This action cannot be undone.</Alert>
//           {selected && (
//             <div>
//               <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{formatLeaveType(selected.leaveType)}</span></div>
//               <div className="detail-row"><span className="detail-label">Dates</span><span className="detail-value">{formatDate(selected.startDate)} → {formatDate(selected.endDate)}</span></div>
//               <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value">{selected.numberOfDays}d</span></div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-outline-secondary" onClick={() => setSelected(null)} disabled={cancelling}>Keep It</button>
//           <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>{cancelling ? 'Cancelling…' : 'Yes, Cancel'}</button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default MyLeaves;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

const MyLeaves = () => {
  const [leaves, setLeaves]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [filter, setFilter]         = useState('ALL');

  const fetchLeaves = async () => {
    try { setLoading(true); setLeaves(await leaveService.getMyLeaveRequests()); }
    catch { setError('Failed to load leave requests'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleCancel = async () => {
    try { setCancelling(true); await leaveService.cancelLeaveRequest(selected.id); setSelected(null); fetchLeaves(); }
    catch { setError('Failed to cancel leave request'); }
    finally { setCancelling(false); }
  };

  const filtered = filter === 'ALL' ? leaves : leaves.filter(l => l.status === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">My Leave Requests</h1><p className="page-subtitle">Track all your leave history and status</p></div>
        <Link to="/leave/new" className="btn btn-coral">✏️ Apply Leave</Link>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {['ALL','PENDING','APPROVED','REJECTED','CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:'6px 16px', borderRadius:'20px', border:'1.5px solid',
            fontWeight:600, fontSize:'.8125rem', cursor:'pointer', transition:'all .15s',
            background: filter === s ? 'var(--primary)' : 'var(--surface)',
            color: filter === s ? '#fff' : 'var(--text-2)',
            borderColor: filter === s ? 'var(--primary)' : 'var(--border)',
          }}>
            {s === 'ALL' ? `All (${leaves.length})` : s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h4>No leave requests found</h4>
          <p>Submit your first leave request to get started</p>
          <Link to="/leave/new" className="btn btn-primary">Apply for Leave</Link>
        </div></div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span>Showing {filtered.length} request{filtered.length !== 1 ? 's' : ''}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={fetchLeaves}>↻ Refresh</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="table table-hover">
              <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>HR Comments</th><th>Applied On</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
                    <td style={{ fontSize:'.8125rem', whiteSpace:'nowrap' }}>{formatDate(l.startDate)}<br/><span style={{ color:'var(--text-3)' }}>→ {formatDate(l.endDate)}</span></td>
                    <td><strong style={{ color:'var(--primary)' }}>{l.numberOfDays}d</strong></td>
                    <td style={{ maxWidth:'140px' }}><div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.8125rem', color:'var(--text-2)' }} title={l.reason}>{l.reason || '—'}</div></td>
                    <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
                    <td style={{ maxWidth:'200px' }}>
                      {l.managerComments ? (
                        <div className="comments-bubble"><span className="comments-text">"{l.managerComments}"</span>{l.managerName && <span className="comments-by">— {l.managerName}</span>}</div>
                      ) : <span style={{ color:'var(--text-3)', fontSize:'.8125rem', fontStyle:'italic' }}>{l.status === 'PENDING' ? 'Awaiting review' : 'No comments'}</span>}
                    </td>
                    <td style={{ fontSize:'.75rem', color:'var(--text-3)', whiteSpace:'nowrap' }}>{formatDateTime(l.createdAt)}</td>
                    <td>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <Link to={`/leaves/${l.id}`} className="btn btn-outline-primary btn-sm">View</Link>
                        {l.status === 'PENDING' && <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(l)}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton><Modal.Title>Cancel Leave Request</Modal.Title></Modal.Header>
        <Modal.Body>
          <Alert variant="warning">This action cannot be undone.</Alert>
          {selected && (
            <div>
              <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{formatLeaveType(selected.leaveType)}</span></div>
              <div className="detail-row"><span className="detail-label">Dates</span><span className="detail-value">{formatDate(selected.startDate)} → {formatDate(selected.endDate)}</span></div>
              <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value">{selected.numberOfDays}d</span></div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={() => setSelected(null)} disabled={cancelling}>Keep It</button>
          <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>{cancelling ? 'Cancelling…' : 'Yes, Cancel'}</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default MyLeaves;


