

import React from 'react';
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'280px', gap:'16px' }}>
    <div style={{ width:'44px', height:'44px', border:'3px solid var(--border)', borderTop:'3px solid var(--primary)', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
    <p style={{ color:'var(--text-3)', fontSize:'.875rem', margin:0 }}>{message}</p>
    <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
  </div>
);
export default LoadingSpinner;

