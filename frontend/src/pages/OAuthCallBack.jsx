import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      console.log('Token saved:', token);
      
      navigate('/dashboard');
    } else {
      console.error('No token received');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Logging you in...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
}

export default OAuthCallback;
