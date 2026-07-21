

// import React, { useState, useEffect } from 'react';
// import { Alert, Modal, Form } from 'react-bootstrap';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDateTime, getStatusClass } from '../../utils/helpers';

// const HrAdvances = () => {
//   const [advances, setAdvances]     = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState('');
//   const [success, setSuccess]       = useState('');
//   const [modal, setModal]           = useState(null);
//   const [comments, setComments]     = useState('');
//   const [processing, setProcessing] = useState(false);
//   const [tab, setTab]               = useState('pending');

//   const fetchAll = async () => {
//     try { setAdvances(await hrService.getAllAdvances()); }
//     catch { setError('Failed to load advances'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchAll(); }, []);

//   const handleAction = async () => {
//     setProcessing(true);
//     try {
//       if (modal.action === 'approve') await hrService.approveAdvance(modal.advance.id, comments);
//       else await hrService.rejectAdvance(modal.advance.id, comments);
//       setSuccess(`Advance ${modal.action === 'approve' ? 'approved' : 'rejected'}`);
//       setModal(null); setComments(''); fetchAll();
//     } catch (err) { setError(err.message); }
//     finally { setProcessing(false); }
//   };

//   if (loading) return <LoadingSpinner />;
//   const pending = advances.filter(a => a.status === 'PENDING');
//   const display = tab === 'pending' ? pending : advances;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">⏫ Leave Advances</h1><p className="page-subtitle">Review and approve employee advance requests</p></div>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'20px' }}>
//         {[
//           { icon:'⏳', value:pending.length, label:'Pending', color:'orange' },
//           { icon:'✅', value:advances.filter(a=>a.status==='APPROVED').length, label:'Approved', color:'green' },
//           { icon:'❌', value:advances.filter(a=>a.status==='REJECTED').length, label:'Rejected', color:'red' },
//         ].map(s => (
//           <div key={s.label} className={`stat-card ${s.color}`}>
//             <div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div>
//             <div className={`stat-value ${s.color}`}>{s.value}</div>
//             <div className="stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div className="card">
//         <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
//           {[['pending',`Pending (${pending.length})`],['all',`All (${advances.length})`]].map(([t, label]) => (
//             <button key={t} onClick={() => setTab(t)} style={{ padding:'14px 20px', border:'none', background:'none', fontWeight:700, fontSize:'.875rem', color: tab===t ? '#00d4aa' : '#64748b', borderBottom: tab===t ? '2px solid #00d4aa' : '2px solid transparent', cursor:'pointer' }}>{label}</button>
//           ))}
//         </div>
//         {display.length === 0 ? (
//           <div className="empty-state"><div className="empty-state-icon">⏫</div><h4>No advance requests</h4></div>
//         ) : (
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead><tr><th>Employee</th><th>Days Requested</th><th>Reason</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {display.map(a => (
//                   <tr key={a.id}>
//                     <td><strong style={{ color:'#f1f5f9', fontSize:'.875rem' }}>{a.employeeName}</strong></td>
//                     <td><strong style={{ color:'#00d4aa', fontSize:'1.1rem' }}>{a.advanceDaysRequested}</strong><span style={{ color:'#64748b', fontSize:'.8125rem' }}> days</span></td>
//                     <td style={{ maxWidth:'200px', fontSize:'.8125rem', color:'#94a3b8' }}>{a.reason || '—'}</td>
//                     <td><span className={getStatusClass(a.status)}>{a.status}</span></td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b' }}>{formatDateTime(a.createdAt)}</td>
//                     <td>
//                       {a.status === 'PENDING' && (
//                         <div style={{ display:'flex', gap:'6px' }}>
//                           <button className="btn btn-success btn-sm" onClick={() => { setModal({ advance:a, action:'approve' }); setComments(''); }}>✅ Approve</button>
//                           <button className="btn btn-danger btn-sm"  onClick={() => { setModal({ advance:a, action:'reject'  }); setComments(''); }}>❌ Reject</button>
//                         </div>
//                       )}
//                       {a.status !== 'PENDING' && <span style={{ color:'#475569', fontSize:'.8125rem' }}>{a.reviewComments || '—'}</span>}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <Modal show={!!modal} onHide={() => setModal(null)} centered>
//         <Modal.Header closeButton><Modal.Title>{modal?.action === 'approve' ? '✅ Approve' : '❌ Reject'} Advance</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {modal?.action === 'approve' && <Alert variant="info" style={{ fontSize:'.875rem' }}>Approving will credit {modal.advance.advanceDaysRequested} days to employee's balance.</Alert>}
//           {modal && (
//             <div style={{ marginBottom:'16px' }}>
//               <div className="detail-row"><span className="detail-label">Employee</span><span className="detail-value">{modal.advance.employeeName}</span></div>
//               <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value" style={{ color:'#00d4aa' }}>{modal.advance.advanceDaysRequested}</span></div>
//               {modal.advance.reason && <div className="detail-row"><span className="detail-label">Reason</span><span className="detail-value" style={{ fontSize:'.8125rem' }}>{modal.advance.reason}</span></div>}
//             </div>
//           )}
//           <Form.Group><Form.Label>Comments <span style={{ color:'#475569', fontWeight:400 }}>(optional)</span></Form.Label>
//             <Form.Control as="textarea" rows={3} value={comments} onChange={e => setComments(e.target.value)} /></Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-outline-secondary" onClick={() => setModal(null)} disabled={processing}>Cancel</button>
//           <button className={`btn ${modal?.action === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={handleAction} disabled={processing} style={{ justifyContent:'center' }}>
//             {processing ? 'Processing…' : modal?.action === 'approve' ? '✅ Approve' : '❌ Reject'}
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HrAdvances;

import React, { useState, useEffect } from 'react';
import { Alert, Modal, Form } from 'react-bootstrap';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, getStatusClass } from '../../utils/helpers';
const HrAdvances = () => {
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('pending');
  const fetchAll = async () => { try { setAdvances(await hrService.getAllAdvances()); } catch { setError('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchAll(); }, []);
  const handleAction = async () => {
    setProcessing(true);
    try {
      if (modal.action==='approve') await hrService.approveAdvance(modal.advance.id, comments);
      else await hrService.rejectAdvance(modal.advance.id, comments);
      setSuccess(`Advance ${modal.action==='approve'?'approved':'rejected'}`);
      setModal(null); setComments(''); fetchAll();
    } catch (err) { setError(err.message); } finally { setProcessing(false); }
  };
  if (loading) return <LoadingSpinner />;
  const pending = advances.filter(a=>a.status==='PENDING');
  const display = tab==='pending'?pending:advances;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">⏫ Leave Advances</h1><p className="page-subtitle">Review and approve employee advance requests</p></div></div>
      {error && <Alert variant="danger" dismissible onClose={()=>setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={()=>setSuccess('')}>{success}</Alert>}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'20px' }}>
        {[{icon:'⏳',value:pending.length,label:'Pending',color:'orange'},{icon:'✅',value:advances.filter(a=>a.status==='APPROVED').length,label:'Approved',color:'green'},{icon:'❌',value:advances.filter(a=>a.status==='REJECTED').length,label:'Rejected',color:'red'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="card">
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
          {[['pending',`Pending (${pending.length})`],['all',`All (${advances.length})`]].map(([t,label])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'14px 20px', border:'none', background:'none', fontWeight:700, fontSize:'.875rem', color:tab===t?'var(--primary)':'var(--text-2)', borderBottom:tab===t?'2px solid var(--primary)':'2px solid transparent', cursor:'pointer' }}>{label}</button>
          ))}
        </div>
        {display.length===0?<div className="empty-state"><div className="empty-state-icon">⏫</div><h4>No advance requests</h4></div>:(
          <div style={{ overflowX:'auto' }}>
            <table className="table table-hover">
              <thead><tr><th>Employee</th><th>Days</th><th>Reason</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                {display.map(a=>(
                  <tr key={a.id}>
                    <td><strong style={{ color:'var(--text-1)', fontSize:'.875rem' }}>{a.employeeName}</strong></td>
                    <td><strong style={{ color:'var(--primary)', fontSize:'1.1rem' }}>{a.advanceDaysRequested}</strong><span style={{ color:'var(--text-3)', fontSize:'.8125rem' }}> days</span></td>
                    <td style={{ maxWidth:'200px', fontSize:'.8125rem', color:'var(--text-2)' }}>{a.reason||'—'}</td>
                    <td><span className={getStatusClass(a.status)}>{a.status}</span></td>
                    <td style={{ fontSize:'.75rem', color:'var(--text-3)' }}>{formatDateTime(a.createdAt)}</td>
                    <td>{a.status==='PENDING'&&<div style={{ display:'flex', gap:'6px' }}><button className="btn btn-success btn-sm" onClick={()=>{setModal({advance:a,action:'approve'});setComments('');}}>✅ Approve</button><button className="btn btn-danger btn-sm" onClick={()=>{setModal({advance:a,action:'reject'});setComments('');}}>❌ Reject</button></div>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal show={!!modal} onHide={()=>setModal(null)} centered>
        <Modal.Header closeButton><Modal.Title>{modal?.action==='approve'?'✅ Approve':'❌ Reject'} Advance</Modal.Title></Modal.Header>
        <Modal.Body>
          {modal?.action==='approve'&&<Alert variant="info" style={{ fontSize:'.875rem' }}>Approving will credit {modal.advance.advanceDaysRequested} days to employee's balance.</Alert>}
          {modal&&<div style={{ marginBottom:'16px' }}><div className="detail-row"><span className="detail-label">Employee</span><span className="detail-value">{modal.advance.employeeName}</span></div><div className="detail-row"><span className="detail-label">Days</span><span className="detail-value">{modal.advance.advanceDaysRequested}</span></div></div>}
          <Form.Group><Form.Label>Comments (optional)</Form.Label><Form.Control as="textarea" rows={3} value={comments} onChange={e=>setComments(e.target.value)}/></Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={()=>setModal(null)} disabled={processing}>Cancel</button>
          <button className={`btn ${modal?.action==='approve'?'btn-success':'btn-danger'}`} onClick={handleAction} disabled={processing} style={{ justifyContent:'center' }}>{processing?'Processing…':modal?.action==='approve'?'✅ Approve':'❌ Reject'}</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrAdvances;
