import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DEMOS = [
  { label:'Employee',  icon:'👤', email:'employee@company.com', password:'Admin@123', color:'var(--mint-light)',    textColor:'var(--mint-dark)' },
  { label:'HR Admin',  icon:'🛡️',  email:'hr@company.com',       password:'Admin@123', color:'var(--primary-light)', textColor:'var(--primary)'   },
];

const FEATURES = [
  { icon:'📝', text:'Apply for leave in seconds' },
  { icon:'✅', text:'Instant HR approvals & tracking' },
  { icon:'📊', text:'Real-time leave balance insights' },
  { icon:'📈', text:'Company-wide reports & analytics' },
];

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const data = await login(email, password); navigate(data.user?.role === 'HR_ADMIN' ? '/hr' : '/dashboard'); }
    catch (err) { setError(err.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">📋</div>
          <h1>Manage Leaves.<br/>Empower Teams.<br/>Grow Together.</h1>
          <p>A modern HR platform built for fast-moving organizations. Simple, smart, and built to scale.</p>
          <div className="auth-feature-list">
            {FEATURES.map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="feat-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'28px', padding:'14px 18px', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'12px', textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,.6)', fontSize:'.8rem', margin:0 }}>
              Trusted by <strong style={{ color:'var(--coral)' }}>500+</strong> organizations worldwide
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
            <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg,#2c3e7a,#4a5fa8)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 4px 16px rgba(44,62,122,.25)' }}>📋</div>
            <span style={{ fontWeight:800, fontSize:'1.1rem', color:'var(--primary)' }}>LeaveMS</span>
          </div>

          <h2 className="auth-heading">Welcome back 👋</h2>
          <p className="auth-subtext">Sign in to access your dashboard</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Password</Form.Label>
              <div style={{ position:'relative' }}>
                <Form.Control type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:'.9rem', padding:0 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </Form.Group>

            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'20px' }}>
              <span style={{ fontSize:'.8125rem', color:'var(--primary)', fontWeight:500, cursor:'pointer' }}>
                Forgot password?
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-lg mb-4"
              disabled={loading} style={{ justifyContent:'center', background:'linear-gradient(135deg,#2c3e7a,#4a5fa8)' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </Form>

          <div className="auth-divider">Quick demo access</div>

          <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
            {DEMOS.map(d => (
              <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.password); }}
                style={{ flex:1, padding:'10px 14px', border:`1.5px solid var(--border)`, borderRadius:'10px', background:d.color, color:d.textColor, fontWeight:700, fontSize:'.8125rem', cursor:'pointer', transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>

          <p style={{ textAlign:'center', fontSize:'.875rem', color:'var(--text-3)', margin:0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;