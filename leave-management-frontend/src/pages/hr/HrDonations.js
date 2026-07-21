
// import React, { useState, useEffect } from 'react';
// import { Alert, Modal } from 'react-bootstrap';
// import { hrService } from '../../services/hrService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { formatDateTime, getStatusClass } from '../../utils/helpers';

// const HrDonations = () => {
//   const [donations, setDonations]   = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState('');
//   const [success, setSuccess]       = useState('');
//   const [modal, setModal]           = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [tab, setTab]               = useState('pending');

//   const fetchAll = async () => {
//     try { setDonations(await hrService.getAllDonations()); }
//     catch { setError('Failed to load donations'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchAll(); }, []);

//   const handleAction = async action => {
//     setProcessing(true);
//     try {
//       if (action === 'approve') await hrService.approveDonation(modal.id);
//       else await hrService.rejectDonation(modal.id);
//       setSuccess(`Donation ${action === 'approve' ? 'approved' : 'rejected'}`);
//       setModal(null); fetchAll();
//     } catch (err) { setError(err.message); }
//     finally { setProcessing(false); }
//   };

//   if (loading) return <LoadingSpinner />;
//   const pending = donations.filter(d => d.status === 'PENDING');
//   const display = tab === 'pending' ? pending : donations;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1 className="page-title">🤝 Leave Donations</h1><p className="page-subtitle">Approve transfers of leave days between employees</p></div>
//       </div>

//       {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

//       <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'20px' }}>
//         {[
//           { icon:'⏳', value:pending.length, label:'Pending', color:'orange' },
//           { icon:'✅', value:donations.filter(d=>d.status==='APPROVED').length, label:'Approved', color:'green' },
//           { icon:'❌', value:donations.filter(d=>d.status==='REJECTED').length, label:'Rejected', color:'red' },
//         ].map(s => (
//           <div key={s.label} className={`stat-card ${s.color}`}>
//             <div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div>
//             <div className={`stat-value ${s.color}`}>{s.value}</div>
//             <div className="stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div className="card">
//         <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
//           {[['pending',`Pending (${pending.length})`],['all',`All (${donations.length})`]].map(([t, label]) => (
//             <button key={t} onClick={() => setTab(t)} style={{ padding:'14px 20px', border:'none', background:'none', fontWeight:700, fontSize:'.875rem', color: tab===t ? '#00d4aa' : '#64748b', borderBottom: tab===t ? '2px solid #00d4aa' : '2px solid transparent', cursor:'pointer' }}>{label}</button>
//           ))}
//         </div>
//         {display.length === 0 ? (
//           <div className="empty-state"><div className="empty-state-icon">🤝</div><h4>No donations</h4></div>
//         ) : (
//           <div style={{ overflowX:'auto' }}>
//             <table className="table table-hover">
//               <thead><tr><th>Donor</th><th>Recipient</th><th>Days</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {display.map(d => (
//                   <tr key={d.id}>
//                     <td><strong style={{ color:'#f1f5f9', fontSize:'.875rem' }}>{d.donorName}</strong></td>
//                     <td><strong style={{ color:'#f1f5f9', fontSize:'.875rem' }}>{d.recipientName}</strong></td>
//                     <td><strong style={{ color:'#00d4aa', fontSize:'1.1rem' }}>{d.daysDonated}</strong></td>
//                     <td style={{ maxWidth:'160px', fontSize:'.8125rem', color:'#94a3b8' }}>{d.reason || '—'}</td>
//                     <td><span className={getStatusClass(d.status)}>{d.status}</span></td>
//                     <td style={{ fontSize:'.75rem', color:'#64748b' }}>{formatDateTime(d.createdAt)}</td>
//                     <td>
//                       {d.status === 'PENDING' && (
//                         <div style={{ display:'flex', gap:'6px' }}>
//                           <button className="btn btn-success btn-sm" onClick={() => setModal(d)}>✅ Approve</button>
//                           <button className="btn btn-danger btn-sm"  onClick={() => setModal({ ...d, _reject:true })}>❌ Reject</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <Modal show={!!modal} onHide={() => setModal(null)} centered>
//         <Modal.Header closeButton><Modal.Title>{modal?._reject ? '❌ Reject' : '✅ Approve'} Donation</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {modal && (
//             <>
//               {!modal._reject && <Alert variant="info" style={{ fontSize:'.875rem' }}><strong>{modal.daysDonated} days</strong> will transfer from <strong>{modal.donorName}</strong> to <strong>{modal.recipientName}</strong>.</Alert>}
//               <div className="detail-row"><span className="detail-label">Donor</span><span className="detail-value">{modal.donorName}</span></div>
//               <div className="detail-row"><span className="detail-label">Recipient</span><span className="detail-value">{modal.recipientName}</span></div>
//               <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value" style={{ color:'#00d4aa' }}>{modal.daysDonated}</span></div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-outline-secondary" onClick={() => setModal(null)} disabled={processing}>Cancel</button>
//           <button className={`btn ${modal?._reject ? 'btn-danger' : 'btn-success'}`}
//             onClick={() => handleAction(modal?._reject ? 'reject' : 'approve')} disabled={processing} style={{ justifyContent:'center' }}>
//             {processing ? 'Processing…' : modal?._reject ? '❌ Reject' : '✅ Approve'}
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HrDonations;


import React, { useState, useEffect } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, getStatusClass } from '../../utils/helpers';
const HrDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('pending');
  const fetchAll = async () => { try { setDonations(await hrService.getAllDonations()); } catch { setError('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchAll(); }, []);
  const handleAction = async action => {
    setProcessing(true);
    try {
      if (action==='approve') await hrService.approveDonation(modal.id);
      else await hrService.rejectDonation(modal.id);
      setSuccess(`Donation ${action==='approve'?'approved':'rejected'}`);
      setModal(null); fetchAll();
    } catch (err) { setError(err.message); } finally { setProcessing(false); }
  };
  if (loading) return <LoadingSpinner />;
  const pending = donations.filter(d=>d.status==='PENDING');
  const display = tab==='pending'?pending:donations;
  return (
    <div>
      <div className="page-header"><div><h1 className="page-title">🤝 Leave Donations</h1><p className="page-subtitle">Approve transfers of leave days between employees</p></div></div>
      {error && <Alert variant="danger" dismissible onClose={()=>setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={()=>setSuccess('')}>{success}</Alert>}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:'20px' }}>
        {[{icon:'⏳',value:pending.length,label:'Pending',color:'orange'},{icon:'✅',value:donations.filter(d=>d.status==='APPROVED').length,label:'Approved',color:'green'},{icon:'❌',value:donations.filter(d=>d.status==='REJECTED').length,label:'Rejected',color:'red'}].map(s=>(
          <div key={s.label} className={`stat-card ${s.color}`}><div className="stat-top"><div className={`stat-icon ${s.color}`}>{s.icon}</div></div><div className={`stat-value ${s.color}`}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="card">
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
          {[['pending',`Pending (${pending.length})`],['all',`All (${donations.length})`]].map(([t,label])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'14px 20px', border:'none', background:'none', fontWeight:700, fontSize:'.875rem', color:tab===t?'var(--primary)':'var(--text-2)', borderBottom:tab===t?'2px solid var(--primary)':'2px solid transparent', cursor:'pointer' }}>{label}</button>
          ))}
        </div>
        {display.length===0?<div className="empty-state"><div className="empty-state-icon">🤝</div><h4>No donations</h4></div>:(
          <div style={{ overflowX:'auto' }}>
            <table className="table table-hover">
              <thead><tr><th>Donor</th><th>Recipient</th><th>Days</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {display.map(d=>(
                  <tr key={d.id}>
                    <td><strong style={{ color:'var(--text-1)', fontSize:'.875rem' }}>{d.donorName}</strong></td>
                    <td><strong style={{ color:'var(--text-1)', fontSize:'.875rem' }}>{d.recipientName}</strong></td>
                    <td><strong style={{ color:'var(--primary)', fontSize:'1.1rem' }}>{d.daysDonated}</strong></td>
                    <td style={{ maxWidth:'160px', fontSize:'.8125rem', color:'var(--text-2)' }}>{d.reason||'—'}</td>
                    <td><span className={getStatusClass(d.status)}>{d.status}</span></td>
                    <td style={{ fontSize:'.75rem', color:'var(--text-3)' }}>{formatDateTime(d.createdAt)}</td>
                    <td>{d.status==='PENDING'&&<div style={{ display:'flex', gap:'6px' }}><button className="btn btn-success btn-sm" onClick={()=>setModal(d)}>✅ Approve</button><button className="btn btn-danger btn-sm" onClick={()=>setModal({...d,_reject:true})}>❌ Reject</button></div>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal show={!!modal} onHide={()=>setModal(null)} centered>
        <Modal.Header closeButton><Modal.Title>{modal?._reject?'❌ Reject':'✅ Approve'} Donation</Modal.Title></Modal.Header>
        <Modal.Body>
          {modal&&<>
            {!modal._reject&&<Alert variant="info" style={{ fontSize:'.875rem' }}><strong>{modal.daysDonated} days</strong> will transfer from <strong>{modal.donorName}</strong> to <strong>{modal.recipientName}</strong>.</Alert>}
            <div className="detail-row"><span className="detail-label">Donor</span><span className="detail-value">{modal.donorName}</span></div>
            <div className="detail-row"><span className="detail-label">Recipient</span><span className="detail-value">{modal.recipientName}</span></div>
            <div className="detail-row"><span className="detail-label">Days</span><span className="detail-value" style={{ color:'var(--primary)' }}>{modal.daysDonated}</span></div>
          </>}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={()=>setModal(null)} disabled={processing}>Cancel</button>
          <button className={`btn ${modal?._reject?'btn-danger':'btn-success'}`} onClick={()=>handleAction(modal?._reject?'reject':'approve')} disabled={processing} style={{ justifyContent:'center' }}>{processing?'Processing…':modal?._reject?'❌ Reject':'✅ Approve'}</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default HrDonations;


