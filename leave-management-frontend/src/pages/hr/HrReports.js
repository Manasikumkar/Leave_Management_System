
// import React, { useState, useEffect } from 'react';
// import { Alert, Form, Row, Col } from 'react-bootstrap';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const today       = () => new Date().toISOString().split('T')[0];
// const firstOfMonth = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; };

// const HrReports = () => {
//   const [report, setReport]   = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');
//   const [from, setFrom]       = useState(firstOfMonth());
//   const [to, setTo]           = useState(today());

//   const fetchReport = async () => {
//     setLoading(true); setError('');
//     try { setReport(await hrService.getReport(from, to)); }
//     catch { setError('Failed to generate report'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchReport(); }, []);

//   const STATUS_CONFIG = [
//     { key:'approvedRequests',  label:'Approved',  color:'#00d4aa', bg:'rgba(0,212,170,.1)', icon:'✅' },
//     { key:'pendingRequests',   label:'Pending',   color:'#f59e0b', bg:'rgba(245,158,11,.1)', icon:'⏳' },
//     { key:'rejectedRequests',  label:'Rejected',  color:'#ef4444', bg:'rgba(239,68,68,.1)', icon:'❌' },
//     { key:'cancelledRequests', label:'Cancelled', color:'#64748b', bg:'rgba(100,116,139,.1)', icon:'🚫' },
//   ];

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">📈 Leave Reports</h1><p className="page-subtitle">Company-wide leave analytics and insights</p></div>
//       </div>

//       <div className="card mb-4">
//         <div className="card-body">
//           <Row className="align-items-end">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>From Date</Form.Label>
//                 <Form.Control type="date" value={from} onChange={e => setFrom(e.target.value)} />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>To Date</Form.Label>
//                 <Form.Control type="date" value={to} max={today()} onChange={e => setTo(e.target.value)} />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <button className="btn btn-primary w-100" onClick={fetchReport} disabled={loading} style={{ justifyContent:'center' }}>
//                 {loading ? 'Generating…' : '📊 Generate Report'}
//               </button>
//             </Col>
//           </Row>
//         </div>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {loading ? <LoadingSpinner message="Generating report…" /> : report && (
//         <>
//           <div className="stats-grid mb-4" style={{ gridTemplateColumns:'repeat(5,1fr)' }}>
//             <div className="stat-card green">
//               <div className="stat-top"><div className="stat-icon green">📋</div></div>
//               <div className="stat-value green">{report.totalRequests}</div>
//               <div className="stat-label">Total Requests</div>
//             </div>
//             {STATUS_CONFIG.map(s => (
//               <div key={s.key} className="stat-card" style={{ borderColor:'rgba(255,255,255,.07)' }}>
//                 <div className="stat-top">
//                   <div style={{ width:'46px', height:'46px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', background:s.bg }}>{s.icon}</div>
//                 </div>
//                 <div style={{ fontSize:'2.25rem', fontWeight:800, color:s.color, lineHeight:1, marginBottom:'4px' }}>{report[s.key]}</div>
//                 <div className="stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>

//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
//             <div className="card">
//               <div className="card-header">📌 By Leave Type</div>
//               <div className="card-body">
//                 {report.requestsByLeaveType && Object.keys(report.requestsByLeaveType).length > 0
//                   ? Object.entries(report.requestsByLeaveType).map(([type, count]) => {
//                       const pct = report.totalRequests > 0 ? Math.round((count / report.totalRequests) * 100) : 0;
//                       return (
//                         <div key={type} style={{ marginBottom:'14px' }}>
//                           <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'6px' }}>
//                             <span style={{ color:'#94a3b8', fontWeight:500 }}>{type}</span>
//                             <span style={{ fontWeight:700, color:'#f1f5f9' }}>{count} ({pct}%)</span>
//                           </div>
//                           <div className="progress">
//                             <div className="progress-bar" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#00d4aa,#7c5cfc)' }} />
//                           </div>
//                         </div>
//                       );
//                     })
//                   : <p style={{ color:'#64748b', fontSize:'.875rem' }}>No data for this period</p>}
//               </div>
//             </div>

//             <div className="card">
//               <div className="card-header">🏢 By Department</div>
//               <div className="card-body">
//                 {report.requestsByDepartment && Object.keys(report.requestsByDepartment).length > 0
//                   ? Object.entries(report.requestsByDepartment).map(([dept, count]) => {
//                       const pct = report.totalRequests > 0 ? Math.round((count / report.totalRequests) * 100) : 0;
//                       return (
//                         <div key={dept} style={{ marginBottom:'14px' }}>
//                           <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'6px' }}>
//                             <span style={{ color:'#94a3b8', fontWeight:500 }}>{dept}</span>
//                             <span style={{ fontWeight:700, color:'#f1f5f9' }}>{count} ({pct}%)</span>
//                           </div>
//                           <div className="progress">
//                             <div className="progress-bar" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#7c5cfc,#ec4899)' }} />
//                           </div>
//                         </div>
//                       );
//                     })
//                   : <p style={{ color:'#64748b', fontSize:'.875rem' }}>No department data</p>}
//               </div>
//             </div>

//             <div className="card" style={{ gridColumn:'span 2' }}>
//               <div className="card-header">📊 Status Breakdown</div>
//               <div className="card-body">
//                 <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
//                   {STATUS_CONFIG.map(s => {
//                     const count = report[s.key] || 0;
//                     const pct   = report.totalRequests > 0 ? Math.round((count / report.totalRequests) * 100) : 0;
//                     return (
//                       <div key={s.key} style={{ textAlign:'center', padding:'20px', background:s.bg, borderRadius:'14px', border:`1px solid ${s.color}25` }}>
//                         <div style={{ fontSize:'2rem', fontWeight:800, color:s.color }}>{count}</div>
//                         <div style={{ fontSize:'.8rem', color:s.color, fontWeight:700, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'.5px' }}>{s.label}</div>
//                         <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#475569' }}>{pct}%</div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default HrReports;


import React, { useState, useEffect } from 'react';
import { Alert, Form, Row, Col } from 'react-bootstrap';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
const today = () => new Date().toISOString().split('T')[0];
const firstOfMonth = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),1).toISOString().split('T')[0]; };
const HrReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(today());
  const fetchReport = async () => { setLoading(true); setError(''); try { setReport(await hrService.getReport(from, to)); } catch { setError('Failed to generate report'); } finally { setLoading(false); } };
  useEffect(() => { fetchReport(); }, []);
  const STATUS_CONFIG = [
    { key:'approvedRequests',  label:'Approved',  color:'var(--success)',  bg:'var(--success-light)',  icon:'✅' },
    { key:'pendingRequests',   label:'Pending',   color:'var(--warning)',  bg:'var(--warning-light)',  icon:'⏳' },
    { key:'rejectedRequests',  label:'Rejected',  color:'var(--danger-dark)', bg:'var(--danger-light)', icon:'❌' },
    { key:'cancelledRequests', label:'Cancelled', color:'var(--text-3)', bg:'var(--bg-2)', icon:'🚫' },
  ];
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">📈 Leave Reports</h1><p className="page-subtitle">Company-wide leave analytics</p></div></div>
      <div className="card mb-4">
        <div className="card-body">
          <Row className="align-items-end">
            <Col md={4}><Form.Group><Form.Label>From Date</Form.Label><Form.Control type="date" value={from} onChange={e=>setFrom(e.target.value)}/></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>To Date</Form.Label><Form.Control type="date" value={to} max={today()} onChange={e=>setTo(e.target.value)}/></Form.Group></Col>
            <Col md={4}><button className="btn btn-primary w-100" onClick={fetchReport} disabled={loading} style={{ justifyContent:'center' }}>{loading?'Generating…':'📊 Generate Report'}</button></Col>
          </Row>
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <LoadingSpinner message="Generating report…" /> : report && (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:'24px' }}>
            <div className="stat-card blue"><div className="stat-top"><div className="stat-icon blue">📋</div></div><div className="stat-value blue">{report.totalRequests}</div><div className="stat-label">Total</div></div>
            {STATUS_CONFIG.map(s=>(
              <div key={s.key} className="card" style={{ padding:'20px', borderTop:`3px solid ${s.color}` }}>
                <div style={{ fontSize:'1.75rem', marginBottom:'4px' }}>{s.icon}</div>
                <div style={{ fontSize:'2rem', fontWeight:800, color:s.color }}>{report[s.key]}</div>
                <div style={{ fontSize:'.8rem', color:'var(--text-3)', fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <div className="card">
              <div className="card-header">📌 By Leave Type</div>
              <div className="card-body">
                {report.requestsByLeaveType && Object.keys(report.requestsByLeaveType).length>0
                  ? Object.entries(report.requestsByLeaveType).map(([type,count])=>{
                      const pct=report.totalRequests>0?Math.round((count/report.totalRequests)*100):0;
                      return(<div key={type} style={{ marginBottom:'14px' }}><div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'6px' }}><span style={{ color:'var(--text-2)', fontWeight:500 }}>{type}</span><span style={{ fontWeight:700, color:'var(--text-1)' }}>{count} ({pct}%)</span></div><div className="progress"><div className="progress-bar bg-success" style={{ width:`${pct}%`, background:'var(--primary)' }}/></div></div>);
                    })
                  : <p style={{ color:'var(--text-3)', fontSize:'.875rem' }}>No data for this period</p>}
              </div>
            </div>
            <div className="card">
              <div className="card-header">🏢 By Department</div>
              <div className="card-body">
                {report.requestsByDepartment && Object.keys(report.requestsByDepartment).length>0
                  ? Object.entries(report.requestsByDepartment).map(([dept,count])=>{
                      const pct=report.totalRequests>0?Math.round((count/report.totalRequests)*100):0;
                      return(<div key={dept} style={{ marginBottom:'14px' }}><div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'6px' }}><span style={{ color:'var(--text-2)', fontWeight:500 }}>{dept}</span><span style={{ fontWeight:700, color:'var(--text-1)' }}>{count} ({pct}%)</span></div><div className="progress"><div className="progress-bar" style={{ width:`${pct}%`, background:'var(--coral)' }}/></div></div>);
                    })
                  : <p style={{ color:'var(--text-3)', fontSize:'.875rem' }}>No department data</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default HrReports;
