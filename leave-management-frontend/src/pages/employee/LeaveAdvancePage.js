// import React, { useState, useEffect } from 'react';
// import { Form, Alert, Modal } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import { useAuth } from '../../contexts/AuthContext';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDateTime, getStatusClass } from '../../utils/helpers';

// const LeaveAdvancePage = () => {
//   const { user } = useAuth();
//   const [advances, setAdvances]     = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [showModal, setShowModal]   = useState(false);
//   const [form, setForm]             = useState({ advanceDaysRequested:'', reason:'' });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError]           = useState('');
//   const [success, setSuccess]       = useState('');

//   const fetchAdvances = async () => {
//     try { setAdvances(await leaveService.getMyAdvances()); }
//     catch { setError('Failed to load advances'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchAdvances(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setSuccess('');
//     if (!form.advanceDaysRequested || form.advanceDaysRequested < 1)
//       return setError('Enter at least 1 day');
//     setSubmitting(true);
//     try {
//       await leaveService.requestAdvance({
//         advanceDaysRequested: parseInt(form.advanceDaysRequested),
//         reason: form.reason
//       });
//       setSuccess('Advance request submitted! HR will review it shortly.');
//       setShowModal(false);
//       setForm({ advanceDaysRequested:'', reason:'' });
//       fetchAdvances();
//     } catch (err) { setError(err.message); }
//     finally { setSubmitting(false); }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">⏫ Leave Advance</h1>
//           <p className="page-subtitle">Request extra leave days in advance from HR</p>
//         </div>
//         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//           + Request Advance
//         </button>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       {/* Current Balance Info */}
//       <div style={{
//         background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)',
//         borderRadius:'14px', padding:'20px 24px', marginBottom:'20px',
//         display:'flex', alignItems:'center', gap:'24px'
//       }}>
//         <div style={{ textAlign:'center' }}>
//           <div style={{ fontSize:'2rem', fontWeight:800, color:'#00d4aa' }}>
//             {user?.remainingLeaveDays ?? 0}
//           </div>
//           <div style={{ fontSize:'.75rem', color:'#64748b' }}>Current Balance</div>
//         </div>
//         <div style={{ width:'1px', height:'50px', background:'rgba(255,255,255,.07)' }} />
//         <div style={{ fontSize:'.875rem', color:'#94a3b8', lineHeight:1.7 }}>
//           <strong style={{ color:'#f1f5f9' }}>How it works:</strong><br/>
//           Request advance days when your balance is low.
//           HR will review and approve — approved days are
//           added to your balance immediately.
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header">
//           My Advance Requests ({advances.length})
//         </div>
//         {advances.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon">⏫</div>
//             <h4>No advance requests yet</h4>
//             <p>Request extra leave days when your balance runs low</p>
//             <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//               Request Advance
//             </button>
//           </div>
//         ) : (
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead>
//                 <tr>
//                   <th>Days Requested</th>
//                   <th>Reason</th>
//                   <th>Status</th>
//                   <th>HR Comments</th>
//                   <th>Submitted</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {advances.map(a => (
//                   <tr key={a.id}>
//                     <td>
//                       <strong style={{ color:'#00d4aa', fontSize:'1.1rem' }}>
//                         {a.advanceDaysRequested}
//                       </strong>
//                       <span style={{ color:'#64748b', fontSize:'.8125rem' }}> days</span>
//                     </td>
//                     <td style={{ maxWidth:'200px', fontSize:'.8125rem', color:'#94a3b8' }}>
//                       {a.reason || '—'}
//                     </td>
//                     <td><span className={getStatusClass(a.status)}>{a.status}</span></td>
//                     <td style={{ maxWidth:'200px', fontSize:'.8125rem', color:'#94a3b8' }}>
//                       {a.reviewComments || '—'}
//                     </td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b', whiteSpace:'nowrap' }}>
//                       {formatDateTime(a.createdAt)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>⏫ Request Leave Advance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}

//           <div style={{
//             background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)',
//             borderRadius:'10px', padding:'12px 16px', marginBottom:'20px',
//             fontSize:'.875rem', color:'#94a3b8'
//           }}>
//             Your current balance: <strong style={{ color:'#00d4aa' }}>
//               {user?.remainingLeaveDays ?? 0} days
//             </strong>
//           </div>

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>How many days do you need?</Form.Label>
//               <Form.Control
//                 type="number" min="1"
//                 placeholder="e.g. 5"
//                 value={form.advanceDaysRequested}
//                 onChange={e => setForm(p => ({ ...p, advanceDaysRequested: e.target.value }))}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-4">
//               <Form.Label>Reason <span style={{ color:'#475569', fontWeight:400 }}>(optional)</span></Form.Label>
//               <Form.Control
//                 as="textarea" rows={3}
//                 placeholder="Briefly explain why you need advance leave days…"
//                 value={form.reason}
//                 onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
//               />
//             </Form.Group>

//             <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
//               <button type="button" className="btn btn-outline-secondary"
//                 onClick={() => setShowModal(false)}>Cancel</button>
//               <button type="submit" className="btn btn-primary"
//                 disabled={submitting} style={{ justifyContent:'center' }}>
//                 {submitting ? 'Submitting…' : '📤 Submit Request'}
//               </button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default LeaveAdvancePage;


import React, { useState, useEffect } from 'react';
import { Form, Alert, Modal } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, getStatusClass } from '../../utils/helpers';

const LeaveAdvancePage = () => {
  const { user } = useAuth();
  const [advances, setAdvances]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ advanceDaysRequested:'', reason:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  const fetch = async () => { try { setAdvances(await leaveService.getMyAdvances()); } catch { setError('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.advanceDaysRequested || form.advanceDaysRequested < 1) return setError('Enter at least 1 day');
    setSubmitting(true);
    try { await leaveService.requestAdvance({ advanceDaysRequested: parseInt(form.advanceDaysRequested), reason: form.reason }); setSuccess('Request submitted! HR will review shortly.'); setShowModal(false); setForm({ advanceDaysRequested:'', reason:'' }); fetch(); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">⏫ Leave Advance</h1><p className="page-subtitle">Request extra leave days in advance from HR</p></div><button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Request Advance</button></div>
      {error   && <Alert variant="danger"  dismissible onClose={()=>setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={()=>setSuccess('')}>{success}</Alert>}
      <div style={{background:'var(--primary-light)',border:'1px solid rgba(44,62,122,.12)',borderRadius:'14px',padding:'20px 24px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'24px'}}>
        <div style={{textAlign:'center'}}><div style={{fontSize:'2.5rem',fontWeight:800,color:'var(--primary)'}}>{user?.remainingLeaveDays??0}</div><div style={{fontSize:'.75rem',color:'var(--text-3)'}}>Current Balance</div></div>
        <div style={{width:'1px',height:'50px',background:'var(--border)'}}/>
        <div style={{fontSize:'.875rem',color:'var(--text-2)',lineHeight:1.7}}><strong style={{color:'var(--text-1)'}}>How it works:</strong><br/>Request advance days when your balance is low. HR reviews and approves — approved days are added to your balance immediately.</div>
      </div>
      <div className="card">
        <div className="card-header">My Advance Requests ({advances.length})</div>
        {advances.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">⏫</div><h4>No advance requests yet</h4><p>Request extra days when your balance runs low</p><button className="btn btn-primary" onClick={()=>setShowModal(true)}>Request Advance</button></div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="table table-hover">
              <thead><tr><th>Days Requested</th><th>Reason</th><th>Status</th><th>HR Comments</th><th>Submitted</th></tr></thead>
              <tbody>
                {advances.map(a=>(
                  <tr key={a.id}>
                    <td><strong style={{color:'var(--primary)',fontSize:'1.1rem'}}>{a.advanceDaysRequested}</strong><span style={{color:'var(--text-3)',fontSize:'.8125rem'}}> days</span></td>
                    <td style={{maxWidth:'200px',fontSize:'.8125rem',color:'var(--text-2)'}}>{a.reason||'—'}</td>
                    <td><span className={getStatusClass(a.status)}>{a.status}</span></td>
                    <td style={{maxWidth:'200px',fontSize:'.8125rem',color:'var(--text-2)'}}>{a.reviewComments||'—'}</td>
                    <td style={{fontSize:'.75rem',color:'var(--text-3)',whiteSpace:'nowrap'}}>{formatDateTime(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={()=>setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>⏫ Request Leave Advance</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <div style={{background:'var(--primary-light)',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',fontSize:'.875rem',color:'var(--primary)'}}>Your current balance: <strong>{user?.remainingLeaveDays??0} days</strong></div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>How many days do you need?</Form.Label><Form.Control type="number" min="1" placeholder="e.g. 5" value={form.advanceDaysRequested} onChange={e=>setForm(p=>({...p,advanceDaysRequested:e.target.value}))} required /></Form.Group>
            <Form.Group className="mb-4"><Form.Label>Reason <span style={{color:'var(--text-3)',fontWeight:400}}>(optional)</span></Form.Label><Form.Control as="textarea" rows={3} placeholder="Briefly explain why you need advance days…" value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))}/></Form.Group>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{justifyContent:'center'}}>{submitting?'Submitting…':'📤 Submit Request'}</button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default LeaveAdvancePage;

