import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 border-0">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3 text-primary">Welcome to iPhotos 📷</h2>
            <p className="text-muted">
              <strong>iPhotos</strong> is a secure, personal photo storage app built with the powerful MERN stack. Upload, view, and manage your memories with ease – anytime, from anywhere.
            </p>
            <ul className="list-unstyled text-muted">
              <li>✅ Upload photos in Base64 format</li>
              <li>✅ View your personal photo gallery</li>
              <li>✅ Secure login & protected storage</li>
              <li>✅ Fully powered by MongoDB, Express & React</li>
            </ul>
            <p className="text-muted mt-3">
              This project is built using:
              <span className="d-block">🔹 React.js (Frontend)</span>
              <span className="d-block">🔹 Node.js & Express (Backend)</span>
              <span className="d-block">🔹 MongoDB (Database)</span>
            </p>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Photo"
              className="img-fluid"
              style={{ maxWidth: '300px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
