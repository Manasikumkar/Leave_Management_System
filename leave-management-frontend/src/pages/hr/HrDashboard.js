

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const StatCard = ({ icon, value, label, color }) => (
//   <div className={`stat-card ${color}`}>
//     <div className="stat-top"><div className={`stat-icon ${color}`}>{icon}</div></div>
//     <div className={`stat-value ${color}`}>{value}</div>
//     <div className="stat-label">{label}</div>
//   </div>
// );

// const HrDashboard = () => {
//   const [data, setData]       = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [users, advances, donations, report] = await Promise.all([
//           hrService.getAllUsers(),
//           hrService.getPendingAdvances(),
//           hrService.getPendingDonations(),
//           hrService.getReport(),
//         ]);
//         setData({ users, advances, donations, report });
//       } catch (e) { console.error(e); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   const r = data?.report || {};

//   const pendingLinks = [
//     { to:'/manager/pending', icon:'⏳', label:'Leave Requests',  count: r.pendingRequests ?? 0,       color:'#f59e0b' },
//     { to:'/hr/advances',     icon:'⏫', label:'Leave Advances',   count: data?.advances?.length ?? 0,  color:'#06b6d4' },
//     { to:'/hr/donations',    icon:'🤝', label:'Leave Donations',  count: data?.donations?.length ?? 0, color:'#00d4aa' },
//   ];

//   return (
//     <div>
//       <div className="welcome-banner">
//         <div style={{ position:'relative', zIndex:1 }}>
//           <h2>🎛️ HR Admin Dashboard</h2>
//           <p>Company-wide leave management and workforce overview</p>
//         </div>
//         <Link to="/hr/reports" className="btn btn-grad" style={{ position:'relative', zIndex:1 }}>📈 Full Report</Link>
//       </div>

//       <div className="stats-grid">
//         <StatCard icon="👥" value={data?.users?.length ?? 0} label="Total Employees"  color="green"  />
//         <StatCard icon="⏳" value={r.pendingRequests ?? 0}   label="Pending Leaves"   color="orange" />
//         <StatCard icon="✅" value={r.approvedRequests ?? 0}  label="Approved Leaves"  color="blue"   />
//         <StatCard icon="⏫" value={data?.advances?.length ?? 0} label="Pending Advances" color="cyan" />
//         <StatCard icon="🤝" value={data?.donations?.length ?? 0} label="Pending Donations" color="purple" />
//         <StatCard icon="📋" value={r.totalRequests ?? 0}     label="Total This Month" color="pink"   />
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
//         <div className="card">
//           <div className="card-header">🔔 Pending Actions</div>
//           <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
//             {pendingLinks.map(item => (
//               <Link key={item.to} to={item.to} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'rgba(255,255,255,.03)', borderRadius:'12px', textDecoration:'none', border:'1px solid rgba(255,255,255,.07)', transition:'all .15s' }}
//                 onMouseOver={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}10`; }}
//                 onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}>
//                 <span style={{ fontWeight:600, color:'#f1f5f9', display:'flex', alignItems:'center', gap:'10px' }}>
//                   {item.icon} {item.label}
//                 </span>
//                 <span style={{ background: item.count > 0 ? `${item.color}25` : 'rgba(255,255,255,.08)', color: item.count > 0 ? item.color : '#64748b', border:`1px solid ${item.count > 0 ? item.color + '40' : 'transparent'}`, borderRadius:'20px', padding:'3px 12px', fontWeight:700, fontSize:'.8125rem' }}>
//                   {item.count}
//                 </span>
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">⚡ Quick Actions</div>
//           <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
//             <Link to="/hr/users"    className="btn btn-primary w-100" style={{ justifyContent:'center' }}>👤 Manage Employees</Link>
//             <Link to="/hr/policies" className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📜 Leave Policies</Link>
//             <Link to="/hr/reports"  className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📈 Generate Report</Link>
//             <Link to="/hr/calendar" className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>🗓️ Company Calendar</Link>
//           </div>
//         </div>

//         {r.requestsByLeaveType && Object.keys(r.requestsByLeaveType).length > 0 && (
//           <div className="card">
//             <div className="card-header">📊 Leaves by Type</div>
//             <div className="card-body">
//               {Object.entries(r.requestsByLeaveType).map(([type, count]) => {
//                 const pct = r.totalRequests > 0 ? Math.round((count / r.totalRequests) * 100) : 0;
//                 return (
//                   <div key={type} style={{ marginBottom:'14px' }}>
//                     <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'6px' }}>
//                       <span style={{ color:'#94a3b8', fontWeight:500 }}>{type}</span>
//                       <span style={{ fontWeight:700, color:'#f1f5f9' }}>{count} <span style={{ color:'#64748b' }}>({pct}%)</span></span>
//                     </div>
//                     <div className="progress">
//                       <div className="progress-bar" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#00d4aa,#7c5cfc)' }} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         <div className="card">
//           <div className="card-header">📉 Status Breakdown</div>
//           <div className="card-body">
//             {[
//               { label:'Approved',  value: r.approvedRequests ?? 0,  color:'#00d4aa' },
//               { label:'Pending',   value: r.pendingRequests ?? 0,   color:'#f59e0b' },
//               { label:'Rejected',  value: r.rejectedRequests ?? 0,  color:'#ef4444' },
//               { label:'Cancelled', value: r.cancelledRequests ?? 0, color:'#64748b' },
//             ].map(s => (
//               <div key={s.label} className="detail-row">
//                 <span className="detail-label" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
//                   <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:s.color, display:'inline-block', boxShadow:`0 0 8px ${s.color}60` }} />
//                   {s.label}
//                 </span>
//                 <span className="detail-value">{s.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HrDashboard;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HrDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const [users, advances, donations, report] = await Promise.all([hrService.getAllUsers(), hrService.getPendingAdvances(), hrService.getPendingDonations(), hrService.getReport()]);
        setData({ users, advances, donations, report });
      } catch(e){console.error(e);} finally{setLoading(false);}
    })();
  }, []);
  if (loading) return <LoadingSpinner />;
  const r = data?.report || {};
  return (
    <div>
      <div className="welcome-banner">
        <div style={{position:'relative',zIndex:1}}><h2>🎛️ HR Admin Dashboard</h2><p>Company-wide leave management and workforce overview</p></div>
        <Link to="/hr/reports" className="btn btn-grad" style={{position:'relative',zIndex:1}}>📈 Full Report</Link>
      </div>
      <div className="stats-grid">
        {[{icon:'👥',value:data?.users?.length??0,label:'Total Employees',color:'blue'},{icon:'⏳',value:r.pendingRequests??0,label:'Pending Leaves',color:'orange'},{icon:'✅',value:r.approvedRequests??0,label:'Approved',color:'green'},{icon:'⏫',value:data?.advances?.length??0,label:'Pending Advances',color:'cyan'},{icon:'🤝',value:data?.donations?.length??0,label:'Pending Donations',color:'purple'},{icon:'📋',value:r.totalRequests??0,label:'Total This Month',color:'coral'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div className="card">
          <div className="card-header">🔔 Pending Actions</div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {[{to:'/manager/pending',icon:'⏳',label:'Leave Requests',count:r.pendingRequests??0},{to:'/hr/advances',icon:'⏫',label:'Leave Advances',count:data?.advances?.length??0},{to:'/hr/donations',icon:'🤝',label:'Leave Donations',count:data?.donations?.length??0}].map(item=>(
              <Link key={item.to} to={item.to} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--bg)',borderRadius:'12px',textDecoration:'none',border:'1px solid var(--border)',transition:'all .15s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.background='var(--primary-light)';}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--bg)';}}>
                <span style={{fontWeight:600,color:'var(--text-1)',display:'flex',alignItems:'center',gap:'10px'}}>{item.icon} {item.label}</span>
                <span style={{background:item.count>0?'var(--coral-light)':'var(--bg-2)',color:item.count>0?'var(--coral-dark)':'var(--text-3)',border:`1px solid ${item.count>0?'var(--coral)':'var(--border)'}`,borderRadius:'20px',padding:'3px 12px',fontWeight:700,fontSize:'.8125rem'}}>{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">⚡ Quick Actions</div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            <Link to="/hr/users"    className="btn btn-primary w-100" style={{justifyContent:'center'}}>👥 Manage Employees</Link>
            <Link to="/hr/policies" className="btn btn-outline-secondary w-100" style={{justifyContent:'center'}}>📜 Leave Policies</Link>
            <Link to="/hr/reports"  className="btn btn-outline-secondary w-100" style={{justifyContent:'center'}}>📈 Generate Report</Link>
            <Link to="/hr/calendar" className="btn btn-outline-secondary w-100" style={{justifyContent:'center'}}>🗓️ Company Calendar</Link>
          </div>
        </div>
        {r.requestsByLeaveType && Object.keys(r.requestsByLeaveType).length>0 && (
          <div className="card">
            <div className="card-header">📊 Leaves by Type</div>
            <div className="card-body">
              {Object.entries(r.requestsByLeaveType).map(([type,count])=>{
                const pct=r.totalRequests>0?Math.round((count/r.totalRequests)*100):0;
                return(<div key={type} style={{marginBottom:'14px'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:'6px'}}><span style={{color:'var(--text-2)',fontWeight:500}}>{type}</span><span style={{fontWeight:700,color:'var(--text-1)'}}>{count} ({pct}%)</span></div><div className="progress"><div className="progress-bar bg-success" style={{width:`${pct}%`,background:'var(--primary)'}}/></div></div>);
              })}
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-header">📉 Status Breakdown</div>
          <div className="card-body">
            {[{label:'Approved',value:r.approvedRequests??0,color:'var(--success)'},{label:'Pending',value:r.pendingRequests??0,color:'var(--warning)'},{label:'Rejected',value:r.rejectedRequests??0,color:'var(--danger-dark)'},{label:'Cancelled',value:r.cancelledRequests??0,color:'var(--text-3)'}].map(s=>(
              <div key={s.label} className="detail-row"><span className="detail-label" style={{display:'flex',alignItems:'center',gap:'8px'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:s.color,display:'inline-block'}}/>{s.label}</span><span className="detail-value">{s.value}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HrDashboard;
