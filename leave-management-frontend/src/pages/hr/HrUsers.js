

// import React, { useState, useEffect } from 'react';
// import { Alert, Modal, Form, Row, Col } from 'react-bootstrap';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const ROLES = ['EMPLOYEE','MANAGER','HR_ADMIN'];
// const ROLE_COLORS = { EMPLOYEE:'#00d4aa', MANAGER:'#7c5cfc', HR_ADMIN:'#ef4444' };

// const HrUsers = () => {
//   const [users, setUsers]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');
//   const [success, setSuccess] = useState('');
//   const [search, setSearch]   = useState('');
//   const [modal, setModal]     = useState(null);
//   const [form, setForm]       = useState({});
//   const [saving, setSaving]   = useState(false);

//   const fetchUsers = async () => {
//     try { setUsers(await hrService.getAllUsers()); }
//     catch { setError('Failed to load employees'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const openCreate = () => { setForm({ role:'EMPLOYEE', totalLeaveDays:20 }); setModal('create'); };
//   const openEdit   = u => { setForm({ ...u, password:'' }); setModal({ user: u }); };

//   const handleSave = async (e) => {
//     e.preventDefault(); setError(''); setSaving(true);
//     try {
//       if (modal === 'create') await hrService.createUser(form);
//       else await hrService.updateUser(modal.user.id, form);
//       setSuccess(modal === 'create' ? 'Employee created!' : 'Employee updated!');
//       setModal(null); fetchUsers();
//     } catch (err) { setError(err.message); }
//     finally { setSaving(false); }
//   };

//   const toggleStatus = async u => {
//     try { await hrService.setUserStatus(u.id, !u.enabled); setSuccess(`Account ${!u.enabled ? 'enabled' : 'disabled'}`); fetchUsers(); }
//     catch (err) { setError(err.message); }
//   };

//   const filtered = users.filter(u =>
//     `${u.firstName} ${u.lastName} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">👤 Employee Management</h1><p className="page-subtitle">{users.length} employees in the system</p></div>
//         <button className="btn btn-primary" onClick={openCreate}>➕ Add Employee</button>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       <div className="card">
//         <div className="card-header">
//           <input className="form-control" placeholder="🔍 Search employees…" value={search}
//             onChange={e => setSearch(e.target.value)} style={{ maxWidth:'320px', background:'rgba(255,255,255,.05)' }} />
//           <span style={{ color:'#64748b', fontSize:'.875rem' }}>{filtered.length} results</span>
//         </div>
//         <div style={{ overflowX:'auto' }}>
//           <table className="table table-hover">
//             <thead><tr><th>Employee</th><th>Email</th><th>Role</th><th>Department</th><th>Leave Balance</th><th>Status</th><th>Actions</th></tr></thead>
//             <tbody>
//               {filtered.map(u => (
//                 <tr key={u.id}>
//                   <td>
//                     <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
//                       <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${ROLE_COLORS[u.role]}25`, border:`1px solid ${ROLE_COLORS[u.role]}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', fontWeight:700, color:ROLE_COLORS[u.role], flexShrink:0 }}>
//                         {u.firstName?.[0]}{u.lastName?.[0]}
//                       </div>
//                       <div>
//                         <div style={{ fontWeight:700, fontSize:'.875rem', color:'#f1f5f9' }}>{u.firstName} {u.lastName}</div>
//                         <div style={{ fontSize:'.75rem', color:'#475569' }}>ID: {u.id}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td style={{ fontSize:'.8125rem', color:'#94a3b8' }}>{u.email}</td>
//                   <td>
//                     <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background:`${ROLE_COLORS[u.role]}18`, color:ROLE_COLORS[u.role], border:`1px solid ${ROLE_COLORS[u.role]}30` }}>
//                       {u.role?.replace('_',' ')}
//                     </span>
//                   </td>
//                   <td style={{ fontSize:'.8125rem', color:'#94a3b8' }}>{u.department || '—'}</td>
//                   <td>
//                     <strong style={{ color:'#00d4aa' }}>{u.remainingLeaveDays}</strong>
//                     <span style={{ color:'#475569' }}> / {u.totalLeaveDays}d</span>
//                   </td>
//                   <td>
//                     <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background: u.enabled ? 'rgba(0,212,170,.12)' : 'rgba(100,116,139,.12)', color: u.enabled ? '#00d4aa' : '#64748b' }}>
//                       {u.enabled ? 'Active' : 'Disabled'}
//                     </span>
//                   </td>
//                   <td>
//                     <div style={{ display:'flex', gap:'6px' }}>
//                       <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(u)}>Edit</button>
//                       <button className={`btn btn-sm ${u.enabled ? 'btn-outline-secondary' : 'btn-outline-primary'}`} onClick={() => toggleStatus(u)}>
//                         {u.enabled ? 'Disable' : 'Enable'}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Modal show={!!modal} onHide={() => setModal(null)} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{modal === 'create' ? '➕ Add Employee' : '✏️ Edit Employee'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleSave}>
//             <Row>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control value={form.firstName || ''} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required /></Form.Group></Col>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control value={form.lastName || ''} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required /></Form.Group></Col>
//             </Row>
//             <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></Form.Group>
//             {modal === 'create' && <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Min 8 characters" value={form.password || ''} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required /></Form.Group>}
//             <Row>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Role</Form.Label><Form.Select value={form.role || 'EMPLOYEE'} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>{ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}</Form.Select></Form.Group></Col>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Department</Form.Label><Form.Control value={form.department || ''} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} /></Form.Group></Col>
//             </Row>
//             <Row>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Total Leave Days</Form.Label><Form.Control type="number" min="0" value={form.totalLeaveDays || 20} onChange={e => setForm(p => ({ ...p, totalLeaveDays: parseInt(e.target.value) }))} /></Form.Group></Col>
//               <Col md={6}><Form.Group className="mb-3"><Form.Label>Manager ID <span style={{ color:'#475569', fontWeight:400 }}>(optional)</span></Form.Label><Form.Control type="number" value={form.managerId || ''} onChange={e => setForm(p => ({ ...p, managerId: e.target.value ? parseInt(e.target.value) : null }))} /></Form.Group></Col>
//             </Row>
//             <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
//               <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(null)}>Cancel</button>
//               <button type="submit" className="btn btn-primary" disabled={saving} style={{ justifyContent:'center' }}>{saving ? 'Saving…' : 'Save Employee'}</button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default HrUsers;


import React, { useState, useEffect } from 'react';
import { Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
const ROLES = ['EMPLOYEE','HR_ADMIN'];
const ROLE_COLORS = { EMPLOYEE:'#2c3e7a', HR_ADMIN:'#e53e3e' };
const HrUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const fetchUsers = async () => { try { setUsers(await hrService.getAllUsers()); } catch { setError('Failed to load employees'); } finally { setLoading(false); } };
  useEffect(() => { fetchUsers(); }, []);
  const openCreate = () => { setForm({ role:'EMPLOYEE', totalLeaveDays:20 }); setModal('create'); };
  const openEdit = u => { setForm({ ...u, password:'' }); setModal({ user: u }); };
  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (modal === 'create') await hrService.createUser(form);
      else await hrService.updateUser(modal.user.id, form);
      setSuccess(modal === 'create' ? 'Employee created!' : 'Employee updated!');
      setModal(null); fetchUsers();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const toggleStatus = async u => {
    try { await hrService.setUserStatus(u.id, !u.enabled); setSuccess(`Account ${!u.enabled ? 'enabled' : 'disabled'}`); fetchUsers(); }
    catch (err) { setError(err.message); }
  };
  const filtered = users.filter(u => `${u.firstName} ${u.lastName} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">👥 Employee Management</h1><p className="page-subtitle">{users.length} employees in the system</p></div><button className="btn btn-primary" onClick={openCreate}>➕ Add Employee</button></div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      <div className="card">
        <div className="card-header">
          <input className="form-control" placeholder="🔍 Search employees…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:'320px' }} />
          <span style={{ color:'var(--text-3)', fontSize:'.875rem' }}>{filtered.length} results</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="table table-hover">
            <thead><tr><th>Employee</th><th>Email</th><th>Role</th><th>Department</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${ROLE_COLORS[u.role]}18`, border:`1px solid ${ROLE_COLORS[u.role]}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', fontWeight:700, color:ROLE_COLORS[u.role], flexShrink:0 }}>{u.firstName?.[0]}{u.lastName?.[0]}</div>
                    <div><div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text-1)' }}>{u.firstName} {u.lastName}</div><div style={{ fontSize:'.75rem', color:'var(--text-3)' }}>ID: {u.id}</div></div>
                  </div></td>
                  <td style={{ fontSize:'.8125rem', color:'var(--text-2)' }}>{u.email}</td>
                  <td><span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background:`${ROLE_COLORS[u.role]}12`, color:ROLE_COLORS[u.role] }}>{u.role?.replace('_',' ')}</span></td>
                  <td style={{ fontSize:'.8125rem', color:'var(--text-2)' }}>{u.department || '—'}</td>
                  <td><strong style={{ color:'var(--primary)' }}>{u.remainingLeaveDays}</strong><span style={{ color:'var(--text-3)' }}> / {u.totalLeaveDays}d</span></td>
                  <td><span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'.75rem', fontWeight:700, background:u.enabled?'var(--success-light)':'var(--bg-2)', color:u.enabled?'var(--success)':'var(--text-3)' }}>{u.enabled ? 'Active' : 'Disabled'}</span></td>
                  <td><div style={{ display:'flex', gap:'6px' }}>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(u)}>Edit</button>
                    <button className={`btn btn-sm ${u.enabled ? 'btn-outline-secondary' : 'btn-outline-primary'}`} onClick={() => toggleStatus(u)}>{u.enabled ? 'Disable' : 'Enable'}</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={!!modal} onHide={() => setModal(null)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>{modal === 'create' ? '➕ Add Employee' : '✏️ Edit Employee'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSave}>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control value={form.firstName||''} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} required /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control value={form.lastName||''} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} required /></Form.Group></Col></Row>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={form.email||''} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required /></Form.Group>
            {modal === 'create' && <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Min 8 characters" value={form.password||''} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required /></Form.Group>}
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Role</Form.Label><Form.Select value={form.role||'EMPLOYEE'} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>{ROLES.map(r=><option key={r} value={r}>{r.replace('_',' ')}</option>)}</Form.Select></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Department</Form.Label><Form.Control value={form.department||''} onChange={e=>setForm(p=>({...p,department:e.target.value}))}/></Form.Group></Col></Row>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Total Leave Days</Form.Label><Form.Control type="number" min="0" value={form.totalLeaveDays||20} onChange={e=>setForm(p=>({...p,totalLeaveDays:parseInt(e.target.value)}))}/></Form.Group></Col></Row>
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ justifyContent:'center' }}>{saving ? 'Saving…' : 'Save Employee'}</button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default HrUsers;

