import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch("https://backend-iphotos-production.up.railway.app/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            navigate("/login");
            alert("Signup Successful", "success");
        } else {
            alert("Invalid Credentials", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-4">
            <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Create a New Account</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={credentials.name}
                            onChange={onChange}
                            minLength={3}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={onChange}
                            required
                        />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            minLength={5}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label fw-semibold">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="cpassword"
                            name="cpassword"
                            value={credentials.cpassword}
                            onChange={onChange}
                            minLength={5}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Signup</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
