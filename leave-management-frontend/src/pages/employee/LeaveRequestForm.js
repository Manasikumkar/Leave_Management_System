

// import React, { useState, useEffect, useCallback } from 'react';
// import { Form, Alert, Row, Col } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { leaveService } from '../../services/leaveService';
// import { useAuth } from '../../contexts/AuthContext';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { LEAVE_TYPES } from '../../utils/constants';

// const calcWeekdays = (start, end) => {
//   if (!start || !end) return 0;
//   let count = 0;
//   const cur = new Date(start);
//   const last = new Date(end);
//   while (cur <= last) {
//     const day = cur.getDay();
//     if (day !== 0 && day !== 6) count++;
//     cur.setDate(cur.getDate() + 1);
//   }
//   return count;
// };

// const LeaveRequestForm = () => {
//   const navigate = useNavigate();
//   const { user }  = useAuth();
//   const [formData, setFormData] = useState({ leaveType:'VACATION', startDate:'', endDate:'', reason:'' });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError]           = useState('');
//   const [success, setSuccess]       = useState('');
//   const [balance, setBalance]       = useState(null);
//   const [balLoading, setBalLoading] = useState(true);

//   const days = calcWeekdays(formData.startDate, formData.endDate);
//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     leaveService.getLeaveBalance()
//       .then(setBalance)
//       .catch(() => {})
//       .finally(() => setBalLoading(false));
//   }, []);

//   const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setSuccess('');
//     if (!formData.startDate || !formData.endDate) return setError('Please select both dates');
//     if (new Date(formData.endDate) < new Date(formData.startDate)) return setError('End date cannot be before start date');
//     if (days <= 0) return setError('Selected dates contain no working days');
//     if (balance && days > balance.remainingLeaveDays) return setError(`Insufficient balance. Available: ${balance.remainingLeaveDays} days, Requested: ${days} days`);
//     setSubmitting(true);
//     try {
//       await leaveService.createLeaveRequest(formData);
//       setSuccess('Leave request submitted successfully!');
//       setTimeout(() => navigate('/leaves'), 1500);
//     } catch (err) {
//       setError(err.message || 'Failed to submit leave request');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (balLoading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">New Leave Request</h1>
//           <p className="page-subtitle">Fill in the details to submit your leave</p>
//         </div>
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px', alignItems:'start' }}>
//         <div className="card">
//           <div className="card-header">Leave Details</div>
//           <div className="card-body">
//             {error   && <Alert variant="danger">{error}</Alert>}
//             {success && <Alert variant="success">{success}</Alert>}

//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-4">
//                 <Form.Label>Leave Type</Form.Label>
//                 <Form.Select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
//                   {Object.entries(LEAVE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
//                 </Form.Select>
//               </Form.Group>

//               <Row className="mb-4">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Start Date</Form.Label>
//                     <Form.Control type="date" name="startDate" value={formData.startDate}
//                       onChange={handleChange} min={today} required />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>End Date</Form.Label>
//                     <Form.Control type="date" name="endDate" value={formData.endDate}
//                       onChange={handleChange} min={formData.startDate || today} required />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {days > 0 && (
//                 <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'8px', padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
//                   <span style={{ fontSize:'1.25rem' }}>📅</span>
//                   <div>
//                     <strong style={{ color:'#1e40af' }}>{days} working day{days !== 1 ? 's' : ''}</strong>
//                     <span style={{ color:'#3b82f6', fontSize:'.8125rem' }}> selected</span>
//                   </div>
//                 </div>
//               )}

//               <Form.Group className="mb-4">
//                 <Form.Label>Reason <span style={{ color:'#94a3b8', fontWeight:400 }}>(optional)</span></Form.Label>
//                 <Form.Control as="textarea" name="reason" rows={4} placeholder="Briefly describe your leave reason…"
//                   value={formData.reason} onChange={handleChange} />
//               </Form.Group>

//               <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end' }}>
//                 <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/leaves')}>Cancel</button>
//                 <button type="submit" className="btn btn-primary" disabled={submitting}>
//                   {submitting ? 'Submitting…' : '📤 Submit Request'}
//                 </button>
//               </div>
//             </Form>
//           </div>
//         </div>

//         {/* Sidebar info */}
//         <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
//           <div className="card">
//             <div className="card-header">Your Balance</div>
//             <div className="card-body">
//               <div style={{ textAlign:'center', padding:'8px 0' }}>
//                 <div style={{ fontSize:'2.5rem', fontWeight:700, color:'#2563eb' }}>{balance?.remainingLeaveDays ?? 0}</div>
//                 <div style={{ color:'#64748b', fontSize:'.875rem' }}>days remaining</div>
//               </div>
//               <hr style={{ borderColor:'#e2e8f0' }} />
//               <div className="detail-row"><span className="detail-label">Total</span><span className="detail-value">{balance?.totalLeaveDays ?? 0} days</span></div>
//               <div className="detail-row"><span className="detail-label">Used</span><span className="detail-value">{balance?.usedLeaveDays ?? 0} days</span></div>
//               {days > 0 && (
//                 <div className="detail-row">
//                   <span className="detail-label">After this</span>
//                   <span className="detail-value" style={{ color: (balance?.remainingLeaveDays ?? 0) - days < 0 ? '#dc2626' : '#16a34a' }}>
//                     {(balance?.remainingLeaveDays ?? 0) - days} days
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header">Leave Types</div>
//             <div className="card-body" style={{ fontSize:'.8125rem' }}>
//               {Object.entries(LEAVE_TYPES).map(([k, v]) => (
//                 <div key={k} style={{ padding:'6px 0', borderBottom:'1px solid #f1f5f9', color:'#475569' }}>📌 {v}</div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveRequestForm;


import React, { useState, useEffect } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LEAVE_TYPES } from '../../utils/constants';

const calcWeekdays = (start, end) => {
  if (!start || !end) return 0;
  let count = 0;
  const cur = new Date(start), last = new Date(end);
  while (cur <= last) { const d = cur.getDay(); if (d !== 0 && d !== 6) count++; cur.setDate(cur.getDate() + 1); }
  return count;
};

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ leaveType:'VACATION', startDate:'', endDate:'', reason:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(null);
  const [balLoading, setBalLoading] = useState(true);
  const days  = calcWeekdays(formData.startDate, formData.endDate);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { leaveService.getLeaveBalance().then(setBalance).catch(()=>{}).finally(()=>setBalLoading(false)); }, []);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!formData.startDate || !formData.endDate) return setError('Please select both dates');
    if (new Date(formData.endDate) < new Date(formData.startDate)) return setError('End date cannot be before start date');
    if (days <= 0) return setError('Selected dates contain no working days');
    if (balance && days > balance.remainingLeaveDays) return setError(`Insufficient balance. Available: ${balance.remainingLeaveDays} days`);
    setSubmitting(true);
    try { await leaveService.createLeaveRequest(formData); setSuccess('Leave request submitted successfully!'); setTimeout(() => navigate('/leaves'), 1500); }
    catch (err) { setError(err.message || 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  if (balLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Apply for Leave</h1><p className="page-subtitle">Fill in the details below to submit your leave request</p></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px', alignItems:'start' }}>
        <div className="card">
          <div className="card-header">Leave Details</div>
          <div className="card-body">
            {error   && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Leave Type</Form.Label>
                <Form.Select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
                  {Object.entries(LEAVE_TYPES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </Form.Select>
              </Form.Group>
              <Row className="mb-4">
                <Col md={6}><Form.Group><Form.Label>Start Date</Form.Label><Form.Control type="date" name="startDate" value={formData.startDate} min={today} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>End Date</Form.Label><Form.Control type="date" name="endDate" value={formData.endDate} min={formData.startDate||today} onChange={handleChange} required /></Form.Group></Col>
              </Row>
              {days > 0 && (
                <div style={{ background:'var(--primary-light)', border:'1px solid rgba(44,62,122,.15)', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontSize:'1.5rem' }}>📅</span>
                  <div>
                    <strong style={{ color:'var(--primary)', fontSize:'1.1rem' }}>{days} working day{days !== 1 ? 's' : ''}</strong>
                    <span style={{ color:'var(--text-3)', fontSize:'.8125rem', marginLeft:'6px' }}>selected (weekends excluded)</span>
                  </div>
                </div>
              )}
              <Form.Group className="mb-4">
                <Form.Label>Reason <span style={{ color:'var(--text-3)', fontWeight:400 }}>(optional)</span></Form.Label>
                <Form.Control as="textarea" name="reason" rows={4} placeholder="Briefly describe your reason for leave…" value={formData.reason} onChange={handleChange} />
              </Form.Group>
              <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/leaves')}>Cancel</button>
                <button type="submit" className="btn btn-coral" disabled={submitting} style={{ justifyContent:'center' }}>{submitting ? 'Submitting…' : '📤 Submit Request'}</button>
              </div>
            </Form>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="card">
            <div className="card-header">Your Balance</div>
            <div className="card-body">
              <div style={{ textAlign:'center', padding:'12px 0' }}>
                <div style={{ fontSize:'3rem', fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{balance?.remainingLeaveDays ?? 0}</div>
                <div style={{ color:'var(--text-3)', fontSize:'.875rem', marginTop:'6px' }}>days remaining</div>
              </div>
              <div style={{ height:'1px', background:'var(--border)', margin:'16px 0' }} />
              <div className="detail-row"><span className="detail-label">Total</span><span className="detail-value">{balance?.totalLeaveDays ?? 0}d</span></div>
              <div className="detail-row"><span className="detail-label">Used</span><span className="detail-value" style={{ color:'var(--warning)' }}>{balance?.usedLeaveDays ?? 0}d</span></div>
              {days > 0 && (
                <div className="detail-row">
                  <span className="detail-label">After this request</span>
                  <span className="detail-value" style={{ color: (balance?.remainingLeaveDays ?? 0) - days < 0 ? 'var(--danger-dark)' : 'var(--success)' }}>
                    {(balance?.remainingLeaveDays ?? 0) - days}d
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Leave Types</div>
            <div className="card-body" style={{ fontSize:'.8125rem' }}>
              {Object.entries(LEAVE_TYPES).map(([k,v]) => (
                <div key={k} style={{ padding:'7px 0', borderBottom:'1px solid var(--border)', color:'var(--text-2)', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--primary)', display:'inline-block', flexShrink:0 }} />
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaveRequestForm;

