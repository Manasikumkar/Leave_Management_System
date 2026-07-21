
// import React, { useState, useEffect } from 'react';
// import { Alert, Modal, Form, Row, Col } from 'react-bootstrap';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const LEAVE_TYPES = ['VACATION','SICK','PERSONAL','MATERNITY','PATERNITY','BEREAVEMENT'];
// const TYPE_COLORS = { VACATION:'#3b82f6', SICK:'#ef4444', PERSONAL:'#7c5cfc', MATERNITY:'#ec4899', PATERNITY:'#00d4aa', BEREAVEMENT:'#64748b' };

// const HrPolicies = () => {
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState('');
//   const [success, setSuccess]   = useState('');
//   const [modal, setModal]       = useState(false);
//   const [form, setForm]         = useState({ leaveType:'VACATION', defaultAnnualDays:20, maxConsecutiveDays:14, carryForwardAllowed:false, maxCarryForwardDays:0, requiresApproval:true });
//   const [saving, setSaving]     = useState(false);

//   const fetchPolicies = async () => {
//     try { setPolicies(await hrService.getAllPolicies()); }
//     catch { setError('Failed to load policies'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchPolicies(); }, []);

//   const openEdit = p => { setForm({ ...p }); setModal(true); };
//   const openNew  = () => { setForm({ leaveType:'VACATION', defaultAnnualDays:20, maxConsecutiveDays:14, carryForwardAllowed:false, maxCarryForwardDays:0, requiresApproval:true }); setModal(true); };
//   const setF     = (k, v) => setForm(p => ({ ...p, [k]: v }));

//   const handleSave = async (e) => {
//     e.preventDefault(); setError(''); setSaving(true);
//     try { await hrService.createOrUpdatePolicy(form); setSuccess('Policy saved!'); setModal(false); fetchPolicies(); }
//     catch (err) { setError(err.message); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async id => {
//     if (!window.confirm('Delete this policy?')) return;
//     try { await hrService.deletePolicy(id); setSuccess('Policy deleted'); fetchPolicies(); }
//     catch (err) { setError(err.message); }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">📜 Leave Policies</h1><p className="page-subtitle">Configure leave rules per leave type</p></div>
//         <button className="btn btn-primary" onClick={openNew}>➕ Add Policy</button>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       {policies.length === 0 ? (
//         <div className="card"><div className="empty-state">
//           <div className="empty-state-icon">📜</div><h4>No policies configured</h4>
//           <p>Add policies to enforce rules during leave requests</p>
//           <button className="btn btn-primary" onClick={openNew}>Add First Policy</button>
//         </div></div>
//       ) : (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'16px' }}>
//           {policies.map(p => {
//             const color = TYPE_COLORS[p.leaveType] || '#64748b';
//             return (
//               <div key={p.id} className="card" style={{ borderTop:`3px solid ${color}` }}>
//                 <div className="card-header">
//                   <span style={{ color, fontWeight:800 }}>{p.leaveType.replace('_',' ')}</span>
//                   <div style={{ display:'flex', gap:'6px' }}>
//                     <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(p)}>Edit</button>
//                     <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
//                   </div>
//                 </div>
//                 <div className="card-body">
//                   <div className="detail-row"><span className="detail-label">Annual Days</span><span className="detail-value" style={{ color }}>{p.defaultAnnualDays}d</span></div>
//                   <div className="detail-row"><span className="detail-label">Max Consecutive</span><span className="detail-value">{p.maxConsecutiveDays}d</span></div>
//                   <div className="detail-row"><span className="detail-label">Carry Forward</span><span className="detail-value">{p.carryForwardAllowed ? `Yes (max ${p.maxCarryForwardDays}d)` : 'No'}</span></div>
//                   <div className="detail-row"><span className="detail-label">Requires Approval</span>
//                     <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background: p.requiresApproval ? 'rgba(0,212,170,.12)' : 'rgba(100,116,139,.12)', color: p.requiresApproval ? '#00d4aa' : '#64748b' }}>
//                       {p.requiresApproval ? 'Yes' : 'No'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <Modal show={modal} onHide={() => setModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>📜 {form.id ? 'Edit' : 'Add'} Leave Policy</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleSave}>
//             <Form.Group className="mb-3"><Form.Label>Leave Type</Form.Label>
//               <Form.Select value={form.leaveType} onChange={e => setF('leaveType', e.target.value)} disabled={!!form.id}>
//                 {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </Form.Select>
//             </Form.Group>
//             <Row>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Annual Days</Form.Label><Form.Control type="number" min="0" value={form.defaultAnnualDays} onChange={e => setF('defaultAnnualDays', +e.target.value)} required /></Form.Group></Col>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Max Consecutive Days</Form.Label><Form.Control type="number" min="1" value={form.maxConsecutiveDays} onChange={e => setF('maxConsecutiveDays', +e.target.value)} required /></Form.Group></Col>
//             </Row>
//             <Form.Group className="mb-3"><Form.Check type="switch" label="Allow Carry Forward" checked={form.carryForwardAllowed} onChange={e => setF('carryForwardAllowed', e.target.checked)} /></Form.Group>
//             {form.carryForwardAllowed && <Form.Group className="mb-3"><Form.Label>Max Carry Forward Days</Form.Label><Form.Control type="number" min="0" value={form.maxCarryForwardDays} onChange={e => setF('maxCarryForwardDays', +e.target.value)} /></Form.Group>}
//             <Form.Group className="mb-4"><Form.Check type="switch" label="Requires Manager Approval" checked={form.requiresApproval} onChange={e => setF('requiresApproval', e.target.checked)} /></Form.Group>
//             <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
//               <button type="submit" className="btn btn-primary" disabled={saving} style={{ justifyContent:'center' }}>{saving ? 'Saving…' : 'Save Policy'}</button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default HrPolicies;


import React, { useState, useEffect } from 'react';
import { Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
const LEAVE_TYPES = ['VACATION','SICK','PERSONAL','MATERNITY','PATERNITY','BEREAVEMENT'];
const TYPE_COLORS = { VACATION:'#2c3e7a', SICK:'#e53e3e', PERSONAL:'#6b46c1', MATERNITY:'#97266d', PATERNITY:'#3dc48e', BEREAVEMENT:'#718096' };
const HrPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ leaveType:'VACATION', defaultAnnualDays:20, maxConsecutiveDays:14, carryForwardAllowed:false, maxCarryForwardDays:0, requiresApproval:true });
  const [saving, setSaving] = useState(false);
  const fetchPolicies = async () => { try { setPolicies(await hrService.getAllPolicies()); } catch { setError('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchPolicies(); }, []);
  const openEdit = p => { setForm({ ...p }); setModal(true); };
  const openNew = () => { setForm({ leaveType:'VACATION', defaultAnnualDays:20, maxConsecutiveDays:14, carryForwardAllowed:false, maxCarryForwardDays:0, requiresApproval:true }); setModal(true); };
  const setF = (k,v) => setForm(p => ({ ...p, [k]:v }));
  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try { await hrService.createOrUpdatePolicy(form); setSuccess('Policy saved!'); setModal(false); fetchPolicies(); }
    catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this policy?')) return;
    try { await hrService.deletePolicy(id); setSuccess('Policy deleted'); fetchPolicies(); }
    catch (err) { setError(err.message); }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">📜 Leave Policies</h1><p className="page-subtitle">Configure leave rules per leave type</p></div><button className="btn btn-primary" onClick={openNew}>➕ Add Policy</button></div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      {policies.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📜</div><h4>No policies configured</h4><p>Add policies to enforce leave rules</p><button className="btn btn-primary" onClick={openNew}>Add First Policy</button></div></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
          {policies.map(p => { const color = TYPE_COLORS[p.leaveType]||'#718096'; return (
            <div key={p.id} className="card" style={{ borderTop:`3px solid ${color}` }}>
              <div className="card-header"><span style={{ color, fontWeight:800 }}>{p.leaveType.replace('_',' ')}</span><div style={{ display:'flex', gap:'6px' }}><button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(p)}>Edit</button><button className="btn btn-outline-secondary btn-sm" onClick={() => handleDelete(p.id)}>Delete</button></div></div>
              <div className="card-body">
                <div className="detail-row"><span className="detail-label">Annual Days</span><span className="detail-value" style={{ color }}>{p.defaultAnnualDays}d</span></div>
                <div className="detail-row"><span className="detail-label">Max Consecutive</span><span className="detail-value">{p.maxConsecutiveDays}d</span></div>
                <div className="detail-row"><span className="detail-label">Carry Forward</span><span className="detail-value">{p.carryForwardAllowed?`Yes (max ${p.maxCarryForwardDays}d)`:'No'}</span></div>
                <div className="detail-row"><span className="detail-label">Requires Approval</span><span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background:p.requiresApproval?'var(--primary-light)':'var(--success-light)', color:p.requiresApproval?'var(--primary)':'var(--success)' }}>{p.requiresApproval?'Yes':'No'}</span></div>
              </div>
            </div>
          );})}
        </div>
      )}
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>📜 {form.id?'Edit':'Add'} Leave Policy</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3"><Form.Label>Leave Type</Form.Label><Form.Select value={form.leaveType} onChange={e=>setF('leaveType',e.target.value)} disabled={!!form.id}>{LEAVE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</Form.Select></Form.Group>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Annual Days</Form.Label><Form.Control type="number" min="0" value={form.defaultAnnualDays} onChange={e=>setF('defaultAnnualDays',+e.target.value)} required /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Max Consecutive Days</Form.Label><Form.Control type="number" min="1" value={form.maxConsecutiveDays} onChange={e=>setF('maxConsecutiveDays',+e.target.value)} required /></Form.Group></Col></Row>
            <Form.Group className="mb-3"><Form.Check type="switch" label="Allow Carry Forward" checked={form.carryForwardAllowed} onChange={e=>setF('carryForwardAllowed',e.target.checked)}/></Form.Group>
            {form.carryForwardAllowed && <Form.Group className="mb-3"><Form.Label>Max Carry Forward Days</Form.Label><Form.Control type="number" min="0" value={form.maxCarryForwardDays} onChange={e=>setF('maxCarryForwardDays',+e.target.value)}/></Form.Group>}
            <Form.Group className="mb-4"><Form.Check type="switch" label="Requires Approval" checked={form.requiresApproval} onChange={e=>setF('requiresApproval',e.target.checked)}/></Form.Group>
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}><button type="button" className="btn btn-outline-secondary" onClick={()=>setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving} style={{ justifyContent:'center' }}>{saving?'Saving…':'Save Policy'}</button></div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default HrPolicies;



