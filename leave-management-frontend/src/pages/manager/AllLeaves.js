

// import React, { useState, useEffect, useCallback } from 'react';
// import { Alert, Form, Row, Col } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDate, formatDateTime, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

// const AllLeaves = () => {
//   const [leaves, setLeaves]     = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState('');
//   const [filters, setFilters]   = useState({ status:'ALL', leaveType:'ALL', search:'' });

//   useEffect(() => {
//     leaveService.getAllLeaves()
//       .then(d => { setLeaves(d); setFiltered(d); })
//       .catch(() => setError('Failed to load leave requests'))
//       .finally(() => setLoading(false));
//   }, []);

//   const applyFilters = useCallback(() => {
//     let data = [...leaves];
//     if (filters.status !== 'ALL')    data = data.filter(l => l.status === filters.status);
//     if (filters.leaveType !== 'ALL') data = data.filter(l => l.leaveType === filters.leaveType);
//     if (filters.search) {
//       const q = filters.search.toLowerCase();
//       data = data.filter(l => l.employeeName?.toLowerCase().includes(q) || l.reason?.toLowerCase().includes(q));
//     }
//     setFiltered(data);
//   }, [leaves, filters]);

//   useEffect(() => { applyFilters(); }, [applyFilters]);

//   const stats = {
//     TOTAL: leaves.length,
//     PENDING: leaves.filter(l => l.status === 'PENDING').length,
//     APPROVED: leaves.filter(l => l.status === 'APPROVED').length,
//     REJECTED: leaves.filter(l => l.status === 'REJECTED').length,
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">📁 All Leave Requests</h1><p className="page-subtitle">Complete leave history for your team</p></div>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}

//       <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
//         {[
//           { icon:'📋', value:stats.TOTAL,    label:'Total',    color:'blue'   },
//           { icon:'⏳', value:stats.PENDING,  label:'Pending',  color:'orange' },
//           { icon:'✅', value:stats.APPROVED, label:'Approved', color:'green'  },
//           { icon:'❌', value:stats.REJECTED, label:'Rejected', color:'red'    },
//         ].map(s => (
//           <div key={s.label} className={`stat-card ${s.color}`}>
//             <div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div>
//             <div className={`stat-value ${s.color}`}>{s.value}</div>
//             <div className="stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div className="card mb-4">
//         <div className="card-header">Filters</div>
//         <div className="card-body">
//           <Row>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
//                   {['ALL','PENDING','APPROVED','REJECTED','CANCELLED'].map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</option>)}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Leave Type</Form.Label>
//                 <Form.Select value={filters.leaveType} onChange={e => setFilters(p => ({ ...p, leaveType: e.target.value }))}>
//                   <option value="ALL">All Types</option>
//                   {['VACATION','SICK','PERSONAL','MATERNITY','PATERNITY','BEREAVEMENT'].map(t => <option key={t} value={t}>{t}</option>)}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Search</Form.Label>
//                 <Form.Control placeholder="Search by employee name or reason…" value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} />
//               </Form.Group>
//             </Col>
//           </Row>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header"><span>Results ({filtered.length})</span></div>
//         {filtered.length === 0 ? (
//           <div className="empty-state"><div className="empty-state-icon">🔍</div><h4>No results match your filters</h4></div>
//         ) : (
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th>Manager</th><th>Comments</th><th>Submitted</th></tr></thead>
//               <tbody>
//                 {filtered.map(l => (
//                   <tr key={l.id}>
//                     <td>
//                       <div style={{ fontWeight:700, fontSize:'.875rem', color:'#f1f5f9' }}>{l.employeeName}</div>
//                       <div style={{ fontSize:'.75rem', color:'#475569' }}>ID: {l.employeeId}</div>
//                     </td>
//                     <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
//                     <td style={{ fontSize:'.8125rem', whiteSpace:'nowrap' }}>{formatDate(l.startDate)}<br/><span style={{ color:'#64748b' }}>→ {formatDate(l.endDate)}</span></td>
//                     <td><strong style={{ color:'#00d4aa' }}>{l.numberOfDays}d</strong></td>
//                     <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
//                     <td style={{ fontSize:'.8125rem', color:'#94a3b8' }}>{l.managerName || '—'}</td>
//                     <td style={{ maxWidth:'160px' }}>
//                       {l.managerComments
//                         ? <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'.8125rem', color:'#94a3b8', fontStyle:'italic' }} title={l.managerComments}>"{l.managerComments}"</div>
//                         : <span style={{ color:'#475569', fontSize:'.8125rem' }}>—</span>}
//                     </td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b', whiteSpace:'nowrap' }}>{formatDateTime(l.createdAt)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllLeaves;


import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Form, Row, Col } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

const AllLeaves = () => {
  const [leaves, setLeaves]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filters, setFilters] = useState({ status:'ALL', leaveType:'ALL', search:'' });

  useEffect(() => { leaveService.getAllLeaves().then(d=>{setLeaves(d);setFiltered(d);}).catch(()=>setError('Failed to load')).finally(()=>setLoading(false)); }, []);

  const applyFilters = useCallback(() => {
    let data = [...leaves];
    if (filters.status!=='ALL') data = data.filter(l=>l.status===filters.status);
    if (filters.leaveType!=='ALL') data = data.filter(l=>l.leaveType===filters.leaveType);
    if (filters.search) { const q=filters.search.toLowerCase(); data=data.filter(l=>l.employeeName?.toLowerCase().includes(q)||l.reason?.toLowerCase().includes(q)); }
    setFiltered(data);
  }, [leaves, filters]);
  useEffect(() => { applyFilters(); }, [applyFilters]);

  const stats = { TOTAL:leaves.length, PENDING:leaves.filter(l=>l.status==='PENDING').length, APPROVED:leaves.filter(l=>l.status==='APPROVED').length, REJECTED:leaves.filter(l=>l.status==='REJECTED').length };
  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">📁 All Leave Requests</h1><p className="page-subtitle">Complete leave history</p></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[{icon:'📋',value:stats.TOTAL,label:'Total',color:'blue'},{icon:'⏳',value:stats.PENDING,label:'Pending',color:'orange'},{icon:'✅',value:stats.APPROVED,label:'Approved',color:'green'},{icon:'❌',value:stats.REJECTED,label:'Rejected',color:'red'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="card mb-4">
        <div className="card-header">Filters</div>
        <div className="card-body">
          <Row>
            <Col md={3}><Form.Group><Form.Label>Status</Form.Label><Form.Select value={filters.status} onChange={e=>setFilters(p=>({...p,status:e.target.value}))}>{['ALL','PENDING','APPROVED','REJECTED','CANCELLED'].map(s=><option key={s} value={s}>{s==='ALL'?'All Status':s}</option>)}</Form.Select></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Leave Type</Form.Label><Form.Select value={filters.leaveType} onChange={e=>setFilters(p=>({...p,leaveType:e.target.value}))}><option value="ALL">All Types</option>{['VACATION','SICK','PERSONAL','MATERNITY','PATERNITY','BEREAVEMENT'].map(t=><option key={t} value={t}>{t}</option>)}</Form.Select></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Search</Form.Label><Form.Control placeholder="Search by employee name or reason…" value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))}/></Form.Group></Col>
          </Row>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span>Results ({filtered.length})</span></div>
        {filtered.length === 0 ? <div className="empty-state"><div className="empty-state-icon">🔍</div><h4>No results found</h4></div> : (
          <div style={{overflowX:'auto'}}>
            <table className="table table-hover">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th>Comments</th><th>Submitted</th></tr></thead>
              <tbody>
                {filtered.map(l=>(
                  <tr key={l.id}>
                    <td><div style={{fontWeight:700,fontSize:'.875rem',color:'var(--text-1)'}}>{l.employeeName}</div><div style={{fontSize:'.75rem',color:'var(--text-3)'}}>ID: {l.employeeId}</div></td>
                    <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
                    <td style={{fontSize:'.8125rem',whiteSpace:'nowrap'}}>{formatDate(l.startDate)}<br/><span style={{color:'var(--text-3)'}}>→ {formatDate(l.endDate)}</span></td>
                    <td><strong style={{color:'var(--primary)'}}>{l.numberOfDays}d</strong></td>
                    <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
                    <td style={{maxWidth:'160px'}}>{l.managerComments?<div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'.8125rem',color:'var(--text-2)',fontStyle:'italic'}} title={l.managerComments}>"{l.managerComments}"</div>:<span style={{color:'var(--text-3)',fontSize:'.8125rem'}}>—</span>}</td>
                    <td style={{fontSize:'.75rem',color:'var(--text-3)',whiteSpace:'nowrap'}}>{formatDateTime(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AllLeaves;


