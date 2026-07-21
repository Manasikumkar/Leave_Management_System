

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDate, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

// const StatCard = ({ icon, value, label, color }) => (
//   <div className={`stat-card ${color}`}>
//     <div className="stat-top"><div className={`stat-icon ${color}`}>{icon}</div></div>
//     <div className={`stat-value ${color}`}>{value}</div>
//     <div className="stat-label">{label}</div>
//   </div>
// );

// const ManagerDashboard = () => {
//   const [pending, setPending] = useState([]);
//   const [stats, setStats]     = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [p, all] = await Promise.all([leaveService.getPendingLeaves(), leaveService.getAllLeaves()]);
//         setPending(p.slice(0, 5));
//         const approved = all.filter(l => l.status === 'APPROVED').length;
//         setStats({
//           pending:  all.filter(l => l.status === 'PENDING').length,
//           approved, rejected: all.filter(l => l.status === 'REJECTED').length,
//           total: all.length,
//           rate: all.length > 0 ? Math.round((approved / all.length) * 100) : 0,
//         });
//       } catch (e) { console.error(e); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div>
//       <div className="welcome-banner">
//         <div style={{ position:'relative', zIndex:1 }}>
//           <h2>📊 Manager Dashboard</h2>
//           <p>Overview of your team's leave activity</p>
//         </div>
//         <Link to="/manager/pending" className="btn btn-grad" style={{ position:'relative', zIndex:1 }}>⏳ Review Pending</Link>
//       </div>

//       <div className="stats-grid">
//         <StatCard icon="⏳" value={stats.pending}  label="Pending"       color="orange" />
//         <StatCard icon="✅" value={stats.approved} label="Approved"      color="green"  />
//         <StatCard icon="❌" value={stats.rejected} label="Rejected"      color="red"    />
//         <StatCard icon="📈" value={`${stats.rate}%`} label="Approval Rate" color="purple" />
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:'20px' }}>
//         <div className="card">
//           <div className="card-header">
//             <span>Pending Requests</span>
//             <Link to="/manager/pending" className="btn btn-outline-primary btn-sm">View All →</Link>
//           </div>
//           {pending.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-state-icon">✅</div>
//               <h4>All caught up!</h4>
//               <p>No pending leave requests</p>
//             </div>
//           ) : (
//             <div style={{ overflowX:'auto' }}>
//               <table className="table table-hover">
//                 <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Action</th></tr></thead>
//                 <tbody>
//                   {pending.map(l => (
//                     <tr key={l.id}>
//                       <td><strong style={{ color:'#f1f5f9', fontSize:'.875rem' }}>{l.employeeName}</strong></td>
//                       <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
//                       <td style={{ fontSize:'.8125rem' }}>{formatDate(l.startDate)} → {formatDate(l.endDate)}</td>
//                       <td><strong style={{ color:'#00d4aa' }}>{l.numberOfDays}d</strong></td>
//                       <td><Link to="/manager/pending" className="btn btn-outline-primary btn-sm">Review</Link></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
//           <div className="card">
//             <div className="card-header">Quick Actions</div>
//             <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
//               <Link to="/manager/pending"  className="btn btn-primary w-100" style={{ justifyContent:'center' }}>⏳ Review Pending</Link>
//               <Link to="/manager/all"      className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📁 All Leaves</Link>
//               <Link to="/manager/calendar" className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📅 Team Calendar</Link>
//               <Link to="/manager/team"     className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>👥 My Team</Link>
//               <Link to="/dashboard"        className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>🏠 Employee View</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';
const ManagerDashboard = () => {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const [p, all] = await Promise.all([leaveService.getPendingLeaves(), leaveService.getAllLeaves()]);
        setPending(p.slice(0,5));
        const approved = all.filter(l=>l.status==='APPROVED').length;
        setStats({ pending:all.filter(l=>l.status==='PENDING').length, approved, rejected:all.filter(l=>l.status==='REJECTED').length, total:all.length, rate:all.length>0?Math.round((approved/all.length)*100):0 });
      } catch(e){console.error(e);} finally{setLoading(false);}
    })();
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div className="welcome-banner"><div style={{ position:'relative', zIndex:1 }}><h2>📊 Leave Management</h2><p>Review and manage employee leave requests</p></div><Link to="/manager/pending" className="btn btn-grad" style={{ position:'relative', zIndex:1 }}>⏳ Review Pending</Link></div>
      <div className="stats-grid">
        {[{icon:'⏳',value:stats.pending,label:'Pending',color:'orange'},{icon:'✅',value:stats.approved,label:'Approved',color:'green'},{icon:'❌',value:stats.rejected,label:'Rejected',color:'red'},{icon:'📈',value:`${stats.rate}%`,label:'Approval Rate',color:'blue'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><span>Pending Requests</span><Link to="/manager/pending" className="btn btn-outline-primary btn-sm">View All →</Link></div>
        {pending.length===0?<div className="empty-state"><div className="empty-state-icon">✅</div><h4>All caught up!</h4></div>:(
          <div style={{ overflowX:'auto' }}>
            <table className="table table-hover">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Action</th></tr></thead>
              <tbody>
                {pending.map(l=>(
                  <tr key={l.id}>
                    <td><strong style={{ color:'var(--text-1)', fontSize:'.875rem' }}>{l.employeeName}</strong></td>
                    <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
                    <td style={{ fontSize:'.8125rem' }}>{formatDate(l.startDate)} → {formatDate(l.endDate)}</td>
                    <td><strong style={{ color:'var(--primary)' }}>{l.numberOfDays}d</strong></td>
                    <td><Link to="/manager/pending" className="btn btn-outline-primary btn-sm">Review</Link></td>
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
export default ManagerDashboard;

