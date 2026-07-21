


// import React, { useState, useEffect } from 'react';
// import { Alert, Modal, Form } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDate, formatDateTime, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

// const PendingLeaves = () => {
//   const [leaves, setLeaves]       = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [error, setError]         = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [modal, setModal]         = useState(null);
//   const [comments, setComments]   = useState('');
//   const [processing, setProcessing] = useState(false);

//   const fetchLeaves = async () => {
//     try { setLoading(true); setLeaves(await leaveService.getPendingLeaves()); }
//     catch { setError('Failed to load pending requests'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchLeaves(); }, []);

//   const handleAction = async () => {
//     setProcessing(true); setError('');
//     try {
//       if (modal.action === 'approve') await leaveService.approveLeave(modal.leave.id, comments);
//       else await leaveService.rejectLeave(modal.leave.id, comments);
//       setSuccessMsg(`Leave ${modal.action === 'approve' ? 'approved' : 'rejected'} successfully`);
//       setModal(null); setComments(''); fetchLeaves();
//     } catch (err) { setError(err.message || 'Action failed'); }
//     finally { setProcessing(false); }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">⏳ Pending Leave Requests</h1>
//           <p className="page-subtitle">{leaves.length} request{leaves.length !== 1 ? 's' : ''} awaiting your review</p>
//         </div>
//         <button className="btn btn-outline-secondary" onClick={fetchLeaves}>↻ Refresh</button>
//       </div>

//       {error      && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

//       {leaves.length === 0 ? (
//         <div className="card"><div className="empty-state">
//           <div className="empty-state-icon">✅</div>
//           <h4>All caught up!</h4><p>No pending leave requests at the moment</p>
//         </div></div>
//       ) : (
//         <div className="card">
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Submitted</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {leaves.map(l => (
//                   <tr key={l.id}>
//                     <td>
//                       <div style={{ fontWeight:700, fontSize:'.875rem', color:'#f1f5f9' }}>{l.employeeName}</div>
//                       <div style={{ fontSize:'.75rem', color:'#475569' }}>ID: {l.employeeId}</div>
//                     </td>
//                     <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
//                     <td style={{ fontSize:'.8125rem', whiteSpace:'nowrap' }}>
//                       {formatDate(l.startDate)}<br/><span style={{ color:'#64748b' }}>→ {formatDate(l.endDate)}</span>
//                     </td>
//                     <td><strong style={{ color:'#00d4aa' }}>{l.numberOfDays}d</strong></td>
//                     <td style={{ maxWidth:'180px' }}><div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.8125rem' }} title={l.reason}>{l.reason || '—'}</div></td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b', whiteSpace:'nowrap' }}>{formatDateTime(l.createdAt)}</td>
//                     <td>
//                       <div style={{ display:'flex', gap:'6px' }}>
//                         <button className="btn btn-success btn-sm" onClick={() => { setModal({ leave:l, action:'approve' }); setComments(''); }}>✅ Approve</button>
//                         <button className="btn btn-danger btn-sm"  onClick={() => { setModal({ leave:l, action:'reject'  }); setComments(''); }}>❌ Reject</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <Modal show={!!modal} onHide={() => setModal(null)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{modal?.action === 'approve' ? '✅ Approve' : '❌ Reject'} Leave Request</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {modal?.action === 'reject' && <Alert variant="warning">Please provide a reason so the employee understands the decision.</Alert>}
//           {modal && (
//             <div style={{ marginBottom:'16px' }}>
//               <div className="detail-row"><span className="detail-label">Employee</span><span className="detail-value">{modal.leave.employeeName}</span></div>
//               <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{formatLeaveType(modal.leave.leaveType)}</span></div>
//               <div className="detail-row"><span className="detail-label">Dates</span><span className="detail-value">{formatDate(modal.leave.startDate)} → {formatDate(modal.leave.endDate)}</span></div>
//               <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value">{modal.leave.numberOfDays}d</span></div>
//             </div>
//           )}
//           <Form.Group>
//             <Form.Label>Comments {modal?.action === 'reject' ? '*' : '(Optional)'}</Form.Label>
//             <Form.Control as="textarea" rows={3} value={comments} onChange={e => setComments(e.target.value)}
//               placeholder={modal?.action === 'reject' ? 'Reason for rejection…' : 'Optional message to employee…'} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-outline-secondary" onClick={() => setModal(null)} disabled={processing}>Cancel</button>
//           <button className={`btn ${modal?.action === 'approve' ? 'btn-success' : 'btn-danger'}`}
//             onClick={handleAction} disabled={processing || (modal?.action === 'reject' && !comments.trim())}>
//             {processing ? 'Processing…' : modal?.action === 'approve' ? '✅ Approve' : '❌ Reject'}
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default PendingLeaves;


import React, { useState, useEffect } from 'react';
import { Alert, Modal, Form } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

const PendingLeaves = () => {
  const [leaves, setLeaves]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [modal, setModal]           = useState(null);
  const [comments, setComments]     = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchLeaves = async () => { try { setLoading(true); setLeaves(await leaveService.getPendingLeaves()); } catch { setError('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchLeaves(); }, []);

  const handleAction = async () => {
    setProcessing(true); setError('');
    try {
      if (modal.action==='approve') await leaveService.approveLeave(modal.leave.id, comments);
      else await leaveService.rejectLeave(modal.leave.id, comments);
      setSuccessMsg(`Leave ${modal.action==='approve'?'approved':'rejected'} successfully`);
      setModal(null); setComments(''); fetchLeaves();
    } catch (err) { setError(err.message||'Action failed'); }
    finally { setProcessing(false); }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">⏳ Pending Leave Requests</h1><p className="page-subtitle">{leaves.length} request{leaves.length!==1?'s':''} awaiting your review</p></div>
        <button className="btn btn-outline-secondary" onClick={fetchLeaves}>↻ Refresh</button>
      </div>
      {error      && <Alert variant="danger"  dismissible onClose={()=>setError('')}>{error}</Alert>}
      {successMsg && <Alert variant="success" dismissible onClose={()=>setSuccessMsg('')}>{successMsg}</Alert>}
      {leaves.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><h4>All caught up!</h4><p>No pending leave requests at the moment</p></div></div>
      ) : (
        <div className="card">
          <div style={{overflowX:'auto'}}>
            <table className="table table-hover">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                {leaves.map(l=>(
                  <tr key={l.id}>
                    <td><div style={{fontWeight:700,fontSize:'.875rem',color:'var(--text-1)'}}>{l.employeeName}</div><div style={{fontSize:'.75rem',color:'var(--text-3)'}}>ID: {l.employeeId}</div></td>
                    <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
                    <td style={{fontSize:'.8125rem',whiteSpace:'nowrap'}}>{formatDate(l.startDate)}<br/><span style={{color:'var(--text-3)'}}>→ {formatDate(l.endDate)}</span></td>
                    <td><strong style={{color:'var(--primary)'}}>{l.numberOfDays}d</strong></td>
                    <td style={{maxWidth:'180px'}}><div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'.8125rem',color:'var(--text-2)'}} title={l.reason}>{l.reason||'—'}</div></td>
                    <td style={{fontSize:'.75rem',color:'var(--text-3)',whiteSpace:'nowrap'}}>{formatDateTime(l.createdAt)}</td>
                    <td>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button className="btn btn-success btn-sm" onClick={()=>{setModal({leave:l,action:'approve'});setComments('');}}>✅ Approve</button>
                        <button className="btn btn-danger btn-sm"  onClick={()=>{setModal({leave:l,action:'reject'});setComments('');}}>❌ Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Modal show={!!modal} onHide={()=>setModal(null)} centered>
        <Modal.Header closeButton><Modal.Title>{modal?.action==='approve'?'✅ Approve':'❌ Reject'} Leave Request</Modal.Title></Modal.Header>
        <Modal.Body>
          {modal?.action==='reject' && <Alert variant="warning">Please provide a reason for rejection.</Alert>}
          {modal && (<div style={{marginBottom:'16px'}}>
            <div className="detail-row"><span className="detail-label">Employee</span><span className="detail-value">{modal.leave.employeeName}</span></div>
            <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{formatLeaveType(modal.leave.leaveType)}</span></div>
            <div className="detail-row"><span className="detail-label">Dates</span><span className="detail-value">{formatDate(modal.leave.startDate)} → {formatDate(modal.leave.endDate)}</span></div>
            <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value">{modal.leave.numberOfDays}d</span></div>
          </div>)}
          <Form.Group><Form.Label>Comments {modal?.action==='reject'?'*':'(Optional)'}</Form.Label><Form.Control as="textarea" rows={3} value={comments} onChange={e=>setComments(e.target.value)} placeholder={modal?.action==='reject'?'Reason for rejection…':'Optional message to employee…'}/></Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={()=>setModal(null)} disabled={processing}>Cancel</button>
          <button className={`btn ${modal?.action==='approve'?'btn-success':'btn-danger'}`} onClick={handleAction} disabled={processing||(modal?.action==='reject'&&!comments.trim())} style={{justifyContent:'center'}}>
            {processing?'Processing…':modal?.action==='approve'?'✅ Approve':'❌ Reject'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PendingLeaves;
