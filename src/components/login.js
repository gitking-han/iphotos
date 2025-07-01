import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://backend-iphotos-production-4db8.up.railway.app/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    }); 

    const json = await response.json();
    
    if (json.success) {
      localStorage.setItem('token', json.authToken);
      alert("Login Successful", "success");
      navigate("/upload");
    } else {
      alert("Invalid Credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login to <span className="text-primary">iPhotos</span></h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={onChange}
              id="email"
              name="email"
              required
            />
            <div className="form-text">We'll never share your email.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              id="password"
              name="password"
              required
              minLength={5}
            />
          </div>
          <button disabled={credentials.password.length < 5 || !credentials.email} type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
