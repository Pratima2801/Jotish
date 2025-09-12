import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (username, password) => {
    if (username === 'testuser' && password === 'Test123') {
      setError('');
      navigate('/list'); // will add later
    } else {
      setError('❌ Invalid username or password');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="app-title">Employee Portal</h1>
        <p className="subtitle">Please log in to continue</p>
        <LoginForm onLogin={handleLogin} />
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
