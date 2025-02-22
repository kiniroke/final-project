import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Попытка входа:', { email: formData.email });
      
      const response = await axios.post('http://localhost:4004/api/users/login', {
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        await login(response.data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data);
      setError(error.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="auth-submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login; 