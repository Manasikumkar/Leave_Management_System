

// import React, { useState, useEffect } from 'react';
// import { Form, Alert, Modal } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDateTime, getStatusClass } from '../../utils/helpers';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';

// const LeaveDonationPage = () => {
//   const { user } = useAuth();
//   const [sent, setSent]             = useState([]);
//   const [received, setReceived]     = useState([]);
//   const [employees, setEmployees]   = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [showModal, setShowModal]   = useState(false);
//   const [form, setForm]             = useState({ recipientId:'', daysDonated:'', reason:'' });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError]           = useState('');
//   const [success, setSuccess]       = useState('');
//   const [tab, setTab]               = useState('sent');

//   const fetchData = async () => {
//     try {
//       const [s, r, empList] = await Promise.all([
//         leaveService.getMyDonationsSent(),
//         leaveService.getMyDonationsReceived(),
//         // Use /users/all — accessible by ALL authenticated users
//         api.get('/users/all').then(res => res.data)
//       ]);
//       setSent(s);
//       setReceived(r);
//       setEmployees(empList);
//     } catch (err) {
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setSuccess('');
//     if (!form.recipientId) return setError('Please select a recipient');
//     if (!form.daysDonated || form.daysDonated < 1) return setError('Enter at least 1 day');
//     setSubmitting(true);
//     try {
//       await leaveService.donateLeave({
//         recipientId: parseInt(form.recipientId),
//         daysDonated: parseInt(form.daysDonated),
//         reason: form.reason
//       });
//       setSuccess('Donation submitted! Pending HR approval.');
//       setShowModal(false);
//       setForm({ recipientId:'', daysDonated:'', reason:'' });
//       fetchData();
//     } catch (err) { setError(err.message); }
//     finally { setSubmitting(false); }
//   };

//   if (loading) return <LoadingSpinner />;

//   const display = tab === 'sent' ? sent : received;

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">🤝 Leave Donation</h1>
//           <p className="page-subtitle">Donate your leave days to a colleague in need</p>
//         </div>
//         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//           + Donate Leave
//         </button>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       <div className="card">
//         <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
//           {[
//             ['sent',     `📤 Sent (${sent.length})`],
//             ['received', `📥 Received (${received.length})`]
//           ].map(([t, label]) => (
//             <button key={t} onClick={() => setTab(t)} style={{
//               padding:'14px 20px', border:'none', background:'none',
//               fontWeight:700, fontSize:'.875rem',
//               color: tab === t ? '#00d4aa' : '#64748b',
//               borderBottom: tab === t ? '2px solid #00d4aa' : '2px solid transparent',
//               cursor:'pointer', transition:'all .15s'
//             }}>{label}</button>
//           ))}
//         </div>

//         {display.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-state-icon">🤝</div>
//             <h4>No {tab} donations yet</h4>
//           </div>
//         ) : (
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead>
//                 <tr>
//                   <th>{tab === 'sent' ? 'Recipient' : 'Donor'}</th>
//                   <th>Days</th><th>Reason</th><th>Status</th><th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {display.map(d => (
//                   <tr key={d.id}>
//                     <td>
//                       <strong style={{ color:'#f1f5f9', fontSize:'.875rem' }}>
//                         {tab === 'sent' ? d.recipientName : d.donorName}
//                       </strong>
//                     </td>
//                     <td><strong style={{ color:'#00d4aa', fontSize:'1.1rem' }}>{d.daysDonated}</strong></td>
//                     <td style={{ maxWidth:'180px', fontSize:'.8125rem', color:'#94a3b8' }}>
//                       {d.reason || '—'}
//                     </td>
//                     <td><span className={getStatusClass(d.status)}>{d.status}</span></td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b' }}>
//                       {formatDateTime(d.createdAt)}
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
//           <Modal.Title>🤝 Donate Leave Days</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}

//           <Alert variant="info" style={{ fontSize:'.875rem' }}>
//             Donation requires HR approval before days are transferred.
//           </Alert>

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Select Recipient</Form.Label>
//               <Form.Select
//                 value={form.recipientId}
//                 onChange={e => setForm(p => ({ ...p, recipientId: e.target.value }))}
//                 required
//               >
//                 <option value="">-- Select a colleague --</option>
//                 {employees.map(emp => (
//                   <option key={emp.id} value={emp.id}>
//                     {emp.firstName} {emp.lastName} — {emp.email}
//                   </option>
//                 ))}
//               </Form.Select>
//               {employees.length === 0 && (
//                 <Form.Text style={{ color:'#ef4444' }}>
//                   No other employees found in the system.
//                 </Form.Text>
//               )}
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Days to Donate</Form.Label>
//               <Form.Control
//                 type="number" min="1"
//                 placeholder="e.g. 3"
//                 value={form.daysDonated}
//                 onChange={e => setForm(p => ({ ...p, daysDonated: e.target.value }))}
//                 required
//               />
//               <Form.Text style={{ color:'#64748b' }}>
//                 Your current balance:{' '}
//                 <strong style={{ color:'#00d4aa' }}>
//                   {user?.remainingLeaveDays ?? 0} days
//                 </strong>
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-4">
//               <Form.Label>
//                 Reason{' '}
//                 <span style={{ color:'#475569', fontWeight:400 }}>(optional)</span>
//               </Form.Label>
//               <Form.Control
//                 as="textarea" rows={3}
//                 placeholder="Why are you donating?"
//                 value={form.reason}
//                 onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
//               />
//             </Form.Group>

//             <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
//               <button type="button" className="btn btn-outline-secondary"
//                 onClick={() => setShowModal(false)}>Cancel</button>
//               <button type="submit" className="btn btn-primary"
//                 disabled={submitting} style={{ justifyContent:'center' }}>
//                 {submitting ? 'Submitting…' : '🤝 Donate'}
//               </button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default LeaveDonationPage;


import React, { useState, useEffect } from 'react';
import { Form, Alert, Modal } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, getStatusClass } from '../../utils/helpers';
import api from '../../services/api';

const LeaveDonationPage = () => {
  const { user } = useAuth();
  const [sent, setSent]             = useState([]);
  const [received, setReceived]     = useState([]);
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ recipientId:'', daysDonated:'', reason:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [tab, setTab]               = useState('sent');

  const fetchData = async () => {
    try {
      const [s, r, empList] = await Promise.all([leaveService.getMyDonationsSent(), leaveService.getMyDonationsReceived(), api.get('/users/all').then(res=>res.data)]);
      setSent(s); setReceived(r); setEmployees(empList);
    } catch { setError('Failed to load data'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.recipientId) return setError('Please select a recipient');
    if (!form.daysDonated || form.daysDonated < 1) return setError('Enter at least 1 day');
    setSubmitting(true);
    try { await leaveService.donateLeave({ recipientId:parseInt(form.recipientId), daysDonated:parseInt(form.daysDonated), reason:form.reason }); setSuccess('Donation submitted! Pending HR approval.'); setShowModal(false); setForm({ recipientId:'', daysDonated:'', reason:'' }); fetchData(); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;
  const display = tab === 'sent' ? sent : received;

  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">🤝 Leave Donation</h1><p className="page-subtitle">Donate your leave days to a colleague in need</p></div><button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Donate Leave</button></div>
      {error   && <Alert variant="danger"  dismissible onClose={()=>setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={()=>setSuccess('')}>{success}</Alert>}
      <div className="card">
        <div style={{display:'flex',borderBottom:'1px solid var(--border)'}}>
          {[['sent',`📤 Sent (${sent.length})`],['received',`📥 Received (${received.length})`]].map(([t,label])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'14px 20px',border:'none',background:'none',fontWeight:700,fontSize:'.875rem',color:tab===t?'var(--primary)':'var(--text-2)',borderBottom:tab===t?'2px solid var(--primary)':'2px solid transparent',cursor:'pointer',transition:'all .15s'}}>{label}</button>
          ))}
        </div>
        {display.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🤝</div><h4>No {tab} donations yet</h4></div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="table table-hover">
              <thead><tr><th>{tab==='sent'?'Recipient':'Donor'}</th><th>Days</th><th>Reason</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {display.map(d=>(
                  <tr key={d.id}>
                    <td><strong style={{color:'var(--text-1)',fontSize:'.875rem'}}>{tab==='sent'?d.recipientName:d.donorName}</strong></td>
                    <td><strong style={{color:'var(--primary)',fontSize:'1.1rem'}}>{d.daysDonated}</strong></td>
                    <td style={{maxWidth:'180px',fontSize:'.8125rem',color:'var(--text-2)'}}>{d.reason||'—'}</td>
                    <td><span className={getStatusClass(d.status)}>{d.status}</span></td>
                    <td style={{fontSize:'.75rem',color:'var(--text-3)'}}>{formatDateTime(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={()=>setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>🤝 Donate Leave Days</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Alert variant="info">Donation requires HR approval before days are transferred.</Alert>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Recipient</Form.Label>
              <Form.Select value={form.recipientId} onChange={e=>setForm(p=>({...p,recipientId:e.target.value}))} required>
                <option value="">-- Select a colleague --</option>
                {employees.map(emp=><option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} — {emp.email}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Days to Donate</Form.Label>
              <Form.Control type="number" min="1" placeholder="e.g. 3" value={form.daysDonated} onChange={e=>setForm(p=>({...p,daysDonated:e.target.value}))} required/>
              <Form.Text style={{color:'var(--text-3)'}}>Your balance: <strong style={{color:'var(--primary)'}}>{user?.remainingLeaveDays??0} days</strong></Form.Text>
            </Form.Group>
            <Form.Group className="mb-4"><Form.Label>Reason <span style={{color:'var(--text-3)',fontWeight:400}}>(optional)</span></Form.Label><Form.Control as="textarea" rows={3} placeholder="Why are you donating?" value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))}/></Form.Group>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{justifyContent:'center'}}>{submitting?'Submitting…':'🤝 Donate'}</button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default LeaveDonationPage;
