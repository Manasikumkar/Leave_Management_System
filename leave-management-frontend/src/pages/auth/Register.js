// import React, { useState } from 'react';
// import { Form, Alert, Row, Col } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const Register = () => {
//   const [formData, setFormData] = useState({ email:'', password:'', firstName:'', lastName:'' });
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState('');
//   const [success, setSuccess]   = useState('');
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault(); setError(''); setSuccess('');
//     if (formData.password !== confirmPassword) return setError('Passwords do not match');
//     if (formData.password.length < 8) return setError('Password must be at least 8 characters');
//     setLoading(true);
//     try {
//       await register(formData);
//       setSuccess('Account created! Redirecting…');
//       setTimeout(() => navigate('/dashboard'), 1500);
//     } catch (err) { setError(err.message || 'Registration failed'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-left">
//         <div className="auth-left-content">
//           <div className="auth-left-logo">🚀</div>
//           <h1>Join Your Team's<br/>Leave Platform</h1>
//           <p>Create your account and start managing your leaves digitally. Quick setup, instant access.</p>
//           <div style={{ background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)', borderRadius:'14px', padding:'20px', marginTop:'24px' }}>
//             {[
//               { icon:'✅', text:'Free employee account' },
//               { icon:'⚡', text:'Instant leave balance setup' },
//               { icon:'🔒', text:'Secure & private data' },
//             ].map((item, i) => (
//               <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
//                 <span style={{ fontSize:'1rem' }}>{item.icon}</span>
//                 <span style={{ color:'#94a3b8', fontSize:'.875rem', fontWeight:500 }}>{item.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="auth-right">
//         <div className="auth-card">
//           <div style={{ marginBottom:'28px' }}>
//             <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
//               <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#00d4aa,#00a884)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>📋</div>
//               <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#00d4aa' }}>LeaveMS</span>
//             </div>
//             <h2 className="auth-heading">Create account</h2>
//             <p className="auth-subtext">Joins as Employee — HR can upgrade your role later</p>
//           </div>

//           {error   && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col xs={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>First Name</Form.Label>
//                   <Form.Control name="firstName" placeholder="John"
//                     value={formData.firstName} onChange={handleChange} required />
//                 </Form.Group>
//               </Col>
//               <Col xs={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Last Name</Form.Label>
//                   <Form.Control name="lastName" placeholder="Doe"
//                     value={formData.lastName} onChange={handleChange} required />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Form.Group className="mb-3">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control type="email" name="email" placeholder="you@company.com"
//                 value={formData.email} onChange={handleChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control type="password" name="password" placeholder="Min. 8 characters"
//                 value={formData.password} onChange={handleChange} required />
//             </Form.Group>
//             <Form.Group className="mb-4">
//               <Form.Label>Confirm Password</Form.Label>
//               <Form.Control type="password" placeholder="Repeat password"
//                 value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
//             </Form.Group>
//             <button type="submit" className="btn btn-primary w-100 btn-lg mb-4"
//               disabled={loading} style={{ justifyContent:'center' }}>
//               {loading ? 'Creating account…' : '✅ Create Account'}
//             </button>
//           </Form>

//           <p style={{ textAlign:'center', fontSize:'.875rem', color:'#64748b', margin:0 }}>
//             Already have an account?{' '}
//             <Link to="/login" style={{ color:'#00d4aa', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData]       = useState({ email:'', password:'', firstName:'', lastName:'' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (formData.password !== confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await register(formData);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) { setError(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">🚀</div>
          <h1>Join Your Organization's Leave Platform</h1>
          <p>Create your employee account and start managing your leaves digitally. Quick setup, instant access.</p>
          <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'14px', padding:'20px', marginTop:'24px' }}>
            {[
              { icon:'✅', text:'Free employee account' },
              { icon:'⚡', text:'Instant leave balance setup — 20 days allocated' },
              { icon:'🔒', text:'Secure & private — your data is safe' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'9px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                <span style={{ fontSize:'1rem' }}>{item.icon}</span>
                <span style={{ color:'rgba(255,255,255,.75)', fontSize:'.875rem', fontWeight:500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
            <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#2c3e7a,#4a5fa8)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>📋</div>
            <span style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--primary)' }}>LeaveMS</span>
          </div>
          <h2 className="auth-heading">Create account</h2>
          <p className="auth-subtext">You'll join as Employee — HR can upgrade your role later</p>

          {error   && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required /></Form.Group></Col>
              <Col xs={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Email address</Form.Label><Form.Control type="email" name="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" name="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-4"><Form.Label>Confirm Password</Form.Label><Form.Control type="password" placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></Form.Group>
            <button type="submit" className="btn btn-primary w-100 btn-lg mb-4" disabled={loading} style={{ justifyContent:'center' }}>
              {loading ? 'Creating account…' : '✅ Create Account'}
            </button>
          </Form>
          <p style={{ textAlign:'center', fontSize:'.875rem', color:'var(--text-3)', margin:0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;



