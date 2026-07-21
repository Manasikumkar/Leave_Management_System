// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Alert } from 'react-bootstrap';
// import { useAuth } from '../../contexts/AuthContext';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDate, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

// const StatCard = ({ icon, value, label, color }) => (
//   <div className={`stat-card ${color}`}>
//     <div className="stat-top">
//       <div className={`stat-icon ${color}`}>{icon}</div>
//     </div>
//     <div className={`stat-value ${color}`}>{value}</div>
//     <div className="stat-label">{label}</div>
//   </div>
// );

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [balance, setBalance]           = useState(null);
//   const [recentLeaves, setRecentLeaves] = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         const [bal, leaves] = await Promise.all([
//           leaveService.getLeaveBalance(),
//           leaveService.getMyLeaveRequests(),
//         ]);
//         setBalance(bal);
//         setRecentLeaves(leaves.slice(0, 5));
//       } catch { setError('Failed to load dashboard data'); }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   const usedPct = balance ? Math.round((balance.usedLeaveDays / balance.totalLeaveDays) * 100) : 0;

//   return (
//     <div>
//       {/* Welcome Banner */}
//       <div className="welcome-banner">
//         <div style={{ position:'relative', zIndex:1 }}>
//           <h2>👋 Welcome back, {user?.firstName}!</h2>
//           <p>Here's your leave summary for today — {new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long' })}</p>
//         </div>
//         <Link to="/leave/new" className="btn btn-grad" style={{ position:'relative', zIndex:1 }}>➕ Request Leave</Link>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {/* Stats */}
//       <div className="stats-grid">
//         <StatCard icon="💰" value={balance?.remainingLeaveDays ?? 0} label="Remaining Days"   color="green"  />
//         <StatCard icon="📅" value={balance?.usedLeaveDays ?? 0}      label="Used Days"         color="orange" />
//         <StatCard icon="📋" value={balance?.totalLeaveDays ?? 0}      label="Total Allocated"   color="blue"   />
//         <StatCard icon="📁" value={recentLeaves.length}               label="Total Requests"    color="purple" />
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px' }}>
//         {/* Recent Leaves */}
//         <div className="card">
//           <div className="card-header">
//             <span>Recent Leave Requests</span>
//             <Link to="/leaves" className="btn btn-outline-primary btn-sm">View All →</Link>
//           </div>
//           {recentLeaves.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-state-icon">📭</div>
//               <h4>No leave requests yet</h4>
//               <p>Your leave history will appear here</p>
//               <Link to="/leave/new" className="btn btn-primary btn-sm">Create First Request</Link>
//             </div>
//           ) : (
//             <div style={{ overflowX:'auto' }}>
//               <table className="table table-hover">
//                 <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th></th></tr></thead>
//                 <tbody>
//                   {recentLeaves.map(l => (
//                     <tr key={l.id}>
//                       <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
//                       <td style={{ fontSize:'.8125rem' }}>{formatDate(l.startDate)} → {formatDate(l.endDate)}</td>
//                       <td><strong style={{ color:'#f1f5f9' }}>{l.numberOfDays}d</strong></td>
//                       <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
//                       <td><Link to={`/leaves/${l.id}`} className="btn btn-outline-primary btn-sm">View</Link></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Right Column */}
//         <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
//           {/* Donut Balance */}
//           <div className="card">
//             <div className="card-header">Leave Balance</div>
//             <div className="card-body">
//               <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'20px' }}>
//                 <div style={{ position:'relative', width:'80px', height:'80px', flexShrink:0 }}>
//                   <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'80px', height:'80px' }}>
//                     <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3" />
//                     <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00d4aa" strokeWidth="3"
//                       strokeDasharray={`${usedPct} ${100 - usedPct}`} strokeLinecap="round"
//                       style={{ filter:'drop-shadow(0 0 6px rgba(0,212,170,.6))' }} />
//                   </svg>
//                   <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:800, color:'#00d4aa' }}>
//                     {usedPct}%
//                   </div>
//                 </div>
//                 <div>
//                   <div style={{ fontSize:'1.75rem', fontWeight:800, color:'#00d4aa', lineHeight:1 }}>{balance?.remainingLeaveDays ?? 0}</div>
//                   <div style={{ fontSize:'.8rem', color:'#64748b', marginTop:'3px' }}>days available</div>
//                 </div>
//               </div>
//               <div className="detail-row"><span className="detail-label">Total</span><span className="detail-value">{balance?.totalLeaveDays ?? 0}d</span></div>
//               <div className="detail-row"><span className="detail-label">Used</span><span className="detail-value" style={{ color:'#f59e0b' }}>{balance?.usedLeaveDays ?? 0}d</span></div>
//               <div className="detail-row"><span className="detail-label">Remaining</span><span className="detail-value" style={{ color:'#00d4aa' }}>{balance?.remainingLeaveDays ?? 0}d</span></div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="card">
//             <div className="card-header">Quick Actions</div>
//             <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
//               <Link to="/leave/new"      className="btn btn-primary w-100" style={{ justifyContent:'center' }}>📝 Request Leave</Link>
//               <Link to="/leaves"         className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📋 My Leaves</Link>
//               <Link to="/leave/balance"  className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>💰 Leave Balance</Link>
//               <Link to="/leave/advances" className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>⏫ Leave Advance</Link>
//               <Link to="/leave/donate"   className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>🤝 Donate Leave</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getStatusClass, getLeaveTypeClass, formatLeaveType } from '../../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance]           = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [bal, leaves] = await Promise.all([leaveService.getLeaveBalance(), leaveService.getMyLeaveRequests()]);
        setBalance(bal); setRecentLeaves(leaves.slice(0, 5));
      } catch { setError('Failed to load dashboard data'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  const usedPct = balance ? Math.round((balance.usedLeaveDays / balance.totalLeaveDays) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div style={{ position:'relative', zIndex:1 }}>
          <h2>{greeting}, {user?.firstName}! 👋</h2>
          <p>Here's your leave overview for today — {new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <Link to="/leave/new" className="btn btn-grad">✏️ Apply for Leave</Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-top"><div className="stat-icon blue">📅</div></div>
          <div className="stat-value blue">{balance?.totalLeaveDays ?? 0}</div>
          <div className="stat-label">Total Leave Days</div>
        </div>
        <div className="stat-card green">
          <div className="stat-top"><div className="stat-icon green">✅</div></div>
          <div className="stat-value green">{balance?.remainingLeaveDays ?? 0}</div>
          <div className="stat-label">Days Remaining</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-top"><div className="stat-icon orange">⏳</div></div>
          <div className="stat-value orange">{recentLeaves.filter(l=>l.status==='PENDING').length}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card coral">
          <div className="stat-top"><div className="stat-icon coral">📋</div></div>
          <div className="stat-value coral">{balance?.usedLeaveDays ?? 0}</div>
          <div className="stat-label">Days Used</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
        {/* Recent Leaves */}
        <div className="card">
          <div className="card-header">
            <span>Recent Leave Requests</span>
            <Link to="/leaves" className="btn btn-outline-primary btn-sm">View All →</Link>
          </div>
          {recentLeaves.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h4>No leave requests yet</h4>
              <p>Your leave history will appear here</p>
              <Link to="/leave/new" className="btn btn-primary btn-sm">Apply for Leave</Link>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="table table-hover">
                <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {recentLeaves.map(l => (
                    <tr key={l.id}>
                      <td><span className={getLeaveTypeClass(l.leaveType)}>{formatLeaveType(l.leaveType)}</span></td>
                      <td style={{ fontSize:'.8125rem' }}>{formatDate(l.startDate)} → {formatDate(l.endDate)}</td>
                      <td><strong style={{ color:'var(--primary)' }}>{l.numberOfDays}d</strong></td>
                      <td><span className={getStatusClass(l.status)}>{l.status}</span></td>
                      <td><Link to={`/leaves/${l.id}`} className="btn btn-outline-primary btn-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Donut Balance */}
          <div className="card">
            <div className="card-header">Leave Balance</div>
            <div className="card-body">
              <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'20px' }}>
                <div style={{ position:'relative', width:'84px', height:'84px', flexShrink:0 }}>
                  <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'84px', height:'84px' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--bg-2)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="3.5"
                      strokeDasharray={`${usedPct} ${100 - usedPct}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                    <span style={{ fontSize:'.875rem', fontWeight:800, color:'var(--primary)' }}>{usedPct}%</span>
                    <span style={{ fontSize:'.6rem', color:'var(--text-3)' }}>used</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{balance?.remainingLeaveDays ?? 0}</div>
                  <div style={{ fontSize:'.8rem', color:'var(--text-3)', marginTop:'3px' }}>days available</div>
                </div>
              </div>
              <div className="detail-row"><span className="detail-label">Total Allocated</span><span className="detail-value">{balance?.totalLeaveDays ?? 0}d</span></div>
              <div className="detail-row"><span className="detail-label">Used</span><span className="detail-value" style={{ color:'var(--warning)' }}>{balance?.usedLeaveDays ?? 0}d</span></div>
              <div className="detail-row"><span className="detail-label">Remaining</span><span className="detail-value" style={{ color:'var(--success)' }}>{balance?.remainingLeaveDays ?? 0}d</span></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">Quick Actions</div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <Link to="/leave/new"      className="btn btn-coral w-100" style={{ justifyContent:'center' }}>✏️ Apply for Leave</Link>
              <Link to="/leaves"         className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>📋 My Leaves</Link>
              <Link to="/leave/balance"  className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>💰 Leave Balance</Link>
              <Link to="/leave/advances" className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>⏫ Leave Advance</Link>
              <Link to="/leave/donate"   className="btn btn-outline-secondary w-100" style={{ justifyContent:'center' }}>🤝 Donate Leave</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

