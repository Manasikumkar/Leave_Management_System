

// import React, { useState, useEffect } from 'react';
// import { Alert } from 'react-bootstrap';
// import { leaveService } from '../../services/leaveService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const LeaveBalance = () => {
//   const [balance, setBalance] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');

//   useEffect(() => {
//     leaveService.getLeaveBalance()
//       .then(setBalance)
//       .catch(() => setError('Failed to load leave balance'))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   const usedPct      = balance ? Math.round((balance.usedLeaveDays / balance.totalLeaveDays) * 100) : 0;
//   const remainingPct = 100 - usedPct;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">💰 Leave Balance</h1><p className="page-subtitle">Your current leave allocation and usage</p></div>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}

//       <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'24px' }}>
//         {[
//           { icon:'📋', value: balance?.totalLeaveDays ?? 0,     label:'Total Days',     color:'blue'   },
//           { icon:'📅', value: balance?.usedLeaveDays ?? 0,      label:'Used Days',      color:'orange' },
//           { icon:'💰', value: balance?.remainingLeaveDays ?? 0, label:'Remaining Days', color:'green'  },
//         ].map(s => (
//           <div key={s.label} className={`stat-card ${s.color}`}>
//             <div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div>
//             <div className={`stat-value ${s.color}`}>{s.value}</div>
//             <div className="stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', alignItems:'start' }}>
//         <div className="card">
//           <div className="card-header">Balance Overview</div>
//           <div className="card-body">
//             {/* Donut Chart */}
//             <div style={{ display:'flex', alignItems:'center', gap:'32px', marginBottom:'28px' }}>
//               <div style={{ position:'relative', width:'120px', height:'120px', flexShrink:0 }}>
//                 <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'120px', height:'120px' }}>
//                   <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3" />
//                   <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00d4aa" strokeWidth="3"
//                     strokeDasharray={`${usedPct} ${100 - usedPct}`} strokeLinecap="round"
//                     style={{ filter:'drop-shadow(0 0 8px rgba(0,212,170,.5))' }} />
//                 </svg>
//                 <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
//                   <span style={{ fontSize:'1.4rem', fontWeight:800, color:'#00d4aa' }}>{usedPct}%</span>
//                   <span style={{ fontSize:'.65rem', color:'#64748b' }}>used</span>
//                 </div>
//               </div>
//               <div style={{ flex:1 }}>
//                 <div style={{ marginBottom:'16px' }}>
//                   <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.875rem', marginBottom:'8px' }}>
//                     <span style={{ color:'#94a3b8', fontWeight:500 }}>Used ({usedPct}%)</span>
//                     <span style={{ fontWeight:700, color:'#f1f5f9' }}>{balance?.usedLeaveDays} days</span>
//                   </div>
//                   <div className="progress" style={{ height:'10px' }}>
//                     <div className="progress-bar" style={{ width:`${usedPct}%`, background:'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
//                   </div>
//                 </div>
//                 <div>
//                   <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.875rem', marginBottom:'8px' }}>
//                     <span style={{ color:'#94a3b8', fontWeight:500 }}>Remaining ({remainingPct}%)</span>
//                     <span style={{ fontWeight:700, color:'#f1f5f9' }}>{balance?.remainingLeaveDays} days</span>
//                   </div>
//                   <div className="progress" style={{ height:'10px' }}>
//                     <div className="progress-bar" style={{ width:`${remainingPct}%`, background:'linear-gradient(90deg,#00d4aa,#7c5cfc)' }} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
//               {[
//                 { label:'Total',     value: balance?.totalLeaveDays ?? 0,     color:'#3b82f6' },
//                 { label:'Used',      value: balance?.usedLeaveDays ?? 0,      color:'#f59e0b' },
//                 { label:'Remaining', value: balance?.remainingLeaveDays ?? 0, color:'#00d4aa' },
//               ].map(s => (
//                 <div key={s.label} style={{ textAlign:'center', padding:'16px', background:'rgba(255,255,255,.03)', borderRadius:'12px', border:'1px solid rgba(255,255,255,.07)' }}>
//                   <div style={{ fontSize:'1.75rem', fontWeight:800, color:s.color }}>{s.value}</div>
//                   <div style={{ fontSize:'.75rem', color:'#64748b', marginTop:'4px' }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
//           <div className="card">
//             <div className="card-header">Leave Policy</div>
//             <div className="card-body">
//               {[
//                 { icon:'🌴', label:'Annual Vacation', value:'20 days/year' },
//                 { icon:'🏥', label:'Sick Leave',      value:'12 days/year' },
//                 { icon:'↪️', label:'Carry Forward',   value:'Up to 5 days'  },
//                 { icon:'⏰', label:'Notice Period',   value:'3 days min'    },
//                 { icon:'✅', label:'Approval',        value:'Manager required' },
//               ].map(p => (
//                 <div key={p.label} className="detail-row">
//                   <span className="detail-label">{p.icon} {p.label}</span>
//                   <span className="detail-value" style={{ fontSize:'.8125rem' }}>{p.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header">💡 Tips</div>
//             <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
//               {[
//                 'Submit requests at least 3 working days in advance.',
//                 'Weekends are not counted in leave duration.',
//                 'Cancelled requests restore your balance immediately.',
//               ].map((tip, i) => (
//                 <div key={i} style={{ background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)', borderRadius:'10px', padding:'10px 14px', fontSize:'.8125rem', color:'#94a3b8' }}>
//                   {tip}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveBalance;


import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { leaveService } from '../../services/leaveService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LeaveBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  useEffect(() => { leaveService.getLeaveBalance().then(setBalance).catch(()=>setError('Failed to load')).finally(()=>setLoading(false)); }, []);
  if (loading) return <LoadingSpinner />;
  const usedPct = balance ? Math.round((balance.usedLeaveDays/balance.totalLeaveDays)*100) : 0;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">💰 Leave Balance</h1><p className="page-subtitle">Your current leave allocation and usage</p></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'24px' }}>
        {[{icon:'📋',value:balance?.totalLeaveDays??0,label:'Total Allocated',color:'blue'},{icon:'📅',value:balance?.usedLeaveDays??0,label:'Days Used',color:'orange'},{icon:'💰',value:balance?.remainingLeaveDays??0,label:'Days Remaining',color:'green'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'20px',alignItems:'start'}}>
        <div className="card">
          <div className="card-header">Balance Overview</div>
          <div className="card-body">
            <div style={{display:'flex',alignItems:'center',gap:'32px',marginBottom:'28px'}}>
              <div style={{position:'relative',width:'120px',height:'120px',flexShrink:0}}>
                <svg viewBox="0 0 36 36" style={{transform:'rotate(-90deg)',width:'120px',height:'120px'}}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--bg-2)" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray={`${usedPct} ${100-usedPct}`} strokeLinecap="round"/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'1.25rem',fontWeight:800,color:'var(--primary)'}}>{usedPct}%</span>
                  <span style={{fontSize:'.65rem',color:'var(--text-3)'}}>used</span>
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{marginBottom:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'.875rem',marginBottom:'8px'}}><span style={{color:'var(--text-2)',fontWeight:500}}>Used ({usedPct}%)</span><span style={{fontWeight:700}}>{balance?.usedLeaveDays} days</span></div>
                  <div className="progress" style={{height:'12px'}}><div className="progress-bar bg-warning" style={{width:`${usedPct}%`}}/></div>
                </div>
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'.875rem',marginBottom:'8px'}}><span style={{color:'var(--text-2)',fontWeight:500}}>Remaining ({100-usedPct}%)</span><span style={{fontWeight:700}}>{balance?.remainingLeaveDays} days</span></div>
                  <div className="progress" style={{height:'12px'}}><div className="progress-bar bg-success" style={{width:`${100-usedPct}%`}}/></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div className="card">
            <div className="card-header">Leave Policy</div>
            <div className="card-body">
              {[{icon:'🌴',label:'Annual',value:'20 days/year'},{icon:'🏥',label:'Sick',value:'12 days/year'},{icon:'↪️',label:'Carry Forward',value:'Up to 5 days'},{icon:'⏰',label:'Notice',value:'3 days min'},{icon:'✅',label:'Approval',value:'HR required'}].map(p=>(
                <div key={p.label} className="detail-row"><span className="detail-label">{p.icon} {p.label}</span><span className="detail-value" style={{fontSize:'.8125rem'}}>{p.value}</span></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">💡 Tips</div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {['Submit requests at least 3 working days early.','Weekends are not counted in leave duration.','Cancelled requests restore balance immediately.'].map((tip,i)=>(
                <div key={i} style={{background:'var(--primary-light)',border:'1px solid rgba(44,62,122,.1)',borderRadius:'10px',padding:'10px 14px',fontSize:'.8125rem',color:'var(--primary)'}}>{tip}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaveBalance;

