import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import photoContext from '../context/PhotoContext';
import '../sidebar.css';

const Sidebar = ({ isOpen, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery = '', setSearchQuery = () => {} } = useContext(photoContext) || {};
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    onClose();
    navigate('/login');
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    onClose();
  }, [location]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}


      <div className={`sidebar-wrapper ${isOpen ? 'active' : ''}`}>
        <div className="sidebar d-flex flex-column justify-content-between p-2">
          <div>
            <div className="sidebar-header border-bottom py-3 px-2">
              <div className="sidebar-brand d-none d-md-block fw-bold fs-5">iPhotos</div>
              <div className="sidebar-brand d-block d-md-none text-center fs-4">📷</div>
              <button className="btn-close d-md-none position-absolute end-0 top-0 m-3" onClick={onClose}></button>
            </div>

            <div className="px-2 mt-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ul className="sidebar-nav nav flex-column mt-4">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`} to="/upload" onClick={onClose}>
                  <i className="nav-icon cil-cloud-upload me-2"></i>
                  <span className="d-md-inline">Upload Photo</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`} to="/gallery" onClick={onClose}>
                  <i className="nav-icon cil-image me-2"></i>
                  <span className="d-md-inline">My Gallery</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about" onClick={onClose}>
                  <i className="nav-icon cil-info me-2"></i>
                  <span className="d-md-inline">About</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-footer border-top pt-3 px-2">
            {!isAuthenticated ? (
              <div className="d-flex flex-column gap-2 w-100">
                <Link className="btn btn-sm btn-outline-primary w-100" to="/login" onClick={onClose}>
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  <span className="d-none d-md-inline">Login</span>
                </Link>
                <Link className="btn btn-sm btn-outline-success w-100" to="/signup" onClick={onClose}>
                  <i className="nav-icon cil-user-follow me-2"></i>
                  <span className="d-none d-md-inline">Signup</span>
                </Link>
              </div>
            ) : (
              <button className="btn btn-sm btn-outline-danger w-100 mt-2" onClick={handleLogout}>
                <i className="nav-icon cil-account-logout me-2"></i>
                <span className="d-none d-md-inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
